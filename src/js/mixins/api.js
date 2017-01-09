import Vue from 'vue';

/**
 * Just to maintain some semblance of convention (and since these methods
 * are injected into the global Vue instance), prefix follow the naming
 * convention "$__{methodName}Helper". Its verbose but effective.
 */
export default {
  methods: {
    $$getTripSummary() {
      const pluckAddressComponent = Vue.filter('pluckAddressComponent');
      const {
        tripOrigin,
        tripDestination,
        tripDirections,
        tripContainmentPolygon,
        tripOriginSearchRadius,
        tripDestinationSearchRadius
      } = this.$store.getters;

      return Object.assign({}, {
        // flexible: this.$data.query.flexible,
        // wouldDrive: this.$data.query.wouldDrive,
        tripDistance: tripDirections.routes[0].legs[0].distance.value,
        originPoint: tripDirections.request.origin,
        originSearchRadius: tripOriginSearchRadius,
        destinationPoint: tripDirections.request.destination,
        destinationSearchRadius: tripDestinationSearchRadius,
        encodedPolyline: tripDirections.routes[0].overview_polyline,
        originZip: +(pluckAddressComponent(tripOrigin, 'postal_code')),
        destinationZip: +(pluckAddressComponent(tripDestination, 'postal_code')),
        originCity: pluckAddressComponent(tripOrigin, 'locality'),
        destinationCity: pluckAddressComponent(tripDestination, 'locality'),
        containmentPolygon: tripContainmentPolygon,
        // routeLine: tripDirections.routes[0].overview_path
      });
    }
  }
};
