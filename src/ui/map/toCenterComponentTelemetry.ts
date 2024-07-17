import { ctx } from '../../canvas'
import getTelemetryToCenter from '../../features/track/selectors/getTelemetryToCenter'
import { store } from '../../store'

const directionOrdinal = (bearing: number): string => {
  if (bearing < 22.5) return 'N'
  if (bearing < 67.5) return 'NE'
  if (bearing < 112.5) return 'E'
  if (bearing < 157.5) return 'SE'
  if (bearing < 202.5) return 'S'
  if (bearing < 247.5) return 'SW'
  if (bearing < 292.5) return 'W'
  if (bearing < 337.5) return 'NW'
  return 'N'
}

const text = (s: string, x: number, y: number, size: number, color: string): void => {
  ctx.fillStyle = color
  ctx.font = `${size}px Oswald`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(s, x, y)
}

const toCenterComponentTelemetry = (): void => {
  const { width } = store.getState().screen
  const telemetry = getTelemetryToCenter()
  const b = telemetry.bearing
  const d = telemetry.distance
  const s = `${d.toFixed(2)}km  ${Math.round(b)}°(${directionOrdinal(b)})`
  const y = width / 2 + width / 10
  const x = width / 2
  text(s, x, y, 20, 'white')
}

export default toCenterComponentTelemetry
