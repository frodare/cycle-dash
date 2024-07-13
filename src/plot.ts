import { applyToPoint } from 'transformation-matrix'
import plotMatrix from './plotMatrix'
import { project } from './projection'
import state, { LngLat, Point } from './state'

type Plotter = (coord: LngLat) => Point

const plot = (): Plotter => {
  const center = state.plotCenter
  const widthM = state.plotWidthMeter

  const widthPx = state.width
  const heightPx = state.height

  const heightM = widthM * (heightPx / widthPx)

  const bottom = center[1] - heightM / 2
  const left = center[0] - widthM / 2

  const scale = widthM / widthPx

  return (coord) => {
    const point = project(coord)
    return applyToPoint(plotMatrix(), [
      ((point[0] - left) / scale),
      1 * (point[1] - bottom) / scale
    ])
  }
}

export default plot
