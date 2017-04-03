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
    openAccountLogin() {
      this.$_toggleModal({
        componentName: 'modalsAccountLogin',
        title: 'Login'
      });
    },
    openAccountCreate() {
      this.$_toggleModal({
        componentName: 'modalsAccountCreate',
        title: 'Create Account'
      });
    },
    logout() {
      this.$store.dispatch('ACCOUNT.DO_LOGOUT', null);
    }
  }
};
