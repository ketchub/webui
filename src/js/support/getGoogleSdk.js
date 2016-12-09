import loadScriptHelper from '@/support/util/loadScriptHelper';
import getConfig from '@/support/getConfig';

/**
 * Load the google maps SDK and return 'google' global var to callback.
 * @todo: error handling; if fails to load, do timeout and actually return an error
 * @param  {Function} done callback
 * @return {void}
 */
export default function(done) {
  if (window['google']) { return done(null, window['google']); }
  const apiKey = getConfig('GOOGLE_MAPS_API_KEY');
  const scriptSrc = `//maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
  loadScriptHelper(scriptSrc, () => {
    done(null, window['google']);
  });
}
