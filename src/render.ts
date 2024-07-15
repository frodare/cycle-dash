import renderLocation from './renderLocation'
import state from './state'

const text = (s: string, x: number, y: number, w: number, h: number): void => {
  const { ctx } = state.app
  ctx.fillStyle = '#fff'
  ctx.font = `${h}px Oswald`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(s, x + w / 2, y)

  // ctx.strokeStyle = 'blue'
  // ctx.strokeRect(x, y, w, h)
}

const time = (): void => {
  const size = state.app.height / 12
  const date = new Date()
  text(`${date.getHours()}:${date.getMinutes()}`, 0, size / 2, state.app.width, size)
}

const location = (): void => {
  const timeLocation = state.app.height / 6
  const size = state.app.height / 32
  const { location } = state.app
  if (location == null) return
  const [lng, lat] = location.location
  text(`${lat.toFixed(4)}  ${lng.toFixed(4)}`, 0, timeLocation + size, state.app.width, size)
  text(`${new Date(location.time).toTimeString()}`, 0, timeLocation + size + size, state.app.width, size / 2)
}

const clear = (): void => {
  const { ctx, width, height } = state.app
  if (ctx == null) return
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)
}

const render = (): void => {
  clear()
  time()
  location()
  renderLocation()
  // Time
  // Timer

  // Speed
  // Direction
  // Distance

  // Waypoint

  // Location

  // Spotify
}

export default render
