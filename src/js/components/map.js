const componentName = 'mapView';
const style = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];

export default function ( vue ){
  return vue.component(componentName, vue.extend({
    name: componentName,
    template: '#components_map',
    mounted() {
      const node = this.$el;

      this.$loadGoogleSDK((google) => {
        const styledMapType = new google.maps.StyledMapType(style, {
          name: 'Default'
        });
        const map = new google.maps.Map(node, {
          center: {lat:39.09024, lng:-95.712891},
          zoom: 5,
          mapTypeId: 'Default',
          mapTypeControl: false,
          scrollwheel: false
          // mapTypeControlOptions: {
          //   mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'Default']
          // }
        });
        map.mapTypes.set('Default', styledMapType);
        setCurrentLocation(google, map);
      });
    }
  }));
}

function setCurrentLocation(google, map) {
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const pos = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };
  //     map.setCenter(pos);
  //   });
  // }
}
