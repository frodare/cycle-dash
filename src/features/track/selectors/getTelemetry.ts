import { createSelector } from '@reduxjs/toolkit'
import { RootState, store } from '../../../store'
import computeTelemetry, { Telemetry } from '../util/computeTelemetry'

const selectTelemetry = createSelector(
  (state: RootState) => state.track.track,
  (state: RootState) => state.track.location,
  (track, tp1): Telemetry => {
    const tp2 = track[track.length - 1]
    const tp3 = track[track.length - 2]

    let p1 = tp2
    let p2 = tp3

    if (tp1 != null && tp1.time !== tp2.time) {
      p1 = tp1
      p2 = tp2
    }

    return computeTelemetry(p2, p1)
  }
)

const getTelemetry = (): Telemetry => selectTelemetry(store.getState())

export default getTelemetry
