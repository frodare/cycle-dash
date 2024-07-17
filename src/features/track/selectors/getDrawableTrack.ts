import { createSelector } from '@reduxjs/toolkit'
import { Drawable } from 'roughjs/bin/core'
import { RootState, store } from '../../../store'
import createDrawablePath from '../util/createDrawablePath'

const selectDrawableTrack = createSelector(
  (state: RootState) => state.track.track,
  (state: RootState) => state.screen.scale,
  (track): Drawable | null => {
    if (track.length < 2) return null
    const path = track.map((p) => p.location)
    return createDrawablePath(path, { stroke: '#f005', strokeWidth: 4, roughness: 2 })
  }
)

const getDrawableTrack = (): Drawable | null => selectDrawableTrack(store.getState())

export default getDrawableTrack
