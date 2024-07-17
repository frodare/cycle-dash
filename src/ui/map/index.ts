import { Drawable } from 'roughjs/bin/core'
import { ctx, rc } from '../../canvas'
import createPointScaler from '../../features/screen/util/createPointScaler'
import { Point } from '../../main'
import { store } from '../../store'
// import compassComponent from './compassComponent'
import createXDrawing from './createXDrawing'
import { project } from '../../projection'
import toCenterComponent from './toCenterComponent'
import getCurrentLocation from '../../features/track/selectors/getLocation'
import getDrawableTrack from '../../features/track/selectors/getDrawableTrack'
import getDrawableTrails from '../../features/track/selectors/getDrawableTrails'

const locationMarker = createXDrawing('red')
const centerMarker = createXDrawing('white')
const wp1Marker = createXDrawing('green')

const homeMarker = createXDrawing('blue')
const marksTrailHead = createXDrawing('purple')

const renderDrawable = (drawable: Drawable[], [x, y]: Point): void => {
  ctx.translate(x, y)
  drawable.forEach((d) => rc.draw(d))
  ctx.translate(-x, -y)
}

// const compassMarker = compassComponent()

// const text = (s: string, x: number, y: number, size: number, color: string): void => {
//   const { ctx } = state.app
//   ctx.fillStyle = color
//   ctx.font = `${size}px Oswald`
//   ctx.textBaseline = 'top'
//   ctx.textAlign = 'center'
//   ctx.fillText(s, x, y)
// }

const map = (): void => {
  const pointScaler = createPointScaler()
  const { center, width, scale, height } = store.getState().screen
  // compassMarker()
  const currentLocation = getCurrentLocation().location

  // const scale = 1;
  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.translate(-center[0] * scale, -center[1] * scale)
  toCenterComponent()

  // if (state.app.trackPath != null) {
  //   state.app.rc.draw(state.app.trackPath)
  // }

  const trails = getDrawableTrails()
  trails.forEach((trail) => rc.draw(trail))

  const track = getDrawableTrack()
  if (track != null) {
    rc.draw(track)
  }

  renderDrawable(locationMarker, pointScaler(project(currentLocation)))
  renderDrawable(wp1Marker, pointScaler(project([-84.316803, 30.361415])))
  renderDrawable(homeMarker, pointScaler(project([-84.226565, 30.395234])))
  renderDrawable(marksTrailHead, pointScaler(project([-84.268047, 30.370262])))
  renderDrawable(centerMarker, pointScaler(center))
  ctx.restore()
}

export default map
