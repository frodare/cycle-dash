import { Component } from '..'
import getTelemetryToCenter from '../../features/track/selectors/getTelemetryToCenter'
import directionOrdinal from '../util/directionOrdinal'
import text from '../util/text'

const toCenterComponentTelemetry: Component = (x, y, w, h) => {
  const telemetry = getTelemetryToCenter()
  const b = telemetry.bearing
  const d = telemetry.distance
  const s = `${d.toFixed(2)}km  ${Math.round(b)}°(${directionOrdinal(b)})`
  text(s, x, y, w, h)
}

export default toCenterComponentTelemetry
