// import modernizr from 'modernizr';

let _geocoderApi;

/**
 * Just to maintain some semblance of convention (and since these methods
 * are injected into the global Vue instance), prefix all methods with
 * "$_".
 */
export default {
  inject: ['$google'],
  methods: {
    $_logout() {
      this.$store.dispatch('ACCOUNT.DO_LOGOUT', null);
    },

    /**
     * Toggle nav open or close (true = open, false/null = close).
     * @param {Boolean|null}
     */
    $_toggleNav(to) {
      this.$store.dispatch('UI.NAV_TOGGLE', to);
    },

    /**
     * Toggle modal (pass in a component name to open, or false/null to close).
     * @param {string|null} componentName Component name to render in modal
     */
    $_toggleModal(options = false) {
      this.$store.dispatch('UI.SET_MODAL', !!(options) ?
        Object.assign({open:true}, options) :
        // note, we do *not* set componentName to null as we need to let it
        // stay rendered during the transition out!
        {open: false, title: null}
      );
    },

    /**
     * Issue a query to Google's reverse geolocation service (query is just
     * an object with {lat:x,lng:y}), and invoke callback with results. The
     * way the API returns results is kind of dumb, so we normalize it to
     * error-first (in effect) handling of the callback.
     * @param {Object} query A {lat:...,lng:...} pair (potentially other data)
     * @param {Function} done On complete callback
     */
    $_reverseGeocode(query, done) {
      const { $google } = this;
      const payload = {location: query};

      function onResponse(results, status) {
        if (status === 'OK' && results && results[0]) {
          return done(null, results[0]);
        }
        done(new Error(status));
      }

      if (!_geocoderApi) {
        _geocoderApi = new $google.maps.Geocoder();
        _geocoderApi.geocode(payload, onResponse);
        return;
      }

      _geocoderApi.geocode(payload, onResponse);
    }
  }
};
