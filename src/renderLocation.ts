import { Drawable, Options } from 'roughjs/bin/core'
import { project, unproject } from './projection'
import state, { Point } from './state'
import { bearing, distance } from '@turf/turf'
import { applyToPoint, scale } from 'transformation-matrix'
import { get, trace } from 'mobx'

const createXShape = (color: string): Drawable[] => {
  const rc = state.app.rc
  const size = 15
  const s2 = size / 2

  const options: Options = {
    stroke: color,
    strokeWidth: 3,
    roughness: 1.5
  }
  return [
    rc.generator.line(-s2, -s2, s2, s2, options),
    rc.generator.line(s2, -s2, -s2, s2, options)
  ]
}

type Fn = () => void

const compass = (): Fn => {
  const rc = state.app.rc
  const ctx = state.app.ctx

  const options: Options = {
    stroke: '#444',
    strokeWidth: 1,
    roughness: 1,
    curveFitting: 1
  }

  let renderedWidth = 0

  let x = 0
  let y = 0
  let diameter = 0
  let ring: Drawable
  let ticks: Drawable[] = []
  let subTicks: Drawable[] = []

  return () => {
    if (state.app.width < 100) return

    if (renderedWidth !== state.app.width) {
      x = state.app.width / 2
      y = state.app.height / 2
      renderedWidth = state.app.width
      diameter = state.app.width - state.app.width / 20
      ring = rc.generator.circle(0, 0, diameter, options)
      ticks = new Array(8).fill(null).map(() => rc.generator.line(0, 0, 0, diameter / 12, options))
      subTicks = new Array(8).fill(null).map(() => rc.generator.line(0, 0, 0, diameter / 28, options))
    }

    ctx.save()
    ctx.translate(x, y)

    rc.draw(ring)

    const textSize = diameter / 20

    ticks.forEach((d, i) => {
      const angle = (Math.PI / 4) * i
      ctx.save()
      ctx.rotate(angle)
      ctx.translate(0, -diameter / 2)
      rc.draw(d)
      if (i === 0) {
        text('N', 0, textSize / 4, textSize, '#777')
      }
      ctx.restore()
    })
    subTicks.forEach((d, i) => {
      const angle = ((Math.PI / 4) * i) + Math.PI / 8
      ctx.save()
      ctx.rotate(angle)
      ctx.translate(0, -diameter / 2)
      rc.draw(d)
      ctx.restore()
    })
    ctx.restore()
  }
}

const locationMarker = createXShape('red')
const centerMarker = createXShape('white')
// const wp1Marker = createXShape('green')

const renderDrawable = (drawable: Drawable[], [x, y]: Point): void => {
  state.app.ctx.translate(x, y)
  drawable.forEach((d) => state.app.rc.draw(d))
  state.app.ctx.translate(-x, -y)
}

const directionOrdinal = (bearing: number): string => {
  if (bearing < 22.5) return 'N'
  if (bearing < 67.5) return 'NE'
  if (bearing < 112.5) return 'E'
  if (bearing < 157.5) return 'SE'
  if (bearing < 202.5) return 'S'
  if (bearing < 247.5) return 'SW'
  if (bearing < 292.5) return 'W'
  if (bearing < 337.5) return 'NW'
  return 'N'
}

const compassMarker = compass()

const text = (s: string, x: number, y: number, size: number, color: string): void => {
  const { ctx } = state.app
  ctx.fillStyle = color
  ctx.font = `${size}px Oswald`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(s, x, y)
}

const renderLocation = (): void => {
  const ctx = state.app.ctx
  // const { plot } = state.app.plotter

  compassMarker()

  ctx.save()

  const center = state.app.plotCenter
  // const widthM = state.app.plotWidthMeter
  // const widthPx = state.app.width
  // const plotScale = widthPx / widthM
  const plotScale = state.app.scale
  const plot = (point: Point): Point => applyToPoint(scale(plotScale), point)

  ctx.translate(state.app.width / 2, state.app.height / 2)
  ctx.translate(-center[0] * plotScale, -center[1] * plotScale)

  // console.log(state.path.drawable)

  // if (state.path.source != null) {
  //   console.log('draw source')
  //   trace(state.path.source)
  // }

  const projected = get(state.path, 'projected')
  if (projected != null) {
    console.log('draw projected')
    trace(state.path, "projected")
  }

  // if (state.path.drawable != null) {
  //   console.log('draw path')
  //   trace(state.path.drawable)
  //   state.app.rc.draw(state.path.drawable)
  // }

  // console.log(state.app.plotCenter)

  if (state.app.location != null) {
    const centerCoord = unproject(state.app.plotCenter)
    const locationCoord = state.app.location.location

    const dist = distance(centerCoord, locationCoord, { units: 'kilometers' })
    let b = bearing(locationCoord, centerCoord)
    if (b < 0) b += 360
    text(`${dist.toFixed(2)}km  ${Math.round(b)}°(${directionOrdinal(b)})`, 0, -state.app.width / 2 + state.app.width / 10, 20, 'white')
  }

  if (state.app.location != null) {
    const [x1, y1] = plot(project(state.app.location.location))
    const [x2, y2] = plot(state.app.plotCenter)

    state.app.rc.line(x1, y1, x2, y2, {
      stroke: '#f008',
      strokeWidth: 2,
      roughness: 1,
      dashGap: 0.5,
      dashOffset: 0.5,
      strokeLineDash: [10, 20]
    })
  }

  if (state.app.trackPath != null) {
    state.app.rc.draw(state.app.trackPath)
  }

  if (state.app.location != null) {
    renderDrawable(locationMarker, plot(project(state.app.location.location)))
  }

  // renderDrawable(wp1Marker, plot(project([-84.316803, 30.361415])))
  renderDrawable(centerMarker, plot(state.app.plotCenter))
  ctx.restore()
}

export default renderLocation
