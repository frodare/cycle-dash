import { LngLat, Point } from './state'
import proj4 from 'proj4'

// proj4.defs('WGS84', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
// proj4.defs('TEST', '+proj=tmerc +lat_0=30.3 +lon_0=84.38 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs')

// const WGS84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
const TEST = '+proj=tmerc +ellps=airy +datum=OSGB36 +units=m +no_defs'

// proj4.defs('WGS84X', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees')

// Proj4js.defs["WGS84"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
// Proj4js.defs["EPSG:27700"] = "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs";

/*
top left
30.378109, -84.380752

bottom right
30.318859, -84.307249

*/

const project = (coordinate: LngLat): Point => {
  // const [lng, lat] = coordinate
  // const x = (lng + 180) / 360
  // const y = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2
  // return [x, y]
  return proj4('WGS84', TEST).forward(coordinate)
}

const unproject = (point: Point): LngLat => {
  return proj4('EPSG:4326', TEST).inverse(point)
}

export { project, unproject }
