import { createSelector } from '@reduxjs/toolkit'
import { RootState, store } from '../../../store'
import { distance } from '@turf/turf'

const selectDistance = createSelector(
  (state: RootState) => state.track.track,
  (track): number => {
    return track.reduce((acc, tp1, i) => {
      if (i === 0) return 0
      const tp2 = track[i - 1]
      const dist = distance(tp1.location, tp2.location, { units: 'kilometers' })
      return acc + dist
    }, 0)
  }
)

const getDistance = (): number => selectDistance(store.getState())

export default getDistance
