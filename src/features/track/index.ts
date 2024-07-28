import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { LngLat } from '../../main'
import { distance } from '@turf/turf'

interface TrackPoint {
  time: number
  location: LngLat
}

interface TrailEntry {
  id: string
  date: number
  type: 'trail' | 'savedTrack'
  points: LngLat[]
}

interface TrackState {
  trackId: string
  location: TrackPoint | null
  track: TrackPoint[]
  trails: Record<string, TrailEntry>
}

const initialState: TrackState = {
  trackId: new Date().toString(),
  track: [],
  location: null,
  trails: {}
}

const MIN_DISTANCE = 0.02
let last: TrackPoint | null = null

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    setTrail: (state, action: PayloadAction<TrailEntry>) => {
      state.trails[action.payload.id] = action.payload
    },
    updateLocation: (state, action: PayloadAction<TrackPoint>) => {
      state.location = action.payload
      if (state.track.length > 500000) {
        // TODO: Save track
        state.track = [action.payload]
        return
      }
      if (last == null) {
        last = action.payload
        state.track.push(action.payload)
        return
      }
      const distToLast = distance(action.payload.location, last.location, { units: 'kilometers' })
      if (distToLast < MIN_DISTANCE) return
      last = action.payload
      state.track.push(action.payload)
    }
  }
})

export type { TrackPoint, TrailEntry }
export const { setTrail, updateLocation } = trackSlice.actions
export default trackSlice.reducer
