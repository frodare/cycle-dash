/*
TODO:
- fix wake lock
- interval render
- spatial debounce for addTrackPoint
- add current track
  - save to index db?
  - how is this cleared?
  - how is this broken into different tracks?
- lock to center
- long press edit mode
- state management that enables updates when data changes
- drop point
- move track to state

- radar overlay https://www.rainviewer.com/api/
- test projection with world outline
- import / export KML
- save to google spreadsheet
- spotify integration
*/

/*
Milestones:
1. get time, speed, direction, distance work and test to see if the white on black screen is visible in the sun
  Results:
  - speed, direction, and distance where not built yet
  - the time was very easy to read, could be smaller even!
  - trail was mostly legible but would benefit from a thicker line with maybe darker color
  - the red X for current location was damn near invisible, it should over the line and be thicker
  - wake lock would fail if app ever lost focus
  - could have benefitted from having a bearing to middle of screen system
2. fix issues from the first test and try out (speed direction and distance)
*/
import './style.css'
import './interaction'
import './loadPaths'
// import './wakeLock'

import setupLocationTracking from './setupLocationTracking'
import { setup } from './canvas'
import { store } from './store'
import debounce from 'lodash/debounce'
import render from './ui'

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
setupLocationTracking('gps')

export type { TrackPoint, Point, LngLat }
