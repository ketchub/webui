import modernizr from 'modernizr';

/**
 * No render or template included; use 'inline-template' directive.
 */
export default {
  props: {
    action: {
      type: String,
      required: true
    }
  },
  methods: {
    useCurrentLocation() {
      const { $store, action, $_reverseGeocode } = this;

      if (!modernizr.geolocation || !navigator.geolocation) {
        // @todo: log as an error somewhere?
        return alert('Geolocation API unavailable :(');
      }

      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position;
        if (!coords.latitude || !coords.longitude) {
          return alert('Location acquired but inaccurate.');
        }
        $_reverseGeocode({
          lat: coords.latitude,
          lng: coords.longitude
        }, (err, bestGuess) => {
          if (err) { return alert(err); }
          bestGuess.CURRENT_POSITION_ESTIMATE = true;
          $store.dispatch(action, bestGuess);
        });
      });
    }
  }
};
