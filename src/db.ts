import { DBSchema, openDB } from 'idb'
import { TrackPoint } from './main'
import { BBox } from 'geojson'

const DB_NAME = 'test2'
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
  upgrade (db, oldVersion, newVersion, transaction, event) {
    console.log('upgrade', db, oldVersion, newVersion, transaction, event)
    const store = db.createObjectStore('tracks', { keyPath: 'id' })
    store.createIndex('by-date', 'date')
  },
  blocked (currentVersion, blockedVersion, event) {
    console.log('blocked', currentVersion, blockedVersion, event)
  },
  blocking (currentVersion, blockedVersion, event) {
    console.log('blocking', currentVersion, blockedVersion, event)
  },
  terminated () {
    console.log('terminated')
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
