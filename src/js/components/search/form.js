import Vue from 'vue';

export default {
  template: '#components_search_form',
  data() {
    return {
      query: {
        date: null,
        time: {
          hourMin: '5:30',
          // hour: 5,
          // min: 15,
          ampm: 'pm'
        },
        // flexible: false,
        // wouldDrive: true
      }
    };
  },
  mounted() {
    let self = this;
    const { submitSearch } = this;
    // this.$store.watch(state => state.trip._directions, submitSearch);
    // this.$store.watch(state => state.trip._destination, submitSearch);
    this.$store.watch(state => state.trip._containmentPolygon, () => {
      if (!this.$store.getters.tripDirections) {
        return;
      }
      // submitSearch();
    });
    // this.$store.watch(state => state.trip._directions, () => {
    //   console.log(JSON.stringify(self.getQuery()));
    // });
  },

  methods: {
    getQuery() {
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
    },

    submitSearch() {
      const { $store, $apiService, getQuery } = this;
      $apiService.post('/search', getQuery(), (err, resp) => {
        $store.dispatch('SEARCH.SET_RESULTS', resp.results);
      });
    },

    submitRide() {
      this.$apiService.post('/post-ride', this.getQuery(), (err, resp) => {
        console.log('/post-ride', err, resp);
      });
    }
  }
};
