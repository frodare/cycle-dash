import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { Point } from '../../main'
import { project } from '../../projection'

interface Size {
  width: number
  height: number
}

interface ScreenState extends Size {
  center: Point
  scale: number
}

const initialState: ScreenState = {
  height: 0,
  width: 0,
  center: project([-84.336604, 30.355065]),
  scale: 0.1
}

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload
    },
    setCenter: (state, action: PayloadAction<Point>) => {
      state.center = action.payload
    },
    setSize: (state, action: PayloadAction<Size>) => {
      state.width = action.payload.width
      state.height = action.payload.height
    }
  }
})

export const { setSize, setScale, setCenter } = screenSlice.actions
export default screenSlice.reducer
