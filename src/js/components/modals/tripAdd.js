const METHOD_RIDE = 'RIDE';
const METHOD_EITHER = 'EITHER';
const METHOD_DRIVE = 'DRIVE';

export default {
  template: '#components_modals_trip-add',
  data() {
    return {
      rideOrDrive: METHOD_RIDE,
      seatCapacity: null,
      modes: {
        METHOD_RIDE,
        METHOD_EITHER,
        METHOD_DRIVE
      }
    };
  },
  computed: {
    getPolyline() {
      return this.$store.getters.tripPolyline;
    }
  },
  methods: {
    submit() {
      const { $store, $ketchApi, $_toggleModal, rideOrDrive, seatCapacity } = this;
      const payload = Object.assign({}, $store.getters.tripSummaryData, {
        rideOrDrive, seatCapacity
      });
      $ketchApi.rides.add(payload, (err, resp) => {
        console.log('trip added', err, resp);
        $_toggleModal(false);
      });
    }
  }
};
