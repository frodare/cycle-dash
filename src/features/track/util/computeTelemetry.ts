import { bearing, distance } from '@turf/turf'
import { TrackPoint } from '..'

const HOUR = 60 * 60 * 1000

interface Telemetry {
  speed: number
  bearing: number
  distance: number
}

const NO_TELEMETRY: Telemetry = {
  speed: 0,
  bearing: 0,
  distance: 0
}

const computeTelemetry = (tp1: TrackPoint | null | undefined, tp2: TrackPoint | null | undefined): Telemetry => {
  if (tp1 == null || tp2 == null) return NO_TELEMETRY
  const dist = distance(tp1.location, tp2.location, { units: 'kilometers' })
  const time = (tp2.time - tp1.time) / HOUR
  if (time === 0) return NO_TELEMETRY
  const speed = dist / time
  let b = bearing(tp1.location, tp2.location)
  if (b < 0) b += 360
  return {
    speed,
    bearing: b,
    distance: dist
  }
}

export type { Telemetry }
export default computeTelemetry
