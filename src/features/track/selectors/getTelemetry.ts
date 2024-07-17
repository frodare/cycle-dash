import { createSelector } from '@reduxjs/toolkit'
import { RootState, store } from '../../../store'
import computeTelemetry, { Telemetry } from '../util/computeTelemetry'

const selectTelemetry = createSelector(
  (state: RootState) => state.track.track,
  (track): Telemetry => {
    return computeTelemetry(track[track.length - 2], track[track.length - 1])
  }
)

const getTelemetry = (): Telemetry => selectTelemetry(store.getState())

export default getTelemetry
