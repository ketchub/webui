import { get } from 'lodash';
const config = require(`json!../../config/${process.env.NODE_ENV}.json`);

export default function(query, defaultValue) {
  return get(config, query, defaultValue);
}
