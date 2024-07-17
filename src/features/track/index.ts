import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { LngLat } from '../../main'

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

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    addTrackPoint: (state, action: PayloadAction<TrackPoint>) => {
      if (state.track.length > 1000) {
        state.track = [action.payload]
        return
      }
      state.track.push(action.payload)
    },
    setTrail: (state, action: PayloadAction<{ name: string, points: LngLat[] }>) => {
      state.trails[action.payload.name] = action.payload.points
    }
  }
})

export type { TrackPoint }
export const { addTrackPoint, setTrail } = trackSlice.actions
export default trackSlice.reducer
