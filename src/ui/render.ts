import { ctx } from '../canvas'
import { store } from '../store'
import location from './location'
import map from './map'
import toCenterComponentTelemetry from './map/toCenterComponentTelemetry'
import time from './time'

const clear = (): void => {
  const { width, height } = store.getState().screen
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)
}

const render = (): void => {
  clear()
  time()
  location()
  map()
  toCenterComponentTelemetry()
  // renderLocation()
  // Time
  // Timer

  // Speed
  // Direction
  // Distance

  // Waypoint

  // Location

  // Spotify

  // FPS monitor
}

export default render
