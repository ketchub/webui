export default {
  methods: {
    resolveCurrentLocation() {
    	const { $store, reverseGeocodeSearch } = this;

    	if (!navigator.geolocation) {
    		return;
    	}

    	navigator.geolocation.getCurrentPosition((position) => {
    		if (!position) { return; }
    		reverseGeocodeSearch({
    			lat: position.coords.latitude,
    			lng: position.coords.longitude
    		}, ( bestGuess ) => {
    			bestGuess.CURRENT_POSITION_ESTIMATE = true;
    			$store.dispatch('TRIP.ADD_SEARCH_START', bestGuess);
    		});
    	});
    },

    reverseGeocodeSearch(query, callback) {
    	const { loadGoogleSDK } = this;

    	loadGoogleSDK((google) => {
    		const geocoder = new google.maps.Geocoder();
    		geocoder.geocode({location: query}, (results, status) => {
    			// @todo: error handling via status
    			callback(results[0]);
    		});
    	});
    }
  }
};
