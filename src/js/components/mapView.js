import mapStyles from '@/config/mapStyles';
const componentName = 'mapView';

export default function ( Vue, templateFrom = '#components_map' ) {
  Vue.component(componentName, {
    name: componentName,
    template: templateFrom,
    data: function() {
      return {
        $mapObj: null,
        mapLoaded: false
      };
    },
    mounted() {
      const node = this.$el.querySelector('.map-instance');
      const self = this;
      console.log('yolo');

      this.$loadGoogleSDK((google) => {
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

        getCurrentLocation((err, position) => {
          if (err) { throw err; }
          self.$mapObj.setCenter(position);
          self.$mapObj.setZoom(13);
          addMarker(google, self.$mapObj, position);
        });

        self.mapLoaded = true;
      });
    }
  });
}

function getCurrentLocation(done) {
  if (!navigator.geolocation) {
    return done(new Error('Geolocation services unsupported.'));
  }
  navigator.geolocation.getCurrentPosition((position) => {
    if (!position) {
      return done(new Error('Cannot determine current position.'));
    }
    done(null, {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  });
}

function addMarker(google, map, position) {
  return new google.maps.Marker({
    map, position
  });
}
