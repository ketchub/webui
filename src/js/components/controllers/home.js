export default {
  methods: {
    btnCloseSearchOverlay() {
      this.$store.dispatch('UI.SET_PAGE_HOME_SEARCH_OVERLAY', false);
    },
    btnPostRide() {
      const { $_toggleModal } = this;
      $_toggleModal('modalsTripAdd');
      
      // const { $store, $ketchApi } = this;
      // $ketchApi.rides.add($store.getters.tripSummaryData, (err, resp) => {
      //   console.log('added!', err, resp);
      // });
    },
    /**
     * @todo: trigger map redraw since the container potentially
     * gets resized via CSS (this should be done only once the
     * transition is completed...)
     */
    btnSearch() {
      const { $store, $ketchApi } = this;
      // open the overlay
      $store.dispatch('UI.SET_PAGE_HOME_SEARCH_OVERLAY', true);
      // send the query
      $ketchApi.rides.search($store.getters.tripSummaryData, (err, resp) => {
        console.log('got here', err, resp);
      });
    }
  }
};
