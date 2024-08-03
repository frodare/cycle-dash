import debounce from 'lodash/debounce'
import { Point } from './main'
import { store } from './store'
import { setCenter, setScale } from './features/screen'

const canvas = document.body // canvas

let panning: Point | null = null
let pressStart: number | null = null
const evCache: PointerEvent[] = []
let prevDiff = -1

let longPressTimer: number | null = null

const removeEvent = (ev: PointerEvent): void => {
  const index = evCache.findIndex(
    (cachedEv) => cachedEv.pointerId === ev.pointerId
  )
  evCache.splice(index, 1)
}

const handleWheel = (event: WheelEvent): void => {
  if (event.deltaY < 0) {
    debouncedZoom(1.1)
  } else {
    debouncedZoom(0.9)
  }
}

const handleStart = (event: PointerEvent): void => {
  console.log('start', event)
  longPressTimer = window.setTimeout(() => {
    longPressTimer = null
    console.log('long press in timeout!')
  }, 1000)
  pressStart = new Date().getTime()
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
  if (pressStart != null && new Date().getTime() - pressStart > 1000) {
    console.log('long press!')
  }
}

const handleCancel = (event: PointerEvent): void => {
  console.log('cancel', event)
  if (longPressTimer != null) window.clearTimeout(longPressTimer)

  removeEvent(event)
  if (evCache.length < 2) {
    prevDiff = -1
  }
  panning = null
}

const pointermoveHandler = (ev: PointerEvent): void => {
  pressStart = null
  if (longPressTimer != null) window.clearTimeout(longPressTimer)
  const index = evCache.findIndex(
    (cachedEv) => cachedEv.pointerId === ev.pointerId
  )
  evCache[index] = ev

  if (evCache.length === 2) {
    const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX)

    if (prevDiff > 0) {
      if (curDiff > prevDiff) {
        debouncedZoom(1.1)
      }
      if (curDiff < prevDiff) {
        debouncedZoom(0.9)
      }
    }

    prevDiff = curDiff
  }
}

const times = (n: number) => (x: number): number => x * n

const pan = (x: number, y: number): void => {
  if (evCache.length > 1) return
  if (panning == null) return
  const { scale, center } = store.getState().screen
  const diff = [x - panning[0], y - panning[1]].map(times(1 / scale))
  store.dispatch(setCenter([center[0] - diff[0], center[1] - diff[1]]))
  panning = [x, y]
}

const zoom = (factor: number): void => {
  const { scale } = store.getState().screen
  store.dispatch(setScale(scale * factor))
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
