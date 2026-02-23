import debounce from 'lodash/debounce'
import { Point } from './main'
import { store } from './store'
import { setCenter, setScale } from './features/screen'
import { openSettings, closeSettings, clearTokens } from './features/spotify'
import { initiateAuth } from './features/spotify/auth'
import { playPause, skipNext, skipPrevious } from './features/spotify/api'
import { settingsButtonRect } from './ui/components/settingsButton'
import { prevRect, playPauseRect, nextRect } from './ui/components/nowPlaying'
import { linkSpotifyRect, unlinkSpotifyRect, overlayCloseRect } from './ui/components/settingsOverlay'

const LONG_PRESS_MS = 1000
const TAP_MAX_MS = 300
const ZOOM_IN_FACTOR = 1.1
const ZOOM_OUT_FACTOR = 0.9

const canvas = document.body // canvas

let panning: Point | null = null
let pressStart: number | null = null
const evCache: PointerEvent[] = []
let prevDiff = -1

let longPressTimer: number | null = null

const hitTest = (x: number, y: number, rect: DOMRect | null): boolean => {
  if (rect == null) return false
  return x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height
}

const handleTap = (x: number, y: number): void => {
  const { settingsOpen } = store.getState().spotify
  if (settingsOpen) {
    if (hitTest(x, y, overlayCloseRect)) {
      store.dispatch(closeSettings())
    } else if (hitTest(x, y, linkSpotifyRect)) {
      void initiateAuth()
    } else if (hitTest(x, y, unlinkSpotifyRect)) {
      store.dispatch(clearTokens())
    }
  } else {
    if (hitTest(x, y, settingsButtonRect)) {
      store.dispatch(openSettings())
    } else if (hitTest(x, y, playPauseRect)) {
      void playPause()
    } else if (hitTest(x, y, nextRect)) {
      void skipNext()
    } else if (hitTest(x, y, prevRect)) {
      void skipPrevious()
    }
  }
}

const removeEvent = (ev: PointerEvent): void => {
  const index = evCache.findIndex(
    (cachedEv) => cachedEv.pointerId === ev.pointerId
  )
  evCache.splice(index, 1)
}

const handleWheel = (event: WheelEvent): void => {
  if (event.deltaY < 0) {
    debouncedZoom(ZOOM_IN_FACTOR)
  } else {
    debouncedZoom(ZOOM_OUT_FACTOR)
  }
}

const handleStart = (event: PointerEvent): void => {
  longPressTimer = window.setTimeout(() => {
    longPressTimer = null
  }, LONG_PRESS_MS)
  pressStart = new Date().getTime()
  evCache.push(event)
  panning = [event.clientX, event.clientY]
}

const handleEnd = (event: PointerEvent): void => {
  const elapsed = pressStart != null ? new Date().getTime() - pressStart : Infinity
  removeEvent(event)
  if (evCache.length < 2) {
    prevDiff = -1
  }
  panning = null
  if (pressStart != null && elapsed > LONG_PRESS_MS) {
    // long press detected
  } else if (pressStart != null && evCache.length === 0 && elapsed < TAP_MAX_MS) {
    handleTap(event.clientX, event.clientY)
  }
  pressStart = null
}

const handleCancel = (event: PointerEvent): void => {
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
        debouncedZoom(ZOOM_IN_FACTOR)
      }
      if (curDiff < prevDiff) {
        debouncedZoom(ZOOM_OUT_FACTOR)
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
