const wakeLock = await navigator.wakeLock.request('screen')
console.log('Screen Wake Lock is active')
wakeLock.addEventListener('release', () => {
  console.log('Screen Wake Lock released:')
})
