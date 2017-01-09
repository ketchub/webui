import moment from 'moment';

export default function dateDisplay(string, defaultValue = 'ASAP') {
  if (!string) { return defaultValue; }
  const m = moment(string);
  const d = m.format('MM/DD/YY');
  const t = m.format('h:mm A');
  if (m.isSame(moment(), 'day')) {
    return `Today (${d}) near ${t}`;
  }
  return `${d} near ${t}`;
}
