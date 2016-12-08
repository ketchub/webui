import Vue from 'vue';

export default {
  template: '#components_search_matches',
  data() {
    return {
      inProgress: false,
      initialSearchCompleted: false,
      query: {
        date: null,
        time: {
          hourMin: '5:30',
          // hour: 5,
          // min: 15,
          ampm: 'pm'
        },
        flexible: false,
        wouldDrive: true,
        addMyRequest: true
      }
    };
  },

  methods: {
    onSubmit() {
      const pluckAddressComponent = Vue.filter('pluckAddressComponent');
      const { tripOrigin, tripDestination, tripDirections } = this.$store.getters;
      const query = Object.assign({}, {
        flexible: this.$data.query.flexible,
        wouldDrive: this.$data.query.wouldDrive,
        origin: tripDirections.request.origin,
        destination: tripDirections.request.destination,
        encodedPolyline: tripDirections.routes[0].overview_polyline,
        originZip: +(pluckAddressComponent(tripOrigin, 'postal_code')),
        destinationZip: +(pluckAddressComponent(tripDestination, 'postal_code')),
        originCity: pluckAddressComponent(tripOrigin, 'locality'),
        destinationCity: pluckAddressComponent(tripDestination, 'locality'),
        containment: [
          // tripOrigin.
        ]
      });

      console.log(query);
      // this.$apiService.post('/search', query, (err, resp) => {
      //   console.log('/search', err, resp);
      // });
    }
  }
};
