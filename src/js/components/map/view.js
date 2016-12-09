import { each } from 'lodash';
import { consoleHelper } from '@/support/util';
import mapStyles from '@/support/mapStyle';
import getInstance from '@/components/map/_instance';
import getGoogleSdk from '@/support/getGoogleSdk';

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
    init: _init,
    updateTripMarkers: _updateTripMarkers,
    updateDirectionsDisplay: _updateDirectionsDisplay,
    updateContainmentPolygonCoords: _updateContainmentPolygonCoords,
    updateContainmentPolygonDisplay: _updateContainmentPolygonDisplay,
    makeMarker: _makeMarker,
    queryDirections: _queryDirections,
    naiveGeometryHelpers: _naiveGeometryHelpers,
    routeGeometryHelpers: _routeGeometryHelpers,
    searchResultsHandler: _searchResultsHandler
  },
  mounted() {
    const self = this;
    const { $store, makeMarker, mapName, init } = this;

    getGoogleSdk((err, google) => {
      self.$google = google;

      getInstance(mapName, (err, map) => {
        self.$map = map;
        self.$el.appendChild(map.getDiv());

        const iconDefaults = {
          size: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(20, 20)
        };

        // Create markers (hidden by default)
        self.$startMarker = makeMarker(map, {
          title: 'Start Location',
          icon: Object.assign({
            url: '/img/custom-target-icon.svg'
          }, iconDefaults),
          actionOnDragEnd: 'TRIP.SET_ORIGIN',
          actionOnSearchRadiusChange: 'TRIP.SET_ORIGIN_SEARCH_RADIUS',
          initialSearchRadius: $store.getters.tripOriginSearchRadius
        });

        self.$endMarker = makeMarker(map, {
          title: 'End Location',
          icon: Object.assign({
            url: '/img/custom-target-icon-red.svg'
          }, iconDefaults),
          actionOnDragEnd: 'TRIP.SET_DESTINATION',
          actionOnSearchRadiusChange: 'TRIP.SET_DESTINATION_SEARCH_RADIUS',
          initialSearchRadius: $store.getters.tripDestinationSearchRadius
        });

        self.$directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          preserveViewport: true,
          map: map
        });

        self.$directionsService = new google.maps.DirectionsService();

        init();

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
 * Initialize store watchers, and invoke any (idempotent) methods to update
 * the display with data already in the trip store.
 */
function _init() {
  const {
    $store,
    updateTripMarkers,
    updateContainmentPolygonCoords,
    updateContainmentPolygonDisplay,
    queryDirections,
    naiveGeometryHelpers,
    routeGeometryHelpers,
    updateDirectionsDisplay,
    searchResultsHandler
  } = this;

  $store.watch(state => state.trip._origin, () => {
    updateTripMarkers();
    queryDirections();
    updateContainmentPolygonCoords();
    naiveGeometryHelpers();
  });
  $store.watch(state => state.trip._destination, () => {
    updateTripMarkers();
    queryDirections();
    updateContainmentPolygonCoords();
    naiveGeometryHelpers();
  });
  $store.watch(state => state.trip._directions, () => {
    updateDirectionsDisplay();
    naiveGeometryHelpers();
    routeGeometryHelpers();
  });
  $store.watch(state => state.trip._originSearchRadius, () => {
    updateContainmentPolygonCoords();
  });
  $store.watch(state => state.trip._destinationSearchRadius, () => {
    updateContainmentPolygonCoords();
  });
  $store.watch(state => state.trip._containmentPolygon, () => {
    updateContainmentPolygonDisplay();
  });
  $store.watch(state => state.search._results, searchResultsHandler);

  // Invoke all these methods on initialization to sync display to the store
  updateTripMarkers();
  updateContainmentPolygonCoords();
  naiveGeometryHelpers();
  routeGeometryHelpers();
  updateDirectionsDisplay();
}


/**
 * Update map display with search results...
 * @return {void}
 */
const _polyLinesCache = [];
function _searchResultsHandler() {
  const { $map, $google } = this;
  const { searchResults } = this.$store.getters;

  while(_polyLinesCache.length > 0) {
    _polyLinesCache.pop().setMap(null);
  }

  each(searchResults, (record) => {
    let plyln = record.encodedPolyline || record.doc.encodedPolyline;
    _polyLinesCache.push(new $google.maps.Polyline({
      map: $map,
      path: $google.maps.geometry.encoding.decodePath(plyln),
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 2
    }));
  });
}


/**
 * Update directions *display* when store data changes.
 * @return {void}
 */
function _updateDirectionsDisplay() {
  const { $map, $directionsRenderer } = this;
  const { tripDirections } = this.$store.getters;

  if (!tripDirections) {
    return $directionsRenderer.setMap(null);
  }

  $directionsRenderer.setMap($map);
  $directionsRenderer.setDirections(tripDirections);
}


/**
 * Update trip markers, and map view/bounds.
 */
function _updateTripMarkers() {
  const { tripOrigin, tripDestination } = this.$store.getters;
  const { $google, $map, $startMarker, $endMarker } = this;

  $startMarker.setVisible(tripOrigin ? true : false);
  $endMarker.setVisible(tripDestination ? true : false);

  if( tripOrigin ) {
    $startMarker.setPosition(tripOrigin.geometry.location);
    if ( ! tripDestination ){
      $map.setZoom(12);
      return $map.panTo($startMarker.position);
    }
  }

  if( tripDestination ) {
    $endMarker.setPosition(tripDestination.geometry.location);
    if ( ! tripOrigin ) {
      $map.setZoom(12);
      return $map.panTo($endMarker.position);
    }
  }

  if ( tripOrigin && tripDestination ) {
    const bounds = new $google.maps.LatLngBounds();
    // make bounds account for radius circle query
    bounds.union($startMarker._circle.getBounds());
    bounds.union($endMarker._circle.getBounds());
    $map.setCenter(bounds.getCenter());
    $map.fitBounds(bounds);
  }
}


/**
 * Update the containment poly coordinates (set values in the store, but *do
 * not* render anything). Another method will digest updates from the store
 * and render appropriately (we need this information for sending bounded
 * search queries, regardless of whether polygon is rendered on the map).
 * @return {void}
 */
function _updateContainmentPolygonCoords() {
  const { $store } = this;
  const { tripOrigin, tripDestination } = $store.getters;

  if (!tripOrigin || !tripDestination) {
    return $store.dispatch('TRIP.SET_CONTAINMENT_POLYGON', null);
  }

  const { $startMarker, $endMarker, $google, $map } = this;
  const { computeHeading, computeOffset } = $google.maps.geometry.spherical;
  const startOffset = $startMarker._circle.getRadius();
  const startPosition = $startMarker.getPosition();
  const endOffset = $endMarker._circle.getRadius();
  const endPosition = $endMarker.getPosition();
  const heading = computeHeading(startPosition, endPosition);
  const polyCoords = [
    computeOffset(startPosition, startOffset, heading + 90).toJSON(),
    computeOffset(startPosition, startOffset, heading - 90).toJSON(),
    computeOffset(endPosition, endOffset, heading - 90).toJSON(),
    computeOffset(endPosition, endOffset, heading + 90).toJSON()
  ];
  $store.dispatch('TRIP.SET_CONTAINMENT_POLYGON', polyCoords);
}


/**
 * Digest updates to the tripContainmentPolygon in the store and render as
 * appropriate.
 * @return {void}
 */
function _updateContainmentPolygonDisplay() {
  const { $map, $google } = this;
  const { tripContainmentPolygon } = this.$store.getters;

  if (!tripContainmentPolygon) {
    if (this.$containmentPolygon) {
      this.$containmentPolygon.setVisible(false);
    }
    return;
  }

  if ( ! this.$containmentPolygon ) {
    this.$containmentPolygon = new $google.maps.Polygon({
      paths: tripContainmentPolygon,
      fillColor: '#00d0a3',
      fillOpacity: 0.25,
      strokeColor: '#ffffff',
      strokeOpacity: 0.25,
      strokeWeight: 1,
      map: $map,
      zIndex: 1
    });
    return;
  }
  this.$containmentPolygon.setPaths(tripContainmentPolygon);
  this.$containmentPolygon.setVisible(true);
}


/**
 * Gets directions between two points and renders to the display.
 */
function _queryDirections() {
  const { $store, $directionsService } = this;
  const { tripOrigin, tripDestination } = $store.getters;

  if (!tripOrigin || !tripDestination) {
    return;
  }

  consoleHelper.green('Google maps directions API queried.');

  $directionsService.route({
    origin: tripOrigin.geometry.location,
    destination: tripDestination.geometry.location,
    travelMode: 'DRIVING',
  }, (response, status) => {
    $store.dispatch('TRIP.SET_DIRECTIONS', response);
  });
}


/**
 * Create a marker on the map and setup event listeners.
 */
function _makeMarker(map, params) {
  const { $google, $store, reverseGeocodeSearch } = this;
  const { actionOnDragEnd, actionOnSearchRadiusChange, initialSearchRadius } = params;

  const marker = new $google.maps.Marker(Object.assign({
    draggable: true,
    animation: $google.maps.Animation.DROP,
    map: map,
    zIndex: 2,
    // not a standard or documented way of doing this but does make it so
    // we always have access to the associated circle instance easily
    _circle: new $google.maps.Circle({
      clickable: false,
      draggable: false,
      editable: true,
      fillColor: '#ffffff',
      fillOpacity: 0.1,
      radius: initialSearchRadius,
      strokeColor: '#A30532',
      strokeOpacity: 1,
      strokeWeight: 1,
      visible: false,
      zIndex: 1,
      map: map
    })
  }, params));

  // Add listener for on drag end that initiates a reverseGeocodeSearch
  // and emits an action
  marker.addListener('dragend', (data) => {
    reverseGeocodeSearch(data.latLng.toJSON(), (bestGuess) => {
      bestGuess.MARKER_DROP_ESTIMATE = true;
      $store.dispatch(actionOnDragEnd, bestGuess);
    });
  });

  // When marker position changes, update the circle position
  marker.addListener('position_changed', (data) => {
    marker._circle.setCenter(marker.position);
  });

  // when marker visibility changes, update marker._circle visibility
  marker.addListener('visible_changed', () => {
    marker._circle.setVisible(marker.getVisible());
  });

  // when marker._circle search radius changes
  marker._circle.addListener('radius_changed', () => {
    $store.dispatch(actionOnSearchRadiusChange, marker._circle.getRadius());
  });

  return marker;
}


/**
 * Visualize polygon containment on the map, as well as direct as-the-crow-flies
 * path between origin and destination. The polygon bounding box is what we're
 * really after to conduct bounded nearby search.
 *
 * Note, this isn't a create once and forget thing, but will be invoked every
 * time the origin or destinations change.
 *
 * @return {void}
 */
function _naiveGeometryHelpers() {
  const { $google, $map } = this;
  const { tripOrigin, tripDestination } = this.$store.getters;
  const visible = !!(tripOrigin && tripDestination);

  if (!visible) {
    if (this.$directPolyline) {
      this.$directPolyline.setVisible(visible);
    }
    return;
  }

  if (!this.$directPolyline) {
    this.$directPolyline = new $google.maps.Polyline({
      path: [tripOrigin.geometry.location, tripDestination.geometry.location],
      strokeColor: '#DDFF00',
      strokeOpacity: 1.0,
      strokeWeight: 1,
      map: $map,
      zIndex: 2
    });
    return;
  }

  this.$directPolyline.setPath([tripOrigin.geometry.location, tripDestination.geometry.location]);
  this.$directPolyline.setVisible(visible);
}


/**
 * Render bounding box around the determined map route (mainly for debugging
 * and correctness validation).
 * @return {void}
 */
function _routeGeometryHelpers() {
  const { $google, $map } = this;
  const { tripDirections } = this.$store.getters;
  const visible = !!(tripDirections);

  if (!visible) {
    if (this.$directionsBoundingPoly) {
      this.$directionsBoundingPoly.setVisible(visible);
    }
    return;
  }

  if (!this.$directionsBoundingPoly) {
    this.$directionsBoundingPoly = new $google.maps.Rectangle({
      bounds: tripDirections.routes[0].bounds,
      fillColor: '#8e0d89',
      fillOpacity: 0.25,
      strokeWeight: 0,
      zIndex: 0,
      map: $map
    });
    return;
  }

  this.$directionsBoundingPoly.setBounds(tripDirections.routes[0].bounds);
  this.$directionsBoundingPoly.setVisible(visible);
}
