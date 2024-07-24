import { setTrail } from '.'
import { getTrack, getTracks, saveTrack } from '../../db'
import { store } from '../../store'

const SAVE_INTERVAL = 1000 * 60

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
  const track = store.getState().track.track
  const id = store.getState().track.trackId
  await saveTrack(id, track, [0, 0, 0, 0])
  window.setTimeout(() => {
    void save()
  }, SAVE_INTERVAL)
}

void save()
void loadPreviousTracks()
