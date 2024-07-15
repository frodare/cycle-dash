import { distance } from '@turf/turf'
import { makeAutoObservable } from 'mobx'
import rough from 'roughjs'
import { RoughCanvas } from 'roughjs/bin/canvas'
import { Drawable } from 'roughjs/bin/core'
import { applyToPoint, scale } from 'transformation-matrix'
import { project } from '../projection'
import { LngLat, Point, TrackPoint } from '../state'

interface AppState {
  height: number
  width: number
  plotCenter: Point
  plotWidthMeter: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  rc: RoughCanvas
  location: TrackPoint | null
  tracks: TrackPoint[]
  trackHistory: TrackPoint[]
  addTrackPoint: (trackPoint: TrackPoint) => void
  speed: number
  trackPath: Drawable | null
  scale: number
}

interface CanvasCtx {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  rc: RoughCanvas
}

const readCanvas = (): CanvasCtx => {
  const canvas = document.getElementById('app')
  if (canvas == null) throw new Error('Canvas not found')
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Canvas not found')
  const ctx = canvas.getContext('2d')
  if (ctx == null) throw new Error('Canvas not found')
  const rc = rough.canvas(canvas)
  return { canvas, ctx, rc }
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
  const plot = (point: Point): Point => applyToPoint(scale(plotScale), point)
  const line: Point[] = []
  simplifyPath(plotScale, path).forEach((p) => {
    line.push(plot(project(p)))
  })
  return rc.generator.linearPath(line, { stroke: '#ccc', strokeWidth: 1, roughness: 2 })
}

const appModel = (): AppState => {
  return makeAutoObservable<AppState>({
    height: 0,
    width: 0,
    plotCenter: project([-84.336604, 30.355065]), // [-8201821.945939356, 8932577.051546052],
    plotWidthMeter: 5000,
    location: {
      time: 0,
      location: [-84.316803, 30.361415]
    },
    tracks: [],
    trackHistory: [],
    addTrackPoint (trackPoint: TrackPoint): void {
      // console.log('addTrackPoint', trackPoint)
      this.trackHistory.push(trackPoint)
      if (this.trackHistory.length > 1000) this.trackHistory.shift()
    },
    get scale (): number {
      return this.width / this.plotWidthMeter
    },
    get trackPath () {
      return createPath(this.rc, this.scale, this.trackHistory.map((p) => project(p.location)))
    },
    get speed (): number {
      console.log('compute speed')
      if (this.trackHistory.length < 2) return 0
      const lastEntry = this.trackHistory[this.trackHistory.length - 1]
      const secondToLastEntry = this.trackHistory[this.trackHistory.length - 2]
      const timeDiff = lastEntry.time - secondToLastEntry.time
      const dist = distance(lastEntry.location, secondToLastEntry.location, { units: 'kilometers' })
      return Math.round(dist / (timeDiff / 1000 / 60 / 60))
    },
    ...readCanvas()
  })
}

export type { AppState }
export default appModel
