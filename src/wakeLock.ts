
let wakeLock: WakeLockSentinel | null = null

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    void enable()
  }
})

const enable = async (): Promise<void> => {
  if (wakeLock != null) return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
    wakeLock.addEventListener('release', () => {
      wakeLock = null
    })
  } catch (_err) {
    // Wake lock not supported or permission denied; continue without it
  }
}

void enable()
