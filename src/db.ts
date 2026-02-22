import { DBSchema, openDB } from 'idb'
import { TrackPoint } from './main'
import { BBox } from 'geojson'

const DB_NAME = 'cycle-dash'
const DB_VERSION = 2

interface CycleDashSchema extends DBSchema {
  tracks: {
    value: {
      id: string
      date: number
      track: TrackPoint[]
      bbox: BBox
    }
    key: string
    indexes: { 'by-date': number }
  }
}

const dbp = openDB<CycleDashSchema>(DB_NAME, DB_VERSION, {
  upgrade (db) {
    const store = db.createObjectStore('tracks', { keyPath: 'id' })
    store.createIndex('by-date', 'date')
  }
})

const getTracks = async (): Promise<string[]> => {
  const db = await dbp
  const tx = db.transaction('tracks', 'readonly')
  const store = tx.objectStore('tracks')
  const keys = await store.getAllKeys()
  await tx.done
  return keys
}

const getTrack = async (id: string): Promise<TrackPoint[]> => {
  const db = await dbp
  const tx = db.transaction('tracks', 'readonly')
  const store = tx.objectStore('tracks')
  const record = await store.get(id)
  await tx.done
  return record?.track ?? []
}

const saveTrack = async (id: string, track: TrackPoint[], bbox: BBox): Promise<void> => {
  const db = await dbp
  const tx = db.transaction('tracks', 'readwrite')
  const store = tx.objectStore('tracks')
  await store.put({ id, date: Date.now(), track, bbox })
  await tx.done
}

export { getTracks, saveTrack, getTrack }
