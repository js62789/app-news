function format(diff, divisor, unit, prev) {
  const val = Math.floor(diff / divisor);
  return val <= 1 ? prev : `${val} ${unit}s ago`;
}

export default function ago(date) {
  const diff = Math.abs(Date.now() - date.getTime());
  const units = ago.units;

  if (diff < 60000) { // less than a minute
    return 'just now';
  }

  for (let i = 0; i < units.length; i += 1) {
    if (diff < units[i].max) {
      return format(diff, units[i].value, units[i].name, units[i].prev);
    }
  }

  return '';
}

ago.units = [
  { max: 2760000, value: 60000, name: 'minute', prev: 'a minute ago' }, // max: 46 minutes
  { max: 72000000, value: 3600000, name: 'hour', prev: 'an hour ago' }, // max: 20 hours
  { max: 518400000, value: 86400000, name: 'day', prev: 'yesterday' }, // max: 6 days
  { max: 2419200000, value: 604800000, name: 'week', prev: 'last week' }, // max: 28 days
  { max: 28512000000, value: 2592000000, name: 'month', prev: 'last month' }, // max: 11 months
  { max: Infinity, value: 31536000000, name: 'year', prev: 'last year' },
];
