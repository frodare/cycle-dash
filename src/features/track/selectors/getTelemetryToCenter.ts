import { createSelector } from '@reduxjs/toolkit'
import { TrackPoint } from '..'
import { unproject } from '../../../projection'
import { RootState, store } from '../../../store'
import computeTelemetry, { Telemetry } from '../util/computeTelemetry'
import getCurrentLocation from './getLocation'

const selectTelemetry = createSelector(
  (state: RootState) => state.screen.center,
  getCurrentLocation,
  (center, location): Telemetry => {
    const centerCoord = unproject(center)
    const centerTrackPoint: TrackPoint = {
      time: Date.now(),
      location: centerCoord
    }
    return computeTelemetry(location, centerTrackPoint)
  }
)

const getTelemetryToCenter = (): Telemetry => selectTelemetry(store.getState())

export default getTelemetryToCenter
