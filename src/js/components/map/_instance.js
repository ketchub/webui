import getGoogleSdk from '@/support/getGoogleSdk';
import mapStyles from '@/support/mapStyle';
const cache = {};

export default function (name, done) {
  if (cache[name]) {
    return done(null, cache[name]);
  }

  getGoogleSdk((err, google) => {
    if (err) { /* @todo */ }

    const node = document.createElement('div');
    node.className = 'map-instance';

    cache[name] = new google.maps.Map(node, {
      center: {lat:39.09024, lng:-95.712891},
      zoom: 4,
      mapTypeId: 'HighViz',
      mapTypeControl: false,
      scrollwheel: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true
    });

    cache[name].mapTypes.set('HighViz',
      new google.maps.StyledMapType(mapStyles), {
        name: 'HighViz'
      }
    );

    // @todo: dereference the 'node' variable once its been passed to the map?

    done(null, cache[name]);
  });
}
