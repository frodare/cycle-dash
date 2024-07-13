import debounce from 'lodash/debounce'
import render from './render'
import state, { Point } from './state'
import loadPaths from './loadPaths'

const canvas = document.body // state.canvas

let panning: Point | null = null
const evCache: PointerEvent[] = []
let prevDiff = -1

const removeEvent = (ev: PointerEvent): void => {
  // Remove this event from the target's cache
  const index = evCache.findIndex(
    (cachedEv) => cachedEv.pointerId === ev.pointerId
  )
  evCache.splice(index, 1)
}

const handleStart = (event: PointerEvent): void => {
  console.log('start', event)
  evCache.push(event)
  panning = [event.clientX, event.clientY]
}

const handleEnd = (event: PointerEvent): void => {
  console.log('end', event)
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
  const scale = state.plotWidthMeter / state.width
  const diff = [x - panning[0], y - panning[1]].map(times(scale))
  state.plotCenter = [state.plotCenter[0] + diff[1], state.plotCenter[1] + diff[0]]
  panning = [x, y]
  loadPaths()
  render()
}

const zoom = (factor: number): void => {
  state.plotWidthMeter *= factor
  loadPaths()
  render()
}

const debouncedPan = debounce(pan, 25, { leading: false, trailing: true, maxWait: 50 })
const debouncedZoom = debounce(zoom, 25, { leading: false, trailing: true, maxWait: 50 })

const handleMove = (event: PointerEvent): void => {
  debouncedPan(event.clientX, event.clientY)
  pointermoveHandler(event)
}

canvas.addEventListener('pointerdown', handleStart, false)
canvas.addEventListener('pointerup', handleEnd, false)
canvas.addEventListener('pointercancel', handleCancel, false)
canvas.addEventListener('pointermove', handleMove, false)
