import { Component } from '..'
import getDistance from '../../features/track/selectors/getDistance'
import getTelemetry from '../../features/track/selectors/getTelemetry'
import text from '../util/text'

const telemetry: Component = (x, y, w, h) => {
  const { speed } = getTelemetry()
  const distance = getDistance()

  const u = h / 3

  text(speed.toFixed(2), x, y, w, 2 * u, { baseline: 'top', align: 'left' })
  text('km/h', x, y + 2 * u, w, u, { baseline: 'top', align: 'left' })

  text(distance.toFixed(2), x, y, w, 2 * u, { baseline: 'top', align: 'right' })
  text('km', x, y + 2 * u, w, u, { baseline: 'top', align: 'right' })
}

export default telemetry
