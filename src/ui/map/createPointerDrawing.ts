import { Drawable, Options } from 'roughjs/bin/core'
import { rc } from '../../canvas'
import { Point } from '../../main'

const createPointerDrawing = (color: string): Drawable[] => {
  const size = 30
  const s3 = size / 3
  const s4 = size / 4

  const options: Options = {
    stroke: color,
    strokeWidth: 3,
    roughness: 1.5
  }

  const p1: Point = [0, -2 * s3]
  const p2: Point = [-s4, s3]
  const p3: Point = [s4, s3]

  return [
    rc.generator.line(p1[0], p1[1], p2[0], p2[1], options),
    rc.generator.line(p1[0], p1[1], p3[0], p3[1], options),
    rc.generator.line(p2[0], p2[1], p3[0], p3[1], options)
  ]
}

export default createPointerDrawing
