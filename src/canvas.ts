import rough from 'roughjs'
import { store } from './store'
import { setSize } from './features/screen'

const scale = window.devicePixelRatio
const canvasEl = document.getElementById('app')
if (!(canvasEl instanceof HTMLCanvasElement)) throw new Error('Canvas element #app not found')
const canvas: HTMLCanvasElement = canvasEl
const ctxResult = canvas.getContext('2d')
if (ctxResult == null) throw new Error('Unable to get 2D rendering context')
const ctx: CanvasRenderingContext2D = ctxResult
let rc = rough.canvas(canvas)

const handleSizeUpdate = (): void => {
  const width = window.innerWidth
  const height = window.innerHeight
  const scaledWidth = width * scale
  const scaledHeight = height * scale
  if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
    canvas.width = width * scale
    canvas.height = height * scale
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(scale, scale)
  }
  store.dispatch(setSize({ width, height }))
  rc = rough.canvas(canvas)
}

const resizeCanvas = async (): Promise<void> => {
  handleSizeUpdate()
}

const setupFont = async (): Promise<void> => {
  const font = new FontFace(
    'Oswald',
    'url(https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZSSUhiCXAA.woff2)'
  )
  const face = await font.load()
  document.fonts.add(face)
}

const setup = async (): Promise<void> => {
  await setupFont()
  await resizeCanvas()
  window.addEventListener('resize', () => {
    void resizeCanvas()
  })
}

export { canvas, ctx, rc, setup }
