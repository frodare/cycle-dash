import { ctx } from '../canvas'
import { store } from '../store'

const text = (s: string, x: number, y: number, w: number, h: number): void => {
  ctx.fillStyle = '#fff'
  ctx.font = `${h}px Oswald`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(s, x + w / 2, y)
}

const time = (): void => {
  const { width, height } = store.getState().screen
  const size = height / 12
  const date = new Date()
  text(`${date.getHours()}:${date.getMinutes()}`, 0, size / 2, width, size)
}

export default time
