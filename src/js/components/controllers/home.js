// import { TweenLite, TimelineLite, Expo, Power2 } from 'gsap';

export default {
  data() {
    return {
      resultsLoading: true
    };
  },
  watch: {
    '$store.getters.pageHomeResultsView': function (status) {
      console.log('pageHomeResultsViewWatcher status: ', status);
      // if (!status) {
      //   return this.$tl.reverse();
      // }
      // this.$tl.play();
    },
    // Automatically do something when directions are avail?
    '$store.getters.tripDirections': function (v) {
      console.log('dirs: ',v);
    }
  },
  methods: {
    btnShowFilters() {
      alert('show filters');
    },
    btnPostRide() {
      this.$_toggleModal({
        componentName: 'modalsTripAdd',
        title: 'Add Trip'
      });

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
      const self = this;
      const { $store, $ketchApi } = this;
      // results results loading to show animated thing
      self.resultsLoading = true;
      const payload = $store.getters.tripSummaryData;
      payload.routeBoxes = this.$refs.mapObj.$routeBoxes.map((rect) => {
        return rect.getBounds().toJSON();
      });
      // send the query
      $ketchApi.rides.search(payload, (err) => {
        if (err) { return alert('query error :(...'); }
        self.resultsLoading = false;
      });
      // show results view
      this.toggleSearchResults(true);
    },
    toggleSearchResults(to = false) {
      this.$store.dispatch('UI.SET_PAGE_HOME_RESULTS_VIEW', to);
    }
  },
  mounted() {
    const { $refs } = this;

    $refs.map.addEventListener('transitionend', (ev) => {
      if (ev.target !== $refs.map) { return; }
      $refs.mapObj.centerMap();
    }, false);

    // this.$tl = new TimelineLite({
    //   paused: true
    // });
    //
    // this.$tl.to($refs.searchFields, 0.3, {
    //   className: '+=mini'
    // });
    //
    // this.$tl.to($refs.map, 0.15, {
    //   height: document.body.clientHeight * 0.3,
    //   onComplete: $refs.mapObj.centerMap,
    //   onReverseComplete: $refs.mapObj.centerMap,
    //   // onUpdate: $refs.mapObj.centerMap,
    //   ease: Power2.easeOut
    // }, '-=0.2');
  }
};
