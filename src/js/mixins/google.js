import { loadScript } from '@/helpers';
const apiKey = 'test'; //document.documentElement.getAttribute('gmaps-apikey');
const scriptUrl = `//maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

export default {
  methods: {
    loadGoogleSDK( done ) {
      if (window['google']) { return done(window['google']); }
      loadScript(scriptUrl, () => { done(window['google']); });
    }
  }
};
