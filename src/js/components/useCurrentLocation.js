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
      const {
        $store,
        action,
        resolveCurrentLocation,
        reverseGeocodeSearch
      } = this;

      resolveCurrentLocation((err, latLng) => {
        if (err) { throw err; }
        reverseGeocodeSearch(latLng, ( bestGuess ) => {
          bestGuess.CURRENT_POSITION_ESTIMATE = true;
          $store.dispatch(action, bestGuess);
        });
      });
    }
  }
};
