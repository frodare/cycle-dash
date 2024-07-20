import { ctx } from '../../canvas'

interface TextOptions {
  color: string
  baseline: CanvasTextBaseline
  align: CanvasTextAlign
}

const DEFAULT_OPTIONS: TextOptions = {
  color: '#fff',
  baseline: 'bottom',
  align: 'center'
}

const EMPTY_OPTIONS: Partial<TextOptions> = {}

const textSize = (s: string, h: number): [number, number] => {
  ctx.font = `${h}px Oswald`
  const { width } = ctx.measureText(s)
  return [width, h]
}

const text = (s: string, x: number, y: number, w: number, h: number, o = EMPTY_OPTIONS): void => {
  const options = { ...DEFAULT_OPTIONS, ...o }
  ctx.fillStyle = options.color
  ctx.font = `${h}px Oswald`
  ctx.textBaseline = options.baseline
  ctx.textAlign = options.align

  let xAdjusted = x
  if (options.align === 'center') {
    xAdjusted = x + w / 2
  } else if (options.align === 'right') {
    xAdjusted = x + w
  }

  ctx.fillText(s, xAdjusted, y)
}

export { textSize }
export default text
