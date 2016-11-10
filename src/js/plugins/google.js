import { loadScript } from '@/helpers';
const apiKey = document.documentElement.getAttribute('gmaps-apikey');
const scriptUrl = `//maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

export default {
  install( Vue, options = {} ) {
    Vue.prototype.$loadGoogleSDK = function( done ) {
      if (window['google']) { return done(window['google']); }
      loadScript(scriptUrl, () => { done(window['google']); });
    };
  }
};
