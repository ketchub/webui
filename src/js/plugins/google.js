import { loadScript } from '@/helpers';

export default {
  install( vue, options = {} ) {
    vue.prototype.$loadGoogleSDK = loadGoogleSDK;
  }
};

function loadGoogleSDK(done) {
  if (window['google']) { return done(window['google']); }
  let apiKey = document.documentElement.getAttribute('gmaps-apikey');
  loadScript(`//maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`, () => {
    done(window['google']);
  });
}
