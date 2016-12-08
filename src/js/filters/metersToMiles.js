const METERS_PER_MILE = 3963.1676;

export default function metersToMiles(meters) {
  return +(meters / METERS_PER_MILE).toFixed(2);
}
