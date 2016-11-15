import mapStyles from '@/config/mapStyles';

export default {
  template: '#components_map',
  data: function() {
    return {
      $mapObj: null,
      $startMarker: null,
      $endMarker: null,
      mapLoaded: false
    };
  },
  methods: {
    resolveTrip: _resolveTrip,
    initializeMap: _initializeMap
  },
  mounted() {
    this.$watch('$store.state.trip.searchStart', this.resolveTrip);
    this.$watch('$store.state.trip.searchEnd', this.resolveTrip);
    this.initializeMap();
  }
};

/**
 * Initialize the map to $mapObj, and creates $startMarker and $endMarker
 * objects but doesn't add them to the map yet.
 */
function _initializeMap() {
  let self = this;
  let { $store, loadGoogleSDK, resolveTrip, reverseGeocodeSearch } = this;

  loadGoogleSDK((google) => {
    const styledMapType = new google.maps.StyledMapType(mapStyles, {
      name: 'HighViz'
    });

    self.$mapObj = new google.maps.Map(self.$el.querySelector('.map-instance'), {
      center: {lat:39.09024, lng:-95.712891},
      zoom: 4,
      mapTypeId: 'HighViz',
      // mapTypeControl: false,
      scrollwheel: false,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'HighViz'],
        // style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });

    self.$mapObj.mapTypes.set('HighViz', styledMapType);

    // Start location marker
    self.$startMarker = _makeMarker(google, {
      title: 'Start Location',
      icon: {
        url: '/img/custom-target-icon.svg'
      }
    });

    self.$startMarker.addListener('dragend', (data) => {
      reverseGeocodeSearch(data.latLng.toJSON(), (bestGuess) => {
        bestGuess.MARKER_DROP_ESTIMATE = true;
        $store.dispatch('TRIP.ADD_SEARCH_START', bestGuess);
      });
    });

    // End location marker
    self.$endMarker = _makeMarker(google, {
      title: 'End Location',
      icon: {
        url: '/img/custom-target-icon-red.svg'
      }
    });

    self.$endMarker.addListener('dragend', (data) => {
      reverseGeocodeSearch(data.latLng.toJSON(), (bestGuess) => {
        bestGuess.MARKER_DROP_ESTIMATE = true;
        $store.dispatch('TRIP.ADD_SEARCH_END', bestGuess);
      });
    });

    self.mapLoaded = true;
    resolveTrip();
  });
}

/**
 * Automatically executed whenever a start or end point gets appended to
 * the list of searched items; this will update the relevant marker positions.
 */
function _resolveTrip() {
  const { latestStartSearch, latestEndSearch } = this.$store.getters;
  const { $startMarker, $endMarker, $mapObj } = this;

  if( latestStartSearch ) {
    $startMarker.setPosition(latestStartSearch.geometry.location);
    $startMarker.setMap($mapObj);
  }

  if( latestEndSearch ) {
    $endMarker.setPosition(latestEndSearch.geometry.location);
    $endMarker.setMap($mapObj);
  }
}

/**
 * Create a marker on the map with default properties.
 */
function _makeMarker(google, properties) {
  return new google.maps.Marker(Object.assign({
    draggable: true,
    animation: google.maps.Animation.DROP
  }, properties));
}
