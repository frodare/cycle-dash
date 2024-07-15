import debounce from 'lodash/debounce'
import render from './render'
import state, { Point } from './state'

const canvas = document.body // state.app.canvas

let panning: Point | null = null
const evCache: PointerEvent[] = []
let prevDiff = -1

const removeEvent = (ev: PointerEvent): void => {
  const index = evCache.findIndex(
    (cachedEv) => cachedEv.pointerId === ev.pointerId
  )
  evCache.splice(index, 1)
}

const handleWheel = (event: WheelEvent): void => {
  if (event.deltaY < 0) {
    debouncedZoom(0.9)
  } else {
    debouncedZoom(1.1)
  }
}

const handleStart = (event: PointerEvent): void => {
  evCache.push(event)
  panning = [event.clientX, event.clientY]
}

const handleEnd = (event: PointerEvent): void => {
  removeEvent(event)
  if (evCache.length < 2) {
    prevDiff = -1
  }
  panning = null
}

const handleCancel = (event: PointerEvent): void => {
  console.log('cancel', event)
  removeEvent(event)
  if (evCache.length < 2) {
    prevDiff = -1
  }
  panning = null
}

const pointermoveHandler = (ev: PointerEvent): void => {
  const index = evCache.findIndex(
    (cachedEv) => cachedEv.pointerId === ev.pointerId
  )
  evCache[index] = ev

  if (evCache.length === 2) {
    const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX)

    if (prevDiff > 0) {
      if (curDiff > prevDiff) {
        debouncedZoom(0.9)
      }
      if (curDiff < prevDiff) {
        debouncedZoom(1.1)
      }
    }

    prevDiff = curDiff
  }
}

const times = (n: number) => (x: number): number => x * n

const pan = (x: number, y: number): void => {
  if (evCache.length > 1) return
  if (panning == null) return
  const scale = state.app.plotWidthMeter / state.app.width
  const diff = [x - panning[0], y - panning[1]].map(times(scale))
  state.app.plotCenter = [state.app.plotCenter[0] - diff[0], state.app.plotCenter[1] - diff[1]]
  panning = [x, y]
  render()
}

const zoom = (factor: number): void => {
  state.app.plotWidthMeter *= factor
  render()
}

const debouncedPan = debounce(pan, 50, { leading: false, trailing: true, maxWait: 50 })
const debouncedZoom = debounce(zoom, 50, { leading: false, trailing: true, maxWait: 50 })

const handleMove = (event: PointerEvent): void => {
  debouncedPan(event.clientX, event.clientY)
  pointermoveHandler(event)
}

canvas.addEventListener('wheel', handleWheel, false)
canvas.addEventListener('pointerdown', handleStart, false)
canvas.addEventListener('pointerup', handleEnd, false)
canvas.addEventListener('pointercancel', handleCancel, false)
canvas.addEventListener('pointermove', handleMove, false)
