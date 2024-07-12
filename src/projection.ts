import { LngLat, Point } from './state'

const project = (coordinate: LngLat): Point => {
  const [lng, lat] = coordinate
  const x = (lng + 180) / 360
  const y = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2
  return [x, y]
}

export { project }
