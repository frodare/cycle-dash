import toGeoJSON from '@mapbox/togeojson'
import JSZip from 'jszip'
import fs from 'fs'
import jsdom from 'jsdom'

const kmlToGeoJSON = (kmlText) => {
  const window = new jsdom.JSDOM()
  const parser = new window.window.DOMParser()
  const kmlDoc = parser.parseFromString(kmlText, 'text/xml')
  const converted = toGeoJSON.kml(kmlDoc)
  return converted
}

const kmzToGeoJSON = async (kmzFile) => {
  const zip = await JSZip.loadAsync(kmzFile)
  const kmlFile = zip.file(/\.kml$/i)[0] // Assuming one KML file inside

  if (!kmlFile) {
    throw new Error('No KML file found in the KMZ archive.')
  }

  const kmlText = await kmlFile.async('string')
  return kmlToGeoJSON(kmlText)
}

const run = async () => {
  const [filePath] = process.argv.slice(2)
  console.log('path', filePath)
  const kmzFile = await fs.promises.readFile(filePath)
  const geojson = await kmzToGeoJSON(kmzFile)
  await fs.promises.writeFile(filePath + '.json', JSON.stringify(geojson, null, 2))
}

run()
