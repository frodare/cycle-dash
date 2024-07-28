import { rc } from '../../canvas'
import createPointScaler from '../../features/screen/util/createPointScaler'
import getCurrentLocation from '../../features/track/selectors/getLocation'
import { project } from '../../projection'
import { store } from '../../store'

const toCenterComponent = (): void => {
  const pointScaler = createPointScaler()
  const location = getCurrentLocation().location
  const center = store.getState().screen.center

  const [x1, y1] = pointScaler(project(location))
  const [x2, y2] = pointScaler(center)

  rc.line(x1, y1, x2, y2, {
    stroke: '#f00a',
    strokeWidth: 2,
    roughness: 1,
    dashGap: 0.5,
    dashOffset: 0.5,
    strokeLineDash: [10, 10]
  })
}

export default toCenterComponent
