const METERS_PER_MILE = 3963.1676;

export default function milesToMeters(miles) {
  return +(miles * METERS_PER_MILE).toFixed(2);
}
