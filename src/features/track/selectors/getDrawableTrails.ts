import { createSelector } from '@reduxjs/toolkit'
import { Drawable } from 'roughjs/bin/core'
import { RootState, store } from '../../../store'
import createDrawablePath from '../util/createDrawablePath'

const selectDrawableTrails = createSelector(
  (state: RootState) => state.track.trails,
  (state: RootState) => state.screen.scale,
  (trails): Drawable[] => {
    const drawableTrails: Drawable[] = []
    Object.values(trails).forEach((path) => {
      if (path.length < 2) return
      drawableTrails.push(createDrawablePath(path, { stroke: '#ccc', strokeWidth: 1, roughness: 2 }))
    })
    return drawableTrails
  }
)

const getDrawableTrails = (): Drawable[] => selectDrawableTrails(store.getState())

export default getDrawableTrails
