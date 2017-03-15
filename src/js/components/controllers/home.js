import { TweenLite, TimelineLite, Expo, Power2 } from 'gsap';
import getGoogleSdk from '@/support/getGoogleSdk';

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
      // $store.dispatch('UI.SET_PAGE_HOME_SEARCH_OVERLAY', true);
      // send the query
      $ketchApi.rides.search($store.getters.tripSummaryData, (err, resp) => {
        console.log('got here', err, resp);
      });
      this.animateSearchIn();
    },
    animateSearchIn() {
      if ( !!(this.$tl.progress()) ) {
        return this.$tl.reverse();
      }
      this.$tl.play();
    }
  },
  mounted() {
    const { $refs } = this;

    this.$tl = new TimelineLite({
      paused: true
    });

    this.$tl.to($refs.searchFields, 0.3, {
      // top: -$refs.searchFields.clientHeight,
      // left: 0,
      // right: 0,
      // maxWidth: '100%',
      className: '+=mini'
    });

    this.$tl.to($refs.map, 0.3, {
      height: document.body.clientHeight * 0.3,
      onComplete: $refs.mapObj.centerMap,
      onReverseComplete: $refs.mapObj.centerMap,
      onUpdate: $refs.mapObj.centerMap,
      ease: Power2.easeOut
    }, '-=0.2');

    // this.$tl.to($refs.results, 0.2, {
    //   display: 'block',
    //   top: document.body.clientHeight
    // });
  }
};
