import { loadScript } from '@/helpers';
import getConfig from '@/config';

export default {
  methods: {
    loadGoogleSDK( done ) {
      if (window['google']) { return done(window['google']); }
      const apiKey = getConfig('GOOGLE_MAPS_API_KEY');
			const scriptUrl = `//maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      loadScript(scriptUrl, () => { done(window['google']); });
    }
  }
};
