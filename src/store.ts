import { configureStore } from '@reduxjs/toolkit'
import screenReducer from './features/screen'
import trackReducer from './features/track'
import spotifyReducer from './features/spotify'

export const store = configureStore({
  reducer: {
    screen: screenReducer,
    track: trackReducer,
    spotify: spotifyReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
