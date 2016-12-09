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

  methods: {
    getQuery() {
      const pluckAddressComponent = Vue.filter('pluckAddressComponent');
      const {
        tripOrigin,
        tripDestination,
        tripDirections,
        tripContainmentPolygon
      } = this.$store.getters;
      return Object.assign({}, {
        // flexible: this.$data.query.flexible,
        // wouldDrive: this.$data.query.wouldDrive,
        originPoint: tripDirections.request.origin,
        destinationPoint: tripDirections.request.destination,
        encodedPolyline: tripDirections.routes[0].overview_polyline,
        originZip: +(pluckAddressComponent(tripOrigin, 'postal_code')),
        destinationZip: +(pluckAddressComponent(tripDestination, 'postal_code')),
        originCity: pluckAddressComponent(tripOrigin, 'locality'),
        destinationCity: pluckAddressComponent(tripDestination, 'locality'),
        containmentPolygon: tripContainmentPolygon
      });
    },

    submitSearch() {
      this.$apiService.post('/search', this.getQuery(), (err, resp) => {
        console.log('/search', err, resp);
      });
    },

    submitRide() {
      this.$apiService.post('/post-ride', this.getQuery(), (err, resp) => {
        console.log('/post-ride', err, resp);
      });
    }
  }
};
