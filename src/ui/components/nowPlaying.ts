import { ctx } from '../../canvas'
import { Component } from '..'
import getSpotify from '../../features/spotify/selectors/getSpotify'
import text from '../util/text'

let prevRect: DOMRect | null = null
let playPauseRect: DOMRect | null = null
let nextRect: DOMRect | null = null

const SPOTIFY_GREEN = '#1DB954'

const drawButton = (label: string, bx: number, by: number, bw: number, bh: number): void => {
  ctx.fillStyle = SPOTIFY_GREEN
  ctx.beginPath()
  ctx.roundRect(bx, by, bw, bh, bh * 0.2)
  ctx.fill()
  ctx.fillStyle = '#000'
  ctx.font = `bold ${bh * 0.5}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, bx + bw / 2, by + bh / 2)
}

const nowPlaying: Component = (x, y, w, h) => {
  prevRect = null
  playPauseRect = null
  nextRect = null

  const { isLinked, currentTrack } = getSpotify()
  if (!isLinked || currentTrack == null) return

  const barH = h * 0.08
  const barY = y + h - barH
  const contentH = h - barH * 2

  const btnH = contentH * 0.8
  const btnW = btnH
  const btnY = y + (contentH - btnH) / 2
  const gap = contentH * 0.1

  const prevX = x
  const playX = prevX + btnW + gap
  const nextX = playX + btnW + gap
  const textX = nextX + btnW + gap * 2
  const textW = w - (textX - x)

  drawButton('|<', prevX, btnY, btnW, btnH)
  drawButton(currentTrack.isPlaying ? '||' : '>', playX, btnY, btnW, btnH)
  drawButton('>|', nextX, btnY, btnW, btnH)

  prevRect = new DOMRect(prevX, btnY, btnW, btnH)
  playPauseRect = new DOMRect(playX, btnY, btnW, btnH)
  nextRect = new DOMRect(nextX, btnY, btnW, btnH)

  const lineH = contentH * 0.45
  text(currentTrack.name, textX, y, textW, lineH, { baseline: 'top', align: 'left' })
  text(currentTrack.artist, textX, y + lineH, textW, lineH * 0.65, { baseline: 'top', align: 'left', color: '#aaa' })

  // progress bar track
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.roundRect(x, barY, w, barH, barH / 2)
  ctx.fill()

  // progress bar fill
  const progress = currentTrack.durationMs > 0 ? currentTrack.progressMs / currentTrack.durationMs : 0
  if (progress > 0) {
    ctx.fillStyle = SPOTIFY_GREEN
    ctx.beginPath()
    ctx.roundRect(x, barY, w * progress, barH, barH / 2)
    ctx.fill()
  }
}

export { prevRect, playPauseRect, nextRect }
export default nowPlaying
