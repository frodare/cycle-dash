import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface SpotifyTrack {
  id: string
  name: string
  artist: string
  isPlaying: boolean
  durationMs: number
  progressMs: number
}

interface SpotifyState {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  currentTrack: SpotifyTrack | null
  isLinked: boolean
  settingsOpen: boolean
}

interface TokenPayload {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const initialState: SpotifyState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  currentTrack: null,
  isLinked: false,
  settingsOpen: false
}

const spotifySlice = createSlice({
  name: 'spotify',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<TokenPayload>) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.expiresAt = action.payload.expiresAt
      state.isLinked = true
    },
    clearTokens: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.expiresAt = null
      state.currentTrack = null
      state.isLinked = false
    },
    setCurrentTrack: (state, action: PayloadAction<SpotifyTrack | null>) => {
      state.currentTrack = action.payload
    },
    openSettings: (state) => {
      state.settingsOpen = true
    },
    closeSettings: (state) => {
      state.settingsOpen = false
    }
  }
})

export type { SpotifyState, SpotifyTrack, TokenPayload }
export const { setTokens, clearTokens, setCurrentTrack, openSettings, closeSettings } = spotifySlice.actions
export default spotifySlice.reducer
