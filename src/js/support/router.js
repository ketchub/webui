import VueRouter from 'vue-router';
import routes from '@/routes';

const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'nav-active'
});

export default router;

/**
 * After each navigation completes, emit a ROUTER:PAGE_CHANGE event which will
 * invoke an action to set navStatus to false.
 */
router.afterEach(function () {
  if (router.app && router.app.$_toggleNav) {
    router.app.$_toggleNav(false);
  }
});
