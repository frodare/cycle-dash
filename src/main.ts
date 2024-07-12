import render from './render'
import state from './state'
import './style.css'
import './location'

const clear = (): void => state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height)

const setupCanvas = (): void => {
  const scale = window.devicePixelRatio
  const heightPx = state.height
  const widthPx = state.width

  const scaledWidth = widthPx * scale
  const scaledHeight = heightPx * scale

  if (state.canvas.width !== scaledWidth || state.canvas.height !== scaledHeight) {
    state.canvas.width = widthPx * scale
    state.canvas.height = heightPx * scale
    state.canvas.style.width = `${state.width}px`
    state.canvas.style.height = `${state.height}px`
    state.ctx.scale(scale, scale)
  }

  clear()
}

const resizeCanvas = async (): Promise<void> => {
  state.height = window.innerHeight
  state.width = window.innerWidth
  setupCanvas()
  await setupFont()
  render()
}

const setupFont = async (): Promise<void> => {
  const font = new FontFace(
    'Oswald',
    'url(https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZSSUhiCXAA.woff2)'
  )

  const face = await font.load()
  document.fonts.add(face)
  render()
}

/*
TODO:
- linter
- event loop
- state manager?
- theme (light / dark)
- wake lock
- import / export KML
- save to google spreadsheet
- spotify integration
*/

/*
Milestones:
1. get time, speed, direction, distance work and test to see if the white on black screen is visible in the sun
*/

window.addEventListener('resize', () => {
  void resizeCanvas()
})

await resizeCanvas()
