import { createSelector } from '@reduxjs/toolkit'
import { Drawable, Options } from 'roughjs/bin/core'
import { RootState, store } from '../../../store'
import createDrawablePath from '../util/createDrawablePath'
import { TrailEntry } from '..'

const style = (track: TrailEntry): Options => {
  if (track.type === 'savedTrack') {
    return {
      stroke: '#fffa',
      strokeWidth: 3,
      roughness: 2,
      strokeLineDash: [5, 20]
    }
  }
  return { stroke: '#fffc', strokeWidth: 3, roughness: 2 }
}

const selectDrawableTrails = createSelector(
  (state: RootState) => state.track.trails,
  (state: RootState) => state.screen.scale,
  (trails): Drawable[] => {
    const drawableTrails: Drawable[] = []
    Object.values(trails).forEach((trail) => {
      const path = trail.points
      if (path.length < 2) return
      drawableTrails.push(createDrawablePath(path, style(trail)))
    })
    return drawableTrails
  }
)

const getDrawableTrails = (): Drawable[] => selectDrawableTrails(store.getState())

export default getDrawableTrails
