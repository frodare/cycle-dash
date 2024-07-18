import { ctx } from '../canvas'
import { RootState, store } from '../store'
import location from './components/location'
import map from './map'
import toCenterComponentTelemetry from './map/toCenterComponentTelemetry'
import time from './components/time'
import { createSelector } from '@reduxjs/toolkit'
import telemetry from './components/telemetry'

type Component = (x: number, y: number, w: number, h: number) => void

type ComponentRenderer = (component: Component, x: string, y: string, w: string, h: string) => void

const clear = (): void => {
  const { width, height } = store.getState().screen
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)
}

type UnitConverter = (n: string) => number

const converterSelector = createSelector(
  (state: RootState) => state.screen.width,
  (state: RootState) => state.screen.height,
  (width, height): UnitConverter => {
    const unit = (n: string): number => {
      let base = height
      if (n.endsWith('vw')) base = width
      let v = (parseInt(n, 10) * base) / 100
      if (v < 0) {
        v = height + v
      }
      return v
    }
    return (n) => unit(n)
  }
)

const render: ComponentRenderer = (component, x, y, w, h) => {
  const uc = converterSelector(store.getState())
  component(uc(x), uc(y), uc(w), uc(h))
}

const ui = (): void => {
  clear()
  render(time, '0', '1vh', '100vw', '10vh')
  render(telemetry, '2vw', '1vh', '96vw', '6vh')
  render(location, '0', '-5vh', '100vw', '5vh')
  render(toCenterComponentTelemetry, '0', '-7vh', '100vw', '2vh')
  map()
  // renderLocation()
  // Time
  // Timer

  // Speed
  // Direction
  // Distance

  // Waypoint

  // Location

  // Spotify

  // FPS monitor
}

export type { Component }
export default ui
