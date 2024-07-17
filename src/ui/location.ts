import { ctx } from '../canvas'
import getCurrentLocation from '../features/track/selectors/getLocation'
import { store } from '../store'

const text = (s: string, x: number, y: number, w: number, h: number): void => {
  ctx.fillStyle = '#fff'
  ctx.font = `${h}px Oswald`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(s, x + w / 2, y)
}

const location = (): void => {
  const state = store.getState()
  const { height, width } = state.screen
  const timeLocation = height / 6
  const size = height / 32
  const location = getCurrentLocation()
  const [lng, lat] = location.location
  text(`${lat.toFixed(4)}  ${lng.toFixed(4)}`, 0, timeLocation + size, width, size)
  text(`${new Date(location.time).toTimeString()}`, 0, timeLocation + size + size, width, size / 2)
}

export default location
