import { mapValues } from 'lodash';
import mapStyles from '@/support/mapStyle';
const instances = {};

export default function (google, mapName, done) {
  if (instances[mapName]) {
    return done(instances[mapName]);
  }

  const node = document.createElement('div');
  const directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    preserveViewport: true
  });
  const directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(node, {
    center: {lat:39.09024, lng:-95.712891},
    zoom: 4,
    mapTypeId: 'HighViz',
    mapTypeControl: false,
    scrollwheel: false
  });

  node.classList.add('map-instance');
  map.mapTypes.set('HighViz', new google.maps.StyledMapType(mapStyles, {
    name: 'HighViz'
  }));
  directionsRenderer.setMap(map);

  instances[mapName] = {
    node,
    map,
    directionsRenderer,
    directionsService
  };

  done(instances[mapName]);
}
