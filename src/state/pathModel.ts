import { makeAutoObservable, trace } from 'mobx'
import { RoughCanvas } from 'roughjs/bin/canvas'
import { Drawable } from 'roughjs/bin/core'
import { applyToPoint, scale } from 'transformation-matrix'
import { project } from '../projection'
import { LngLat, Point, RootStore } from '../state'

interface PathModel {
  source: LngLat[]
  projected: Point[]
  drawable: Drawable | null
  update: (source: LngLat[]) => void
}

const distSquared = (a: Point, b: Point): number =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

const MIN_PX_DIST = 10

const simplifyPath = (scale: number, track: LngLat[]): LngLat[] => {
  let lastPoint: LngLat | null = null

  const minMeterDist = MIN_PX_DIST / scale
  const minDistSquared = minMeterDist ** 2

  return track.filter((p) => {
    if (lastPoint != null && distSquared(lastPoint, p) < minDistSquared) return false
    lastPoint = p
    return true
  })
}

const createPath = (rc: RoughCanvas, plotScale: number, path: LngLat[]): Drawable => {
  console.log('createPath', path)
  const plot = (point: Point): Point => applyToPoint(scale(plotScale), point)
  const line: Point[] = []
  simplifyPath(plotScale, path).forEach((p) => {
    line.push(plot(project(p)))
  })
  return rc.generator.linearPath(line, { stroke: '#ccc', strokeWidth: 1, roughness: 2 })
}

const EMPTY = []

const pathModel = (root: RootStore): PathModel => {
  return makeAutoObservable({
    source: [] as LngLat[],
    get projected (): Point[] {
      console.log('----------------------------projected')
      // return this.source.map(project)
      return []
    },
    get drawable (): Drawable | null {
      // trace()
      // return createPath(root.app.rc, root.app.scale, this.projected)
      if (root.app.scale > 0) {
        console.log('----------------------------drawable', root.app.scale)
      }
      return null
    },
    update (source: LngLat[]): void {
      console.log('----------------------------update')
      this.source = source
    }
  })
}

// Rework this into the normal class

export type { PathModel }
export default pathModel
