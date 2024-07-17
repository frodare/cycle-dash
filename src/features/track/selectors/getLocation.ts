import { TrackPoint } from '..'
import { unproject } from '../../../projection'
import { store } from '../../../store'

const last = <T>(arr: T[]): T => arr[arr.length - 1]

const getCurrentLocation = (): TrackPoint => {
  const location = last(store.getState().track.track)
  if (location == null) {
    return { location: unproject(store.getState().screen.center), time: Date.now() }
  }
  return location
}

export default getCurrentLocation
