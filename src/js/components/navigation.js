import { get } from 'lodash';

export default {
  computed: {
    navItems() {
      return get(this, '$router.options.routes').filter((r) => {
        return !(r.meta && r.meta.unlisted);
      });
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('ACCOUNT.DO_LOGOUT', null);
    }
  }
};
