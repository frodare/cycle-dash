import { Drawable, Options } from 'roughjs/bin/core'
import { rc } from '../../canvas'

const createXDrawing = (color: string): Drawable[] => {
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

export default createXDrawing
