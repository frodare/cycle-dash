/*
TODO:
- rendering on every store update, even for noop
- add current track
  - save to index db?
  - how is this cleared?
  - how is this broken into different tracks?
- lock to center
- long press edit mode
- state management that enables updates when data changes
- drop point
- move track to state
- compass ring that allows rotating the map
- improve pan and pinch zoom
  - when using a mouse and dragging off screen, it gets stuck in pinch zoom mode
- add imperial units
- add scale (helpful when there are no other reference points)

- radar overlay https://www.rainviewer.com/api/
- test projection with world outline
- import / export KML
- save to google spreadsheet
- spotify integration
*/

/*
Test 1:
1. get time, speed, direction, distance work and test to see if the white on black screen is visible in the sun
  Results:
  - speed, direction, and distance where not built yet
  - the time was very easy to read, could be smaller even!
  - trail was mostly legible but would benefit from a thicker line with maybe darker color
  - the red X for current location was damn near invisible, it should over the line and be thicker
  - wake lock would fail if app ever lost focus
  - could have benefitted from having a bearing to middle of screen system
2. fix issues from the first test and try out (speed direction and distance)

Test 2:
- Red is too faint
- Lines are too thin
- Round the speed to a whole number
- replace addTrackPoint with setCurrentPosition
- Speed should zero out when not moving
- Needs follow me position locking
- Avg speed
- Timer
- Speed
- Current time is not important enough to display top center
*/

import debounce from 'lodash/debounce'
import { setup } from './canvas'
import './interaction'
import './loadPaths'
import setupLocationTracking from './setupLocationTracking'
import './wakeLock'
import { store } from './store'
import './style.css'
import render from './ui'
import './features/track/persist'

interface TrackPoint {
  time: number
  location: LngLat
}

type Point = [number, number]

type LngLat = [number, number]

const debouncedRender = debounce(render, 25, { maxWait: 250 })

store.subscribe(() => {
  debouncedRender()
})

void setup()
setupLocationTracking('demo')

setInterval(() => {
  debouncedRender()
}, 10000)

export type { LngLat, Point, TrackPoint }
