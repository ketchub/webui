import modernizr from 'modernizr';

export default {
  methods: {
    /**
     * This gets the position coordinates from geolocation api (if supported)
     * AND reverse-geocodes via Google... THEN returns the address info.
     */
    resolveCurrentLocation(done) {
      if (!modernizr.geolocation) {
        return done(new Error('Geolocation API unavailable.'));
      }

    	navigator.geolocation.getCurrentPosition((position) => {
    		let { coords } = position;
        if (!coords.latitude || !coords.longitude) {
          return done(new Error('Location acquired but innacurrate.'));
        }
        done(null, {
          lat: coords.latitude,
          lng: coords.longitude
        });
      }, done); // second callback is an error handler with arg Error
    },

    /**
     * Issue a query to Google's reverse geolocation service (query is just
     * an object with {lat:x,lng:y}), and invoke callback with results.
     */
    reverseGeocodeSearch(query, callback) {
      const { $__loadGoogleSDKHelper } = this;

    	$__loadGoogleSDKHelper((google) => {
    		const geocoder = new google.maps.Geocoder();
    		geocoder.geocode({location: query}, (results, status) => {
    			// @todo: error handling via status
    			callback(results[0]);
    		});
    	});
    }
  }
};
