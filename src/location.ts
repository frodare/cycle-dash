import render from './render'
import state from './state'

const setup = (): void => {
  navigator.geolocation.watchPosition((position) => {
    console.log('watch', position.coords.latitude, position.coords.longitude)
    state.location = {
      time: position.timestamp,
      location: [position.coords.longitude, position.coords.latitude]
    }
    render()
  }, (error) => {
    console.error(error)
  }, {
    enableHighAccuracy: true,
    timeout: 30_000,
    maximumAge: 0
  })

  // setTimeout(() => {
  //   console.log('clearing')
  //   navigator.geolocation.clearWatch(watchID)
  // }, 30_000)
}

if ('geolocation' in navigator) {
  /* geolocation is available */
  setup()
} else {
  /* geolocation IS NOT available */
  console.error('Geolocation is not available')
}
