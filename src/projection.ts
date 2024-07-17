import SphericalMercator from '@mapbox/sphericalmercator'
import { LngLat, Point } from './main'

const mercator = new SphericalMercator({
  size: 256,
  antimeridian: true
})

const project = (coordinate: LngLat): Point => {
  const [x, y] = mercator.forward(coordinate)
  return [x, -y]
}

const unproject = ([x, y]: Point): LngLat => {
  return mercator.inverse([x, -y])
}

export { project, unproject }
