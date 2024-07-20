import { Component } from '..'
import text, { textSize } from '../util/text'

const lPad = (s: string, n: number): string => {
  return s.length < n ? lPad('0' + s, n) : s
}

const time: Component = (x, y, w, h) => {
  const date = new Date()
  const hour = lPad(String(date.getHours()), 2)
  const minute = lPad(String(date.getMinutes()), 2)
  const second = lPad(String(date.getSeconds()), 2)
  const s = `${hour}:${minute}`
  text(s, x, y, w, h, { baseline: 'top' })
  const [width] = textSize(s, h)
  text(second, width / 2 + x + w / 2, y + h - h / 6, w, h / 3, { baseline: 'bottom', align: 'left' })
}

export default time
