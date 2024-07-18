import { Component } from '..'
import text from '../util/text'

const time: Component = (x, y, w, h) => {
  const date = new Date()
  const s = `${date.getHours()}:${date.getMinutes()}`
  text(s, x, y, w, h, { baseline: 'top' })
}

export default time
