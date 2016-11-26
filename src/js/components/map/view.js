import mapStyles from '@/support/mapStyle';
import getInstance from '@/components/map/_instance';

export default {
  render(createElement) {
    return createElement('div', {
      attrs: {
        class: `map-container map-${this.mapName}`
      }
    });
  },
  props: {
    mapName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      $google: null,
      $instance: null,
      $startMarker: null,
      $endMarker: null
    };
  },
  methods: {
    resolveTrip: _resolveTrip,
    makeMarker: _makeMarker,
    fetchDirections: _fetchDirections
  },
  mounted() {
    const self = this;
    const {
      $store,
      makeMarker,
      mapName,
      $__loadGoogleSDKHelper,
      resolveTrip
    } = this;

    $__loadGoogleSDKHelper((google) => {
      self.$google = google;
      $store.watch(state => state.trip.currentStart, resolveTrip);
      $store.watch(state => state.trip.currentEnd, resolveTrip);

      getInstance(google, mapName, (instance) => {
        // store the instance against the
        self.$instance = instance;
        // Start location marker
        self.$startMarker = makeMarker('TRIP.ADD_SEARCH_START', {
          title: 'Start Location',
          icon: '/img/custom-target-icon.svg',
          map: instance.map
        });
        // End location marker
        self.$endMarker = makeMarker('TRIP.ADD_SEARCH_END', {
          title: 'End Location',
          icon: '/img/custom-target-icon-red.svg',
          map: instance.map
        });
        self.$el.appendChild(self.$instance.node);
        resolveTrip();
      });
    });
  },
  // @todo: this shouldn't be applicable any more because we want to
  // <keep-alive ...> any parent component of this so we don't have to deal
  // with google map's inability to destroy
  beforeDestroy() {
    this.$google.maps.event.clearInstanceListeners(this.$startMarker);
    this.$google.maps.event.clearInstanceListeners(this.$endMarker);
    this.$startMarker.setMap(null);
    this.$endMarker.setMap(null);
    this.$startMarker = this.$endMarker = null;
    // @todo: not very robust...
    this.$el.children[0].remove();
  }
};


/**
 * Automatically executed whenever a start or end point gets appended to
 * the list of searched items; this will update the relevant marker positions.
 */
function _resolveTrip() {
  const { $currentStart, $currentEnd } = this.$store.getters;
  const { map, directionsRenderer } = this.$instance;
  const { fetchDirections, $startMarker, $endMarker, $google } = this;

  $startMarker.setVisible($currentStart ? true : false);
  $endMarker.setVisible($currentEnd ? true : false);

  if (!$currentStart || !$currentEnd) {
    directionsRenderer.setDirections({routes:[]});
  }

  if( $currentStart ) {
    $startMarker.setPosition($currentStart.geometry.location);
    if ( ! $currentEnd ){
      map.setZoom(13);
      return map.panTo($startMarker.position);
    }
  }

  if( $currentEnd ) {
    $endMarker.setPosition($currentEnd.geometry.location);
    if ( ! $currentStart ) {
      map.setZoom(13);
      return map.panTo($endMarker.position);
    }
  }

  if ( $currentStart && $currentEnd ) {
    const bounds = new $google.maps.LatLngBounds();
    bounds.extend($startMarker.getPosition());
    bounds.extend($endMarker.getPosition());
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
    map.setZoom(map.getZoom() - 1);
    // make this be triggered by a user action...
    fetchDirections();
  }
}

/**
 * Gets directions between two points and renders to the display.
 */
function _fetchDirections() {
  const { directionsService, directionsRenderer } = this.$instance;
  const {$store, $google, $startMarker, $endMarker} = this;

  directionsService.route({
    origin: $startMarker.position.toJSON(),
    destination: $endMarker.position.toJSON(),
    travelMode: $google.maps.TravelMode['DRIVING']
  }, (response, status) => {
    $store.dispatch('TRIP.SET_DIRECTIONS', response);
    directionsRenderer.setDirections(response);
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
