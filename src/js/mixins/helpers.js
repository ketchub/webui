const navToggleClass = 'nav-open';

/**
 * Just to maintain some semblance of convention (and since these methods
 * are injected into the global Vue instance), prefix follow the naming
 * convention "$__{methodName}Helper". Its verbose but effective.
 */
export default {
  methods: {
    $__toggleNavHelper(to) {
      this.$store.dispatch('UI.NAV_TOGGLE', to);
    }
  }
};
