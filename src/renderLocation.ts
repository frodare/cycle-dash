import plot from './plot'
import state, { Point } from './state'

const drawX = ([x, y]: Point, color: string): void => {
  const ctx = state.ctx
  const size = 10
  ctx.strokeStyle = color
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(size, size)
  ctx.moveTo(size, 0)
  ctx.lineTo(0, size)
  ctx.stroke()
  ctx.fillRect(x - size / 2, y - size / 2, size, size)
  ctx.translate(-x, -y)
}

const renderLocation = (): void => {
  // const lineString = geojson.features[0] as Feature<LineString>

  // const trailHead = [-84.316803, 30.361415] as LngLat

  // const center = state.plotCenter
  // const centerCord = unproject(center)

  // console.log('center', center)

  // const widthM = state.plotWidthMeter

  // const widthPx = state.width
  // const heightPx = state.height

  // const heightM = widthM * (heightPx / widthPx)

  // const bottom = center[1] - heightM / 2
  // const left = center[0] - widthM / 2

  // const scale = widthM / widthPx

  // const points2 = [centerCord, trailHead]
  // if (state.location != null) {
  //   points2.push(state.location.location)
  // }
  // const points2Projected = points2.map((coord): Point => {
  //   return project(coord)
  // })

  // const matrix = plotMatrix()

  // const points = [...points2Projected, ...points1].map((point): Point => {
  //   return applyToPoint(matrix, [
  //     ((point[0] - left) / scale),
  //     1 * (point[1] - bottom) / scale
  //   ])
  // })

  const ctx = state.ctx

  const plotter = plot()

  drawX(plotter([-84.316803, 30.361415]), 'white')
  if (state.location != null) {
    drawX(plotter(state.location.location), 'red')
  }

  if (state.paths.length < 1) return

  state.paths[0].forEach(([x, y]) => {
    ctx.fillStyle = '#999'
    ctx.beginPath()
    ctx.arc(x, y, 1, 0, 2 * Math.PI)
    ctx.fill()
  })
}

export default renderLocation
