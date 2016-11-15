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
    resolveTrip() {
      const { latestStartSearch, latestEndSearch } = this.$store.getters;
      if( latestStartSearch ) {
        this.$startMarker.setPosition(
          latestStartSearch.geometry.location
        );
      }

      if( latestEndSearch ) {
        this.$endMarker.setPosition(
          latestEndSearch.geometry.location
        );
        this.$endMarker.setMap(this.$mapObj);
      }
    }
  },
  mounted() {
    const { loadGoogleSDK, resolveTrip } = this;
    const node = this.$el.querySelector('.map-instance');
    const self = this;

    self.$watch('$store.state.trip.searchStart', resolveTrip);
    self.$watch('$store.state.trip.searchEnd', resolveTrip);

    loadGoogleSDK((google) => {
      const styledMapType = new google.maps.StyledMapType(mapStyles, {
        name: 'Default'
      });

      self.$mapObj = new google.maps.Map(node, {
        center: {lat:39.09024, lng:-95.712891},
        zoom: 4,
        mapTypeId: 'Default',
        mapTypeControl: false,
        scrollwheel: false
      });

      self.$mapObj.mapTypes.set('Default', styledMapType);

      self.$startMarker = new google.maps.Marker({
        map: self.$mapObj,
        title: 'Current Location',
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: {
          url: '/img/custom-target-icon.svg'
        }
      });

      self.$endMarker = new google.maps.Marker({
        title: 'End Location',
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: {
          url: '/img/custom-target-icon-red.svg'
        }
      });

      getCurrentLocation((err, position) => {
        if (err) { throw err; }
        self.$mapObj.setCenter(position);
        self.$store.dispatch('TRIP.ADD_SEARCH_START', {
          formatted_address: 'Current Location',
          geometry: {
            location: position
          }
        });
        // self.$startMarker.setPosition(position);
        // self.$mapObj.setZoom(13);
      });

      self.mapLoaded = true;
      resolveTrip();
    });
  }
};

function getCurrentLocation(done) {
  if (!navigator.geolocation) {
    return done(new Error('Geolocation services unsupported.'));
  }
  navigator.geolocation.getCurrentPosition((position) => {
    if (!position) {
      return done(new Error('Cannot determine current position.'));
    }
    console.log('poz', position);
    done(null, {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  });
}

function addMarker(google, position, options = {}) {
  return new google.maps.Marker(Object.assign({}, options, {
    position
  }));
}
