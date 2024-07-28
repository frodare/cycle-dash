import { Drawable } from 'roughjs/bin/core'
import { ctx, rc } from '../../canvas'
import createPointScaler from '../../features/screen/util/createPointScaler'
import { Point } from '../../main'
import { store } from '../../store'
import createXDrawing from './createXDrawing'
import { project } from '../../projection'
import toCenterComponent from './toCenterComponent'
import getCurrentLocation from '../../features/track/selectors/getLocation'
import getDrawableTrack from '../../features/track/selectors/getDrawableTrack'
import getDrawableTrails from '../../features/track/selectors/getDrawableTrails'
import createPointerDrawing from './createPointerDrawing'
import getTelemetry from '../../features/track/selectors/getTelemetry'

const locationMarker = createPointerDrawing('red')
const centerMarker = createXDrawing('white')
// const wp1Marker = createXDrawing('green')
// const homeMarker = createXDrawing('blue')
// const marksTrailHead = createXDrawing('purple')

const renderDrawable = (drawable: Drawable[], [x, y]: Point): void => {
  ctx.translate(x, y)
  drawable.forEach((d) => rc.draw(d))
  ctx.translate(-x, -y)
}

const renderCurrentLocation = (): void => {
  const { bearing } = getTelemetry()
  const pointScaler = createPointScaler()
  const currentLocation = getCurrentLocation().location
  const projectedLocation = pointScaler(project(currentLocation))
  ctx.save()
  ctx.translate(projectedLocation[0], projectedLocation[1])
  ctx.rotate(bearing * Math.PI / 180)
  locationMarker.forEach((d) => rc.draw(d))
  ctx.restore()
}

const map = (): void => {
  const pointScaler = createPointScaler()
  const { center, width, scale, height } = store.getState().screen

  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.translate(-center[0] * scale, -center[1] * scale)
  toCenterComponent()

  const trails = getDrawableTrails()
  trails.forEach((trail) => rc.draw(trail))

  const track = getDrawableTrack()
  if (track != null) {
    rc.draw(track)
  }

  // renderDrawable(wp1Marker, pointScaler(project([-84.316803, 30.361415])))
  // renderDrawable(homeMarker, pointScaler(project([-84.226565, 30.395234])))
  // renderDrawable(marksTrailHead, pointScaler(project([-84.268047, 30.370262])))
  renderCurrentLocation()
  renderDrawable(centerMarker, pointScaler(center))
  ctx.restore()
}

export default map
