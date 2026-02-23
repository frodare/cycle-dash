import { setCurrentTrack } from '.'
import { store } from '../../store'

const getToken = (): string | null => store.getState().spotify.accessToken

const spotifyFetch = async (method: string, path: string): Promise<Response> => {
  const token = getToken()
  if (token == null) throw new Error('No access token')
  return await fetch(`https://api.spotify.com/v1${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` }
  })
}

const playPause = async (): Promise<void> => {
  const { currentTrack, accessToken } = store.getState().spotify
  if (accessToken == null) return

  const isPlaying = currentTrack?.isPlaying ?? false

  if (currentTrack != null) {
    store.dispatch(setCurrentTrack({ ...currentTrack, isPlaying: !isPlaying }))
  }

  try {
    await spotifyFetch('PUT', isPlaying ? '/me/player/pause' : '/me/player/play')
  } catch {
    if (currentTrack != null) {
      store.dispatch(setCurrentTrack({ ...currentTrack, isPlaying }))
    }
  }
}

const skipNext = async (): Promise<void> => {
  try {
    await spotifyFetch('POST', '/me/player/next')
  } catch {
    // ignore
  }
}

const skipPrevious = async (): Promise<void> => {
  try {
    await spotifyFetch('POST', '/me/player/previous')
  } catch {
    // ignore
  }
}

export { playPause, skipNext, skipPrevious }
