let mapStyles = require('json!../config/mapStyle.json');

export default {
  template: '#components_map',
  data: function() {
    return {
      $google: null,
      $directionsRenderer: null,
      $directionsService: null,
      $mapObj: null,
      $startMarker: null,
      $endMarker: null,
      mapLoaded: false
    };
  },
  computed: {
    $currentStart({ $store }) { return $store.getters.$currentStart; },
    $currentEnd({ $store }) { return $store.getters.$currentEnd; }
  },
  methods: {
    resolveTrip: _resolveTrip,
    initializeMap: _initializeMap,
    makeMarker: _makeMarker,
    fetchDirections: _fetchDirections,
    clearSearch: _clearSearch,
    geoTraceLocationStart: _geoTraceLocationStart
  },
  mounted() {
    const self = this;
    const { loadGoogleSDK, resolveTrip, initializeMap } = this;

    loadGoogleSDK((google) => {
      self.$google = google;
      self.$directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true
      });
      self.$directionsService = new google.maps.DirectionsService();
      self.$watch('$store.state.trip.searchStart', resolveTrip);
      self.$watch('$store.state.trip.searchEnd', resolveTrip);
      initializeMap(() => {
        self.mapLoaded = true;
        resolveTrip();
      });
    });
  }
};

function _geoTraceLocationStart() {
  const { $store, resolveCurrentLocation, reverseGeocodeSearch } = this;
  resolveCurrentLocation((err, latLng) => {
    if (err) { throw err; }
    reverseGeocodeSearch(latLng, ( bestGuess ) => {
      bestGuess.CURRENT_POSITION_ESTIMATE = true;
      $store.dispatch('TRIP.ADD_SEARCH_START', bestGuess);
    });
  });
}

/**
 * Clear current 'start' or 'end' search (action is the vuex action to
 * dispatch).
 * @param  {string} action Action to be dispatched
 * @return void
 */
function _clearSearch(action) {
  this.$store.dispatch(action, null);
}

/**
 * Initialize the map to $mapObj, and creates $startMarker and $endMarker
 * objects but doesn't add them to the map yet.
 */
function _initializeMap(done) {
  let self = this;
  let { $store, makeMarker, $google } = this;

  const styledMapType = new $google.maps.StyledMapType(mapStyles, {
    name: 'HighViz'
  });

  self.$mapObj = new $google.maps.Map(self.$el.querySelector('.map-instance'), {
    center: {lat:39.09024, lng:-95.712891},
    zoom: 4,
    mapTypeId: 'HighViz',
    // mapTypeControl: false,
    scrollwheel: false,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'HighViz'],
      // style: $google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: $google.maps.ControlPosition.TOP_RIGHT
    }
  });

  self.$mapObj.mapTypes.set('HighViz', styledMapType);

  // Start location marker
  self.$startMarker = makeMarker('TRIP.ADD_SEARCH_START', {
    title: 'Start Location',
    icon: '/img/custom-target-icon.svg'
  });

  // End location marker
  self.$endMarker = makeMarker('TRIP.ADD_SEARCH_END', {
    title: 'End Location',
    icon: '/img/custom-target-icon-red.svg'
  });

  // Bind the directionsRenderer
  self.$directionsRenderer.setMap(self.$mapObj);

  done();
}

/**
 * Automatically executed whenever a start or end point gets appended to
 * the list of searched items; this will update the relevant marker positions.
 */
function _resolveTrip() {
  const {
    fetchDirections,
    $currentStart,
    $currentEnd,
    $startMarker,
    $endMarker,
    $mapObj,
    $google
  } = this;

  if( $currentStart ) {
    $startMarker.setPosition($currentStart.geometry.location);
    $startMarker.setMap($mapObj);
    if ( ! $currentEnd ){
      $mapObj.setZoom(13);
      return $mapObj.panTo($startMarker.position);
    }
  }

  if( $currentEnd ) {
    $endMarker.setPosition($currentEnd.geometry.location);
    $endMarker.setMap($mapObj);
  }

  if ( $currentStart && $currentEnd ) {
    const bounds = new $google.maps.LatLngBounds();
    bounds.extend($startMarker.getPosition());
    bounds.extend($endMarker.getPosition());
    $mapObj.fitBounds(bounds);
    // make this be triggered by a user action...
    // fetchDirections();
  }
}

/**
 * Gets directions between two points and renders to the display.
 */
function _fetchDirections() {
  const {
    $store,
    $google,
    $directionsService,
    $directionsRenderer,
    $startMarker,
    $endMarker
  } = this;

  $directionsService.route({
    origin: $startMarker.position.toJSON(),
    destination: $endMarker.position.toJSON(),
    travelMode: $google.maps.TravelMode['DRIVING']
  }, (response, status) => {
    $store.dispatch('TRIP.SET_DIRECTIONS', response);
    $directionsRenderer.setDirections(response);
  });
}

/**
 * Create a marker on the map with default properties.
 */
function _makeMarker(dispatchOnDragEndAction, properties) {
  const { $google, $store, reverseGeocodeSearch } = this;

  const marker = new $google.maps.Marker(Object.assign({
    draggable: true,
    animation: $google.maps.Animation.DROP
  }, properties));

  // Add listener for on drag end that initiates a reverseGeocodeSearch
  // and emits an action
  marker.addListener('dragend', (data) => {
    reverseGeocodeSearch(data.latLng.toJSON(), (bestGuess) => {
      bestGuess.MARKER_DROP_ESTIMATE = true;
      $store.dispatch(dispatchOnDragEndAction, bestGuess);
    });
  });

  return marker;
}
