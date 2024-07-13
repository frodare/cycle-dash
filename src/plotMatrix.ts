import { compose, flipY, Matrix, rotateDEG, translate } from 'transformation-matrix'
import state from './state'

const plotMatrix = (): Matrix => compose(
  translate(state.width / 2, state.height / 2),
  rotateDEG(90),
  flipY(),
  translate(-state.width / 2, -state.height / 2)
)

// const matrix = compose(
//   // translate(-widthPx / 2, -heightPx / 2),
//   translate(widthPx / 2, heightPx / 2),
//   rotateDEG(90),
//   flipY(),
//   translate(-widthPx / 2, -heightPx / 2)
// )

export default plotMatrix
