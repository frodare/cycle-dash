type LngLat = [number, number]

interface TrackPoint {
  time: number
  location: LngLat
}

interface State {
  height: number
  width: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  location: TrackPoint | null
}

interface CanvasCtx {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

const readCanvas = (): CanvasCtx => {
  const canvas = document.getElementById('app')
  if (canvas == null) throw new Error('Canvas not found')
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Canvas not found')
  const ctx = canvas.getContext('2d')
  if (ctx == null) throw new Error('Canvas not found')
  return { canvas, ctx }
}

const state: State = {
  height: 0,
  width: 0,
  location: null,
  ...readCanvas()
}

export type { State }
export default state
