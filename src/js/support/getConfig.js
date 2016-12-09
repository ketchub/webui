import { get } from 'lodash';
const config = require(`../../../config/${process.env.NODE_ENV}`);

export default function(query, defaultValue) {
  return get(config, query, defaultValue);
}
