import { destination } from '@turf/turf'
import { addTrackPoint } from './features/track'
import { LngLat } from './main'
import { store } from './store'

const MODE = 'demo'

const setupGpsLocator = (): void => {
  if (!('geolocation' in navigator)) return
  navigator.geolocation.watchPosition((position) => {
    addTrackPoint({
      time: position.timestamp,
      location: [position.coords.longitude, position.coords.latitude]
    })
  }, (error) => {
    console.error(error)
  }, {
    enableHighAccuracy: true,
    timeout: 30_000,
    maximumAge: 0
  })
}

const randNum = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

let currentLocation: LngLat = [-84.336604, 30.355065]
let speed = 50
let bearing = 45

const demoLocator = (): void => {
  setTimeout(() => {
    const shouldTurn = Math.random() > 0.5
    const shouldTurnSharply = Math.random() > 0.9
    const turnRange = shouldTurnSharply ? 120 : 20
    const shouldChangeSpeed = Math.random() > 0.6
    const turnAmount = randNum(-turnRange, turnRange)
    speed = shouldChangeSpeed ? Math.min(200, randNum(-5, 5) + speed) : speed
    bearing = shouldTurn ? bearing + turnAmount : bearing
    currentLocation = destination(currentLocation, speed / 3600, bearing).geometry.coordinates as LngLat
    store.dispatch(addTrackPoint({
      time: Date.now(),
      location: currentLocation
    }))
    demoLocator()
  }, randNum(1000, 1000))
}

if (MODE === 'demo') {
  demoLocator()
} else {
  setupGpsLocator()
}
