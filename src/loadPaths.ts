import { Feature, LineString } from 'geojson'
import geojson from './data/track1.json'
// import { project } from './projection'
import state, { LngLat } from './state'

const loadPaths = (): void => {
  const lineString = geojson.features[0] as Feature<LineString>
  state.path.update(lineString.geometry.coordinates as LngLat[])
}

export default loadPaths
