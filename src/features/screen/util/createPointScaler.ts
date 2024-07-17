import { applyToPoint, scale } from 'transformation-matrix'
import { Point } from '../../../main'
import { store } from '../../../store'

type PointScaler = (point: Point) => Point

const createPointScaler = (): PointScaler => {
  const plotScale = store.getState().screen.scale
  return (point: Point): Point => applyToPoint(scale(plotScale), point)
}

export default createPointScaler
