
let wakeLock: WakeLockSentinel | null = null

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    void enable()
  }
})

const enable = async (): Promise<void> => {
  if (wakeLock != null) return
  wakeLock = await navigator.wakeLock.request('screen')
  console.log('wake locked acquired')
  wakeLock.addEventListener('release', () => {
    wakeLock = null
    console.log('wake locked released')
  })
}

void enable()
