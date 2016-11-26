import VueRouter from 'vue-router';
import routes from '@/routes';

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;

/**
 * After each navigation completes, emit a ROUTER:PAGE_CHANGE event which will
 * invoke an action to set navStatus to false.
 */
router.afterEach(function () {
  if( router.app && router.app.$__toggleNavHelper ) {
    router.app.$__toggleNavHelper(false);
  }
});
