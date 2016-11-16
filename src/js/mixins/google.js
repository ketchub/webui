import { loadScript } from '@/helpers';

export default {
  methods: {
    loadGoogleSDK( done ) {
      if (window['google']) { return done(window['google']); }
      const apiKey = document.documentElement.getAttribute('gmaps-apikey');
			const scriptUrl = `//maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      loadScript(scriptUrl, () => { done(window['google']); });
    }
  }
};
