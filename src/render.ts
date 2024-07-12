import state from './state'

const text = (s: string, x: number, y: number, w: number, h: number): void => {
  const { ctx } = state
  ctx.fillStyle = '#fff'
  ctx.font = `${h}px Oswald`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(s, x + w / 2, y)

  // ctx.strokeStyle = 'blue'
  // ctx.strokeRect(x, y, w, h)
}

const time = (): void => {
  const size = state.height / 6
  const date = new Date()
  text(`${date.getHours()}:${date.getMinutes()}`, 0, size, state.width, size)
}

const location = (): void => {
  const timeLocation = state.height / 3
  const size = state.height / 24
  const { location } = state
  if (location == null) return
  const [lng, lat] = location.location
  text(`${lat.toFixed(4)}  ${lng.toFixed(4)}`, 0, timeLocation + size, state.width, size)
  text(`${new Date(location.time).toTimeString()}`, 0, timeLocation + size + size, state.width, size / 2)
}

const clear = (): void => {
  const { ctx, width, height } = state
  if (ctx == null) return
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)
}

const render = (): void => {
  clear()
  time()
  location()
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
