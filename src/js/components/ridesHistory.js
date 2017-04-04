export default {
  props: {
    chronology: {
      type: String,
      required: true
    }
  },
  methods: {
    fetchRides() {
      const { $store, chronology } = this;
      // @todo: require manaul reloading
      this.$ketchApi.rides.list({chronology}, (err, resp) => {
        if (err) { return console.log('failed fetching ride history'); }
        $store.dispatch('ACCOUNT.SET_RIDE_HISTORY', resp);
      });
    }
  },
  watch: {
    chronology(/*a, b*/) {
      this.fetchRides();
    }
  },
  mounted() {
    this.fetchRides();
  }
};
