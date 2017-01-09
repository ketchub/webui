/**
 * Any method invoked by a button should be grouped here, instead of creating
 * individual components for each button.
 */
export default {
  methods: {
    __btnCloseSearchOverlay() {
      this.$store.dispatch('UI.SET_PAGE_HOME_SEARCH_OVERLAY', false);
    },
    __btnPostRide() {
      const { $store, $apiService, $$getTripSummary } = this;
      $apiService.post('/post-ride', $$getTripSummary(), (err, resp) => {
        console.log('/post-ride [@todo: complete action]', err, resp);
      });
    },
    __btnSearch() {
      const { $store, $apiService, $$getTripSummary } = this;
      // open the overlay
      $store.dispatch('UI.SET_PAGE_HOME_SEARCH_OVERLAY', true);
      // post search results
      $apiService.post('/search', $$getTripSummary(), (err, resp) => {
        $store.dispatch('SEARCH.SET_RESULTS', resp.results);
      });
    }
  }
};
