import { Drawable, Options } from 'roughjs/bin/core'
import { ctx, rc } from '../../canvas'
import { store } from '../../store'

type Fn = () => void

const text = (s: string, x: number, y: number, size: number, color: string): void => {
  ctx.fillStyle = color
  ctx.font = `${size}px Oswald`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(s, x, y)
}

const compassComponent = (): Fn => {
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
    const { width, height } = store.getState().screen
    if (width < 100) return

    if (renderedWidth !== width) {
      x = width / 2
      y = height / 2
      renderedWidth = width
      diameter = width - width / 20
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

export default compassComponent
