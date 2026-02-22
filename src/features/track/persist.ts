import { resetTrack, setTrail } from '.'
import { getTrack, getTracks, saveTrack } from '../../db'
import { store } from '../../store'

const SAVE_INTERVAL = 1000 * 60
const MAX_TRACK_POINTS = 500000

const loadPreviousTracks = async (): Promise<void> => {
  const savedTracks = await getTracks()
  for (const trackId of savedTracks) {
    const trackPoints = await getTrack(trackId)
    store.dispatch(setTrail({
      id: trackId,
      type: 'savedTrack',
      date: Date.now(),
      points: trackPoints.map((point) => point.location)
    }))
  }
}

const save = async (): Promise<void> => {
  const { track, trackId } = store.getState().track
  await saveTrack(trackId, track, [0, 0, 0, 0])
  window.setTimeout(() => {
    void save()
  }, SAVE_INTERVAL)
}

let isSavingOverflow = false

store.subscribe(() => {
  const { track, location, trackId } = store.getState().track
  if (track.length >= MAX_TRACK_POINTS && !isSavingOverflow && location != null) {
    isSavingOverflow = true
    saveTrack(trackId, track, [0, 0, 0, 0])
      .then(() => {
        store.dispatch(resetTrack(location))
      })
      .catch(console.error)
      .finally(() => {
        isSavingOverflow = false
      })
  }
})

void save()
void loadPreviousTracks()
