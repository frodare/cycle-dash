
const directionOrdinal = (bearing: number): string => {
  if (bearing < 22.5) return 'N'
  if (bearing < 67.5) return 'NE'
  if (bearing < 112.5) return 'E'
  if (bearing < 157.5) return 'SE'
  if (bearing < 202.5) return 'S'
  if (bearing < 247.5) return 'SW'
  if (bearing < 292.5) return 'W'
  if (bearing < 337.5) return 'NW'
  return 'N'
}

export default directionOrdinal
