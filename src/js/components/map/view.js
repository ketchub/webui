import { get, each } from 'lodash';
import { consoleHelper } from '@/support/util';
import mapStyles from '@/support/mapStyle';
import getInstance from '@/components/map/_instance';
import getGoogleSdk from '@/support/getGoogleSdk';
import eventBus from '@/support/eventBus';
// https://github.com/denissellu/routeboxer

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
    updateDirectionsPolyline: _updateDirectionsPolyline,
    updateContainmentPolygonDisplay: _updateContainmentPolygonDisplay,
    makeMarker: _makeMarker,
    queryDirections: _queryDirections,
    searchResultsHandler: _searchResultsHandler,
    centerMap: function () {
      const self = this;
      const { $google, $map } = this;

      if (!this.calcdBounds) {
        this.calcdBounds = new $google.maps.LatLngBounds();
        this.calcdBounds.union(self.$startMarker._circle.getBounds());
        this.calcdBounds.union(self.$endMarker._circle.getBounds());
      }

      $map.panTo(this.calcdBounds.getCenter());

      // $google.maps.event.addListenerOnce($map, 'resize', function() {
        // const bounds = new $google.maps.LatLngBounds();
        // // make bounds account for radius circle query
        // bounds.union(self.$startMarker._circle.getBounds());
        // bounds.union(self.$endMarker._circle.getBounds());
        // $map.panTo(bounds.getCenter());
        // $map.fitBounds(bounds);
      // });
      $google.maps.event.trigger($map, 'resize');



      // setTimeout(function () {
      //   console.log('set by bounds invoked', bounds, this.$map);
      // }.bind(this), 250);

      // this.$map.setCenter(this.$map.getCenter());
      // this.$map.setZoom(1);
    }
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

        // per maps api docs: "This event is fired when the map becomes idle
        // after panning or zooming."
        map.addListener('idle', () => {
          localStorage.setItem('ketch.mapSettings', JSON.stringify({
            zoom: map.getZoom(),
            center: map.getCenter()
          }));
        });

        // When reloading the page, zoom/center back to last spot
        if (localStorage.getItem('ketch.mapSettings')) {
          const lastMapStatus = JSON.parse(localStorage.getItem('ketch.mapSettings'));
          map.setZoom(lastMapStatus.zoom);
          map.setCenter(lastMapStatus.center);
        }

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
    updateContainmentPolygonDisplay,
    queryDirections,
    updateDirectionsPolyline,
    searchResultsHandler
  } = this;

  $store.watch(state => state.trip._origin, () => {
    updateTripMarkers();
    queryDirections();
  });
  $store.watch(state => state.trip._destination, () => {
    updateTripMarkers();
    queryDirections();
  });
  $store.watch(state => state.trip._directions, () => {
    updateDirectionsPolyline();
  });
  $store.watch(state => state.trip._containmentPolygon, () => {
    updateContainmentPolygonDisplay();
  });
  $store.watch(state => state.search._results, searchResultsHandler);

  // Invoke all these methods on initialization to sync display to the store
  updateTripMarkers();
  updateDirectionsPolyline();
  updateContainmentPolygonDisplay();
}


/**
 * Update map display with search results...
 * @return {void}
 */
let _polyLinesCache = {};
function _searchResultsHandler() {
  const { $map, $google } = this;
  const { searchResults } = this.$store.getters;

  each(_polyLinesCache, (poly, id) => {
    poly.setMap(null);
    delete poly[id];
  });
  _polyLinesCache = {};

  each(searchResults, (record) => {
    let plyln = record.encodedPolyline || record.doc.encodedPolyline;
    _polyLinesCache[record.id || record.doc.id] = new $google.maps.Polyline({
      map: $map,
      path: $google.maps.geometry.encoding.decodePath(plyln),
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      zIndex: 99
    });
  });

  if (!this.$searchResultsEventBusListener) {
    this.$searchResultsEventBusListener = true;
    eventBus.$on('polyline:highlight', (recordId) => {
      if (_polyLinesCache[recordId]) {
        _polyLinesCache[recordId].setOptions({
          strokeWeight: 7,
          strokeColor: '#AA00DF',
          strokeOpacity: 1
        });
      }
    });
    eventBus.$on('polyline:unhighlight', (recordId) => {
      if (_polyLinesCache[recordId]) {
        _polyLinesCache[recordId].setOptions({
          strokeColor: '#FF0000',
          strokeWeight: 2,
          strokeOpacity: 0.5
        });
      }
    });
  }
}


/**
 * Update directions *display* when store data changes.
 * @return {void}
 */
function _updateDirectionsPolyline() {
  const { $map, $directionsRenderer, $google } = this;
  const { tripDirections } = this.$store.getters;

  if (!tripDirections) {
    if (this.$directionsPolyline) {
      this.$directionsPolyline.setVisible(false);
    }
    return;
  }

  if (!this.$directionsPolyline) {
    this.$directionsPolyline = new $google.maps.Polyline({
      path: $google.maps.geometry.encoding.decodePath(tripDirections.overview_polyline),
      strokeColor: '#31536b',
      strokeOpacity: 1,
      strokeWeight: 3,
      map: $map,
      zIndex: 2
    });
    return;
  }
  this.$directionsPolyline.setPath($google.maps.geometry.encoding.decodePath(tripDirections.overview_polyline));
  this.$directionsPolyline.setVisible(true);
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

  if (!this.$containmentPolygon) {
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
  const { $store, $directionsService, $google } = this;
  const { tripOrigin, tripDestination } = $store.getters;
  if (!tripOrigin || !tripDestination) { return; }

  consoleHelper.green('Google maps directions API queried.');

  $directionsService.route({
    origin: tripOrigin.geometry.location,
    destination: tripDestination.geometry.location,
    travelMode: 'DRIVING',
    provideRouteAlternatives: false
  }, (response, status) => {
    // @todo: error & status checking
    const request = response.request;
    const route   = response.routes[0];
    const leg     = route.legs[0];

    // @note: we're not storing the full directions response here,
    // but just a subset instead. if more information is needed from
    // the response, THIS is where should be adjusted
    $store.dispatch('TRIP.SET_DIRECTIONS', {
      request,
      distance: leg.distance,
      start_address: leg.start_address,
      start_location: leg.start_location,
      end_address: leg.end_address,
      end_location: leg.end_location,
      bounds: route.bounds,
      overview_polyline: route.overview_polyline
    });
  });
}


/**
 * Create a marker on the map and setup event listeners.
 */
function _makeMarker(map, params) {
  const { $google, $store, $_reverseGeocode } = this;
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

  // Add listener for on drag end that initiates a $_reverseGeocode
  // and emits an action
  marker.addListener('dragend', (data) => {
    $_reverseGeocode(data.latLng.toJSON(), (err, bestGuess) => {
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
    $store.dispatch(actionOnSearchRadiusChange, Math.round(
      marker._circle.getRadius()
    ));
  });

  return marker;
}
