import mapStyles from '@/config/mapStyles';

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
  methods: {
    resolveTrip: _resolveTrip,
    initializeMap: _initializeMap,
    makeMarker: _makeMarker,
    fetchDirections: _fetchDirections,
    clearSearch(action) {
      this.$store.dispatch(action, null);
    }
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
  const { latestStartSearch, latestEndSearch } = this.$store.getters;
  const { fetchDirections, $startMarker, $endMarker, $mapObj, $google } = this;

  if( latestStartSearch ) {
    $startMarker.setPosition(latestStartSearch.geometry.location);
    $startMarker.setMap($mapObj);
    if ( ! latestEndSearch ){
      $mapObj.setZoom(13);
      return $mapObj.panTo($startMarker.position);
    }
  }

  if( latestEndSearch ) {
    $endMarker.setPosition(latestEndSearch.geometry.location);
    $endMarker.setMap($mapObj);
  }

  if ( latestStartSearch && latestEndSearch ) {
    const bounds = new $google.maps.LatLngBounds();
    bounds.extend($startMarker.getPosition());
    bounds.extend($endMarker.getPosition());
    $mapObj.fitBounds(bounds);
    fetchDirections();
  }
}

/**
 * Gets directions between two points and renders to the display.
 */
function _fetchDirections() {
  let {
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
    console.log('directions', response);
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
