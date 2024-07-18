import { Component } from '..'
import getCurrentLocation from '../../features/track/selectors/getLocation'
import text from '../util/text'

const location: Component = (x, y, w, h): void => {
  const size = h / 2
  const location = getCurrentLocation()
  const [lng, lat] = location.location

  const sLocation = `${lat.toFixed(4)}  ${lng.toFixed(4)}`
  const sDate = `${new Date(location.time).toTimeString()}`

  text(sLocation, x, y, w, size, { baseline: 'top' })
  text(sDate, x, y + size + size / 4, w, size / 2, { baseline: 'top' })
}

export default location
