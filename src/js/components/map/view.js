import { each } from 'lodash';
import { consoleHelper } from '@/support/util';
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
  methods: {
    resolveTrip: _resolveTrip,
    makeMarker: _makeMarker,
    queryDirections: _queryDirections,
    visualHelpers: _visualHelpers
  },
  mounted() {
    const self = this;
    const {
      $store,
      makeMarker,
      mapName,
      $__loadGoogleSDKHelper,
      resolveTrip,
      visualHelpers
    } = this;

    $__loadGoogleSDKHelper((google) => {
      self.$google = google;
      $store.watch(state => state.trip._origin, resolveTrip);
      $store.watch(state => state.trip._destination, resolveTrip);
      $store.watch(state => state.trip._directions, visualHelpers);

      getInstance(google, mapName, (instance) => {
        // store the instance against the
        self.$instance = instance;
        // Start location marker
        self.$startMarker = makeMarker({
          marker: {
            title: 'Start Location',
            icon: {
              url: '/img/custom-target-icon.svg',
              size: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(20, 20)
            }
          },
          actionOnDragEnd: 'TRIP.SET_ORIGIN',
          actionOnSearchRadiusChange: 'TRIP.SET_ORIGIN_SEARCH_RADIUS',
          initialSearchRadius: $store.getters.tripOriginSearchRadius
        });
        // End location marker
        self.$endMarker = makeMarker({
          marker: {
            title: 'End Location',
            icon: {
              url: '/img/custom-target-icon-red.svg',
              size: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(20, 20)
            }
          },
          actionOnDragEnd: 'TRIP.SET_DESTINATION',
          actionOnSearchRadiusChange: 'TRIP.SET_DESTINATION_SEARCH_RADIUS',
          initialSearchRadius: $store.getters.tripDestinationSearchRadius
        });

        // Append to the DOM and invoke first resolveTrip
        self.$el.appendChild(self.$instance.node);
        resolveTrip();

        // show recents
        // self.$apiService.get('/recent', {}, (err, resp) => {
        //   each(resp.results, (record) => {
        //     let path = new google.maps.Polyline({
        //       path: google.maps.geometry.encoding.decodePath(record.encodedPolyline),
        //       strokeColor: '#00D0A3',
        //       strokeOpacity: 0.65,
        //       strokeWeight: 3,
        //       map: instance.map,
        //       _meta: record
        //     });
        //     // must be 'function' not () => {} to bind 'this' properly
        //     // path.addListener('click', function() {
        //     //   alert(`Origin: ${this._meta.originZip}, Destination: ${this._meta.destinationZip}`);
        //     // });
        //   });
        // });

      });
    });
  },
  // @todo: this shouldn't be applicable any more because we want to
  // <keep-alive ...> any parent component of this so we don't have to deal
  // with google map's inability to destroy
  beforeDestroy() {
    console.log('mapView destroyed! (this should not happen)');
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
  const self = this;
  const { tripOrigin, tripDestination } = this.$store.getters;
  const { map, directionsRenderer } = this.$instance;
  const { queryDirections, $startMarker, $endMarker, $google, visualHelpers } = this;

  $startMarker.setVisible(tripOrigin ? true : false);
  $endMarker.setVisible(tripDestination ? true : false);

  if (!tripOrigin || !tripDestination) {
    directionsRenderer.setDirections({routes:[]});
  }

  if( tripOrigin ) {
    $startMarker.setPosition(tripOrigin.geometry.location);
    if ( ! tripDestination ){
      map.setZoom(12);
      return map.panTo($startMarker.position);
    }
  }

  if( tripDestination ) {
    $endMarker.setPosition(tripDestination.geometry.location);
    if ( ! tripOrigin ) {
      map.setZoom(12);
      return map.panTo($endMarker.position);
    }
  }

  if ( tripOrigin && tripDestination ) {
    const bounds = new $google.maps.LatLngBounds();
    // bounds.extend($startMarker.getPosition());
    // bounds.extend($endMarker.getPosition());
    // make bounds account for radius circle query
    bounds.union($startMarker._circle.getBounds());
    bounds.union($endMarker._circle.getBounds());
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
    queryDirections();
  }
}

/**
 * Gets directions between two points and renders to the display.
 */
function _queryDirections() {
  const { directionsService, directionsRenderer } = this.$instance;
  const {$store, $google, $startMarker, $endMarker} = this;

  consoleHelper.green('Google maps directions API queried.');

  directionsService.route({
    origin: $startMarker.position,
    destination: $endMarker.position,
    travelMode: 'DRIVING',
  }, (response, status) => {
    $store.dispatch('TRIP.SET_DIRECTIONS', response);
    directionsRenderer.setDirections(response);
  });
}

/**
 * Create a marker on the map and setup event listeners.
 */
function _makeMarker(properties) {
  const { $instance, $google, $store, reverseGeocodeSearch, visualHelpers } = this;

  const marker = new $google.maps.Marker(Object.assign({
    draggable: true,
    animation: $google.maps.Animation.DROP,
    map: $instance.map,
    zIndex: 2,
    // not a standard or documented way of doing this but does make it so
    // we always have access to the associated circle instance easily
    _circle: new $google.maps.Circle({
      clickable: false,
      draggable: false,
      editable: true,
      fillColor: '#ffffff',
      fillOpacity: 0.1,
      radius: properties.initialSearchRadius,
      strokeColor: '#A30532',
      strokeOpacity: 1,
      strokeWeight: 1,
      visible: false,
      zIndex: 1,
      map: $instance.map
    })
  }, properties.marker));

  // Add listener for on drag end that initiates a reverseGeocodeSearch
  // and emits an action
  marker.addListener('dragend', (data) => {
    reverseGeocodeSearch(data.latLng.toJSON(), (bestGuess) => {
      bestGuess.MARKER_DROP_ESTIMATE = true;
      $store.dispatch(properties.actionOnDragEnd, bestGuess);
    });
  });

  // When marker position changes, update the circle position
  marker.addListener('position_changed', (data) => {
    marker._circle.setCenter(marker.position);
    marker._circle.setVisible(true);
  });

  // when marker visibility changes, update marker._circle visibility
  marker.addListener('visible_changed', () => {
    marker._circle.setVisible(marker.getVisible());
  });

  // when marker._circle search radius changes
  marker._circle.addListener('radius_changed', () => {
    $store.dispatch(
      properties.actionOnSearchRadiusChange,
      marker._circle.getRadius()
    );
    visualHelpers();
  });

  return marker;
}

/**
 * Visualize polygon containment on the map, as well as direct as-the-crow-flies
 * path between origin and destination. The polygon bounding box is what we're
 * really after to conduct bounded "nearby" search.
 *
 * Note, this isn't a create once and forget thing, but will be invoked every
 * time the origin or destinations change.
 *
 * @return {void}
 */
function _visualHelpers() {
  const { tripOrigin, tripDestination, tripDirections } = this.$store.getters;
  if (!tripOrigin || !tripDestination) { return; }

  const self = this;
  const { $instance, $startMarker, $endMarker, $google } = this;
  const { spherical } = $google.maps.geometry;

  const startBoundOffset = $startMarker._circle.getRadius(),
        startPosition = $startMarker.getPosition(),
        endBoundOffset = $endMarker._circle.getRadius(),
        endPosition = $endMarker.getPosition(),
        heading = spherical.computeHeading(startPosition, endPosition);

  const polyCoords = [
    spherical.computeOffset(startPosition, startBoundOffset, heading + 90),
    spherical.computeOffset(startPosition, startBoundOffset, heading - 90),
    spherical.computeOffset(endPosition, endBoundOffset, heading - 90),
    spherical.computeOffset(endPosition, endBoundOffset, heading + 90)
  ];

  // @todo: why would this ever evaluate to false?
  if ( self.$boundedPolyline && self.$boundedPolygon && self.$directionsBoundingRect ) {
    self.$boundedPolyline.setPath([startPosition, endPosition]);
    self.$boundedPolygon.setPaths(polyCoords);
    self.$directionsBoundingRect.setBounds(tripDirections.routes[0].bounds);
    return;
  }

  self.$boundedPolyline = new $google.maps.Polyline({
    path: [startPosition, endPosition],
    geodesic: true,
    strokeColor: '#DDFF00',
    strokeOpacity: 1.0,
    strokeWeight: 1,
    map: $instance.map
  });

  self.$boundedPolygon = new $google.maps.Polygon({
    paths: polyCoords,
    fillColor: '#00d0a3',
    fillOpacity: 0.25,
    strokeColor: '#ffffff',
    strokeOpacity: 0.25,
    strokeWeight: 1,
    map: $instance.map
  });

  self.$directionsBoundingRect = new $google.maps.Rectangle({
    fillColor: '#8e0d89',
    fillOpacity: 0.45,
    strokeWeight: 0,
    bounds: tripDirections.routes[0].bounds,
    map: $instance.map
  });
}
