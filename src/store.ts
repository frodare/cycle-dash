import { configureStore } from '@reduxjs/toolkit'
import screenReducer from './features/screen'
import trackReducer from './features/track'

export const store = configureStore({
  reducer: {
    screen: screenReducer,
    track: trackReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
