import { createSelector } from '@reduxjs/toolkit'
import { RootState, store } from '../../../store'
import { SpotifyState } from '..'

const selectSpotify = createSelector(
  (state: RootState) => state.spotify,
  (s): SpotifyState => s
)

const getSpotify = (): SpotifyState => selectSpotify(store.getState())

export default getSpotify
