import { ctx } from '../../canvas'
import { Component } from '..'
import getSpotify from '../../features/spotify/selectors/getSpotify'
import text from '../util/text'

let linkSpotifyRect: DOMRect | null = null
let unlinkSpotifyRect: DOMRect | null = null
let overlayCloseRect: DOMRect | null = null

const SPOTIFY_GREEN = '#1DB954'

const drawButton = (label: string, bx: number, by: number, bw: number, bh: number, color: string): void => {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(bx, by, bw, bh, bh * 0.15)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${bh * 0.4}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, bx + bw / 2, by + bh / 2)
}

const settingsOverlay: Component = (x, y, w, h) => {
  linkSpotifyRect = null
  unlinkSpotifyRect = null
  overlayCloseRect = null

  const { settingsOpen, isLinked, currentTrack } = getSpotify()
  if (!settingsOpen) return

  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
  ctx.fillRect(x, y, w, h)

  const padding = w * 0.06
  const closeSize = h * 0.06
  const closePad = padding * 0.5
  const closeX = x + w - closeSize - closePad
  const closeY = y + closePad

  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.beginPath()
  ctx.arc(closeX + closeSize / 2, closeY + closeSize / 2, closeSize / 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = `${closeSize * 0.6}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('\u00d7', closeX + closeSize / 2, closeY + closeSize / 2)

  overlayCloseRect = new DOMRect(closeX, closeY, closeSize, closeSize)

  const titleY = y + h * 0.12
  text('Settings', x, titleY, w, h * 0.07, { baseline: 'top', align: 'center' })

  const sectionY = titleY + h * 0.12
  text('Spotify', x, sectionY, w, h * 0.05, { baseline: 'top', align: 'center', color: '#aaa' })

  const btnW = w * 0.5
  const btnH = h * 0.07
  const btnX = x + (w - btnW) / 2
  const btnY = sectionY + h * 0.1

  if (!isLinked) {
    drawButton('Link Spotify', btnX, btnY, btnW, btnH, SPOTIFY_GREEN)
    linkSpotifyRect = new DOMRect(btnX, btnY, btnW, btnH)
  } else {
    const statusY = sectionY + h * 0.07
    const trackInfo = currentTrack != null
      ? `${currentTrack.name} — ${currentTrack.artist}`
      : 'Nothing playing'
    text('Linked', x, statusY, w, h * 0.04, { baseline: 'top', align: 'center', color: SPOTIFY_GREEN })
    text(trackInfo, x + padding, statusY + h * 0.06, w - padding * 2, h * 0.035, { baseline: 'top', align: 'center', color: '#ccc' })

    drawButton('Unlink Spotify', btnX, btnY + h * 0.02, btnW, btnH, '#c0392b')
    unlinkSpotifyRect = new DOMRect(btnX, btnY + h * 0.02, btnW, btnH)
  }
}

export { linkSpotifyRect, unlinkSpotifyRect, overlayCloseRect }
export default settingsOverlay
