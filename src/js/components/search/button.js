import Vue from 'vue';

export default {
  template: `
    <button type="button" class="btn btn-success execute-search-btn" @click="execute">Find Matching Trips</button>
  `,
  methods: {
    getQueryData: _getQueryData,
    execute() {
      document.querySelector('.page-home').classList.toggle('shrunk');

      const { $store, $apiService, getQueryData } = this;
      $apiService.post('/search', getQueryData(), (err, resp) => {
        $store.dispatch('SEARCH.SET_RESULTS', resp.results);
      });
    }
  }
};

function _getQueryData() {
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
    routeLine: tripDirections.routes[0].overview_path
  });
}
