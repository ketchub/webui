import { reduce } from 'lodash';
import getConfig from '@/support/getConfig';
const baseUri = 'https://maps.googleapis.com/maps/api/staticmap';
const apiKey = getConfig('GOOGLE_MAPS_API_KEY');

export default {
  functional: true,
  props: {
    polyline: {
      type: String,
      required: true
    }
  },
  render(createElement, context) {
    return createElement('img', {
      domProps: {
        src: makeUri({
          size: '480x300',
          path: `weight:3|color:blue|enc:${context.props.polyline}`,
          key: apiKey
        })
      }
    });
  }
};

function makeUri(query) {
  return baseUri + '?' + reduce(query, (collector, value, key) => {
    collector.push(key + '=' + encodeURIComponent(value));
    return collector;
  }, []).join('&');
}
