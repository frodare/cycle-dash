import { ctx } from '../../canvas'
import { Component } from '..'

let settingsButtonRect: DOMRect | null = null

const settingsButton: Component = (x, y, w, h) => {
  const padding = 8
  const radius = h * 0.2
  const btnSize = radius * 2
  const btnX = x + w - btnSize - padding
  const btnY = y + padding

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.beginPath()
  ctx.arc(btnX + radius, btnY + radius, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = `${radius}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('\u2699', btnX + radius, btnY + radius)

  settingsButtonRect = new DOMRect(btnX, btnY, btnSize, btnSize)
}

export { settingsButtonRect }
export default settingsButton
