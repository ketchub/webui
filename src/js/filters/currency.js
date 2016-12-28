import { filter } from 'lodash';

const FORMAT_USD = 'usd';

const formatters = {
  [FORMAT_USD]( value, symbol = '$' ) {
    return `${symbol}${(+value).toFixed(2)}`;
  }
};

export default function currency(value, format = FORMAT_USD, symbol = '$') {
  if (!value) { return; }
  return formatters[format](value, symbol);
}
