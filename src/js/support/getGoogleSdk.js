import loadScriptHelper from '@/support/util/loadScriptHelper';
import getConfig from '@/support/getConfig';

/**
 * Load the google maps SDK and return 'google' global var to callback.
 * @todo: error handling; if fails to load, do timeout and actually return an error
 * @param  {Function} done callback
 * @return {void}
 */
export default function(done) {
  // done(null, mocker());
  if (window['google']) { return done(null, window['google']); }
  const apiKey = getConfig('GOOGLE_MAPS_API_KEY');
  const scriptSrc = `//maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
  loadScriptHelper(scriptSrc, () => {
    done(null, window['google']);
  });
}

/**
 * This returns a mock with all methods and constructors stubbed
 * out. If a method is missing, just add it here following the conventions
 * used below.
 * @return {Object} GoogleMaps API mock.
 */
function mocker() {
  function _stubber(data) {
    return Object.assign(data || {}, {
      addListener(){},
      setVisible(){},
      setPosition(){},
      getBounds(){},
      union(){},
      getCenter(){},
      setMap(){},
      setDirections(){},
      bindTo(){}
    });
  }

  return {
    maps: {
      Map(node){
        return {
          mapTypes: {
            set(){}
          },
          getDiv(){return node;},
          setCenter(){},
          fitBounds(){},
          addListener(){},
          setZoom(){}
        };
      },
      StyledMapType: _stubber,
      Size: _stubber,
      Point: _stubber,
      Circle: _stubber,
      Marker: _stubber,
      DirectionsRenderer: _stubber,
      DirectionsService: _stubber,
      LatLngBounds: _stubber,
      Polygon: _stubber,
      Polyline: _stubber,
      Animation: {
        DROP: 'drop'
      },
      places: {
        Autocomplete: _stubber
      },
      geometry: {
        encoding: {
          decodePath(){}
        }
      }
    }
  };
}
