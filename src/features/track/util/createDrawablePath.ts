import { Drawable, Options } from 'roughjs/bin/core'
import { rc } from '../../../canvas'
import { project } from '../../../projection'
import { LngLat } from '../../../main'
import { Point } from '../../../main'
import createPointScaler from '../../screen/util/createPointScaler'

const distSquared = (a: Point, b: Point): number =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

const MIN_PX_DIST_SQ = 10 ** 2

const simplifyPath = (track: LngLat[]): Point[] => {
  let lastPoint: Point | null = null
  const points: Point[] = []
  const pointScaler = createPointScaler()

  track.forEach((coord) => {
    const p = pointScaler(project(coord))
    if (lastPoint != null && distSquared(lastPoint, p) < MIN_PX_DIST_SQ) return false
    lastPoint = p
    points.push(p)
  })

  return points
}

const createDrawablePath = (path: LngLat[], options: Options): Drawable => {
  const line = simplifyPath(path)
  return rc.generator.linearPath(line, options)
}

export default createDrawablePath
