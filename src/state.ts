import appModel, { AppState } from './state/appModel'
import pathModel, { PathModel } from './state/pathModel'

type LngLat = [number, number]
type Point = [number, number]

interface TrackPoint {
  time: number
  location: LngLat
}

class RootStore {
  path: PathModel
  app: AppState
  constructor () {
    this.path = pathModel(this)
    this.app = appModel()
  }
}

const store = new RootStore()

export type { LngLat, Point, RootStore, TrackPoint }
export default store
