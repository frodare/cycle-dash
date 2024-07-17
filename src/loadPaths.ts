import { Feature, LineString } from 'geojson'
import geojson from './data/track1.json'
import { LngLat } from './main'
import { store } from './store'
import { setTrail } from './features/track'

const loadPaths = (): void => {
  const lineString = geojson.features[0] as Feature<LineString>
  store.dispatch(setTrail({
    name: 'Goldmine',
    points: lineString.geometry.coordinates as LngLat[]
  }))
}

loadPaths()

export default loadPaths
