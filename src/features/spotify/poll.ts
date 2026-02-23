import { clearTokens, setCurrentTrack } from '.'
import { store } from '../../store'
import { refreshAccessToken } from './auth'

const POLL_INTERVAL_IDLE = 10000
const POLL_INTERVAL_MIN = 3000
const POLL_INTERVAL_MAX = 60000
const REFRESH_BUFFER_MS = 60000

let lastResponseAt: number = Date.now()
let lastProgressMs: number = 0

const nextPollInterval = (data: SpotifyPlayerResponse | null): number => {
  if (data == null || !data.is_playing || data.item == null) return POLL_INTERVAL_IDLE
  const remaining = data.item.duration_ms - data.progress_ms
  return Math.min(Math.max(remaining + 1000, POLL_INTERVAL_MIN), POLL_INTERVAL_MAX)
}

interface SpotifyPlayerResponse {
  is_playing: boolean
  progress_ms: number
  item: {
    id: string
    name: string
    duration_ms: number
    artists: Array<{ name: string }>
  } | null
}

const poll = async (): Promise<void> => {
  const { isLinked, accessToken, refreshToken, expiresAt } = store.getState().spotify

  if (!isLinked || accessToken == null) {
    window.setTimeout(() => { void poll() }, POLL_INTERVAL_IDLE)
    return
  }

  if (expiresAt != null && refreshToken != null && Date.now() > expiresAt - REFRESH_BUFFER_MS) {
    try {
      await refreshAccessToken(refreshToken)
    } catch {
      store.dispatch(clearTokens())
      window.setTimeout(() => { void poll() }, POLL_INTERVAL_IDLE)
      return
    }
  }

  const token = store.getState().spotify.accessToken
  if (token == null) {
    window.setTimeout(() => { void poll() }, POLL_INTERVAL_IDLE)
    return
  }

    let data: SpotifyPlayerResponse | null = null

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.status === 204 || (response.status === 200 && response.headers.get('content-length') === '0')) {
      store.dispatch(setCurrentTrack(null))
    } else if (response.status === 401) {
      store.dispatch(clearTokens())
    } else if (response.ok) {
      data = await response.json() as SpotifyPlayerResponse
      if (data.item == null) {
        store.dispatch(setCurrentTrack(null))
      } else {
        lastResponseAt = Date.now()
        lastProgressMs = data.progress_ms
        store.dispatch(setCurrentTrack({
          id: data.item.id,
          name: data.item.name,
          artist: data.item.artists.map((a) => a.name).join(', '),
          isPlaying: data.is_playing,
          durationMs: data.item.duration_ms,
          progressMs: data.progress_ms
        }))
      }
    }
  } catch {
    // network error — silently retry
  }

  window.setTimeout(() => { void poll() }, nextPollInterval(data))
}

setInterval(() => {
  const { currentTrack } = store.getState().spotify
  if (currentTrack == null || !currentTrack.isPlaying) return
  const estimatedProgress = Math.min(lastProgressMs + (Date.now() - lastResponseAt), currentTrack.durationMs)
  store.dispatch(setCurrentTrack({ ...currentTrack, progressMs: estimatedProgress }))
}, 1000)

void poll()
