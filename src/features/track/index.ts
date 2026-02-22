import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { LngLat, TrackPoint } from '../../main'
import { distance } from '@turf/turf'

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
  last: TrackPoint | null
}

const initialState: TrackState = {
  trackId: new Date().toString(),
  track: [],
  location: null,
  trails: {},
  last: null
}

const MIN_DISTANCE = 0.02

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    setTrail: (state, action: PayloadAction<TrailEntry>) => {
      state.trails[action.payload.id] = action.payload
    },
    resetTrack: (state, action: PayloadAction<TrackPoint>) => {
      state.track = [action.payload]
      state.last = action.payload
      state.trackId = new Date().toString()
    },
    updateLocation: (state, action: PayloadAction<TrackPoint>) => {
      state.location = action.payload
      if (state.last == null) {
        state.last = action.payload
        state.track.push(action.payload)
        return
      }
      const distToLast = distance(action.payload.location, state.last.location, { units: 'kilometers' })
      if (distToLast < MIN_DISTANCE) return
      state.last = action.payload
      state.track.push(action.payload)
    }
  }
})

export type { TrackPoint, TrailEntry }
export const { setTrail, updateLocation, resetTrack } = trackSlice.actions
export default trackSlice.reducer
