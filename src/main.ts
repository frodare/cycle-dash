import render from './render'
import state from './state'
import './style.css'
import './location'
import './wakeLock'
import './interaction'
import loadPaths from './loadPaths'

const clear = (): void => state.app.ctx.clearRect(0, 0, state.app.canvas.width, state.app.canvas.height)

const setupCanvas = (): void => {
  const scale = window.devicePixelRatio
  const heightPx = state.app.height
  const widthPx = state.app.width

  const scaledWidth = widthPx * scale
  const scaledHeight = heightPx * scale

  if (state.app.canvas.width !== scaledWidth || state.app.canvas.height !== scaledHeight) {
    state.app.canvas.width = widthPx * scale
    state.app.canvas.height = heightPx * scale
    state.app.canvas.style.width = `${state.app.width}px`
    state.app.canvas.style.height = `${state.app.height}px`
    state.app.ctx.scale(scale, scale)
  }

  clear()
}

const resizeCanvas = async (): Promise<void> => {
  state.app.height = window.innerHeight
  state.app.width = window.innerWidth
  setupCanvas()
  await setupFont()
  loadPaths()
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
- fix wake lock
- direction speed distance
- scale legend
- interval render

- add current track
  - save to index db?
  - how is this cleared?
  - how is this broken into different tracks?
- lock to center
- long press edit mode
- state management that enables updates when data changes
- drop point
- move track to state

- radar overlay https://www.rainviewer.com/api/
- test projection with world outline
- import / export KML
- save to google spreadsheet
- spotify integration
*/

/*
Milestones:
1. get time, speed, direction, distance work and test to see if the white on black screen is visible in the sun
  Results:
  - speed, direction, and distance where not built yet
  - the time was very easy to read, could be smaller even!
  - trail was mostly legible but would benefit from a thicker line with maybe darker color
  - the red X for current location was damn near invisible, it should over the line and be thicker
  - wake lock would fail if app ever lost focus
  - could have benefitted from having a bearing to middle of screen system
2. fix issues from the first test and try out (speed direction and distance)
*/

loadPaths()

window.addEventListener('resize', () => {
  void resizeCanvas()
})

await resizeCanvas()
