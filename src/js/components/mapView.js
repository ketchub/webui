const componentName = 'mapView';
const style = [
  {featureType: 'all', elementType: 'labels.text.fill', stylers:[{color:'#ffffff'}]},
  {featureType: 'all', elementType: 'labels.text.stroke', stylers:[{color:'#000000'},{lightness:13}]},
  // {featureType: 'administrative', elementType: 'geometry', stylers:[{visibility:off}]},
  {featureType: 'administrative', elementType: 'geometry.fill', stylers:[{color:'#000000'}]},
  {featureType: 'administrative', elementType: 'geometry.stroke', stylers:[{color:'#144b53'},{lightness:14},{weight:1.4}]},
  {featureType: 'administrative', elementType: 'labels.text.fill',  stylers:[{color:'#32a591'}]},
  // {featureType: 'administrative', elementType: 'labels', stylers:[{visibility:off}]},
  // {featureType: 'administrative.country', elementType: 'labels', stylers:[{visibility:off}]},
  {featureType: 'landscape', elementType: 'all', stylers:[{color:'#08304b'}]},
  {featureType: 'landscape', elementType: 'labels', stylers:[{visibility:'off'}]},
  {featureType: 'poi', elementType: 'geometry', stylers:[{color:'#0c4152'},{lightness:5}]},
  {featureType: 'road.highway', elementType: 'geometry.fill', stylers:[{color:'#000000'}]},
  {featureType: 'road.highway', elementType: 'geometry.stroke', stylers:[{color:'#0b434f'},{lightness:25}]},
  {featureType: 'road.arterial', elementType: 'geometry.fill', stylers:[{color:'#000000'}]},
  {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers:[{color:'#0b3d51'},{lightness:16}]},
  {featureType: 'road.local', elementType: 'geometry', stylers:[{color:'#000000'}]},
  {featureType: 'transit', elementType: 'all', stylers:[{color:'#146474'}]},
  {featureType: 'water', elementType: 'all', stylers:[{color:'#c9edf6'}]}
];

export default function ( vue ){
  vue.component(componentName, vue.extend({
    name: componentName,
    template: '#components_map',
    data() {
      return {
        mapObj: null
      };
    },
    mounted() {
      const node = this.$el.querySelector('.map-instance');
      let self = this;

      this.$loadGoogleSDK((google) => {
        const styledMapType = new google.maps.StyledMapType(style, {
          name: 'Default'
        });

        self.mapObj = new google.maps.Map(node, {
          center: {lat:39.09024, lng:-95.712891},
          zoom: 4,
          mapTypeId: 'Default',
          mapTypeControl: false,
          scrollwheel: false
        });
        self.mapObj.mapTypes.set('Default', styledMapType);

        getCurrentLocation((err, position) => {
          if (err) { throw err; }
          self.mapObj.setCenter(position);
          self.mapObj.setZoom(13);
          addMarker(google, self.mapObj, position);
        });
      });
    }
  }));
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
