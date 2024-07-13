import { Feature, LineString } from 'geojson'
import geojson from './data/track1.json'
import state, { Point } from './state'
import plot from './plot'

const loadPaths = (): void => {
  const lineString = geojson.features[0] as Feature<LineString>
  // const center = state.plotCenter

  // console.log('center', center)

  // const widthM = state.plotWidthMeter

  // const widthPx = state.width
  // const heightPx = state.height

  // const heightM = widthM * (heightPx / widthPx)

  // const bottom = center[1] - heightM / 2
  // const left = center[0] - widthM / 2

  // const scale = widthM / widthPx

  const plotter = plot()

  state.paths[0] = (lineString.geometry.coordinates as Point[]).map(plotter)

  // const points1 = lineString.geometry.coordinates.map((coord): LngLat => {
  //   return [coord[0], coord[1]]
  // }).map((coord): Point => {
  //   return project(coord)
  // })

  // const points = points1.map((point): Point => {
  //   return applyToPoint(plotMatrix(), [
  //     ((point[0] - left) / scale),
  //     1 * (point[1] - bottom) / scale
  //   ])
  // })

  // state.paths[0] = points
}

export default loadPaths
