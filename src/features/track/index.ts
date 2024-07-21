import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { LngLat } from '../../main'
import { distance } from '@turf/turf'

interface TrackPoint {
  time: number
  location: LngLat
}

interface TrackState {
  track: TrackPoint[]
  trails: Record<string, LngLat[]>
}

const initialState: TrackState = {
  track: [],
  trails: {}
}

const MIN_DISTANCE = 0.02
let last: TrackPoint | null = null

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    addTrackPoint: (state, action: PayloadAction<TrackPoint>) => {
      if (state.track.length > 500000) {
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
    },
    setTrail: (state, action: PayloadAction<{ name: string, points: LngLat[] }>) => {
      state.trails[action.payload.name] = action.payload.points
    }
  }
})

export type { TrackPoint }
export const { setTrail, addTrackPoint } = trackSlice.actions
export default trackSlice.reducer
