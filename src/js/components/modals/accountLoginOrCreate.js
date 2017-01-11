export default {
  template: '#components_modals_account-login-or-create',
  data() {
    return {
      viewForm: 'login',
      email: null,
      password: null,
      firstName: null,
      lastName: null
    };
  },
  methods: {
    loginLocal() {
      const { email, password, $apiService, $store, closeModal } = this;
      $apiService.post('/auth/local', {email, password}, (err, resp) => {
        if (err) { return alert(err); }
        $store.dispatch('ACCOUNT.SET_TOKEN', resp.token);
        $store.dispatch('ACCOUNT.SET_IS_LOGGED_IN', true);
        closeModal();
      });
    },
    createAccountLocal() {
      const { email, password, firstName, lastName, $apiService, $store, closeModal } = this;
      const payload = { email, password, firstName, lastName };
      $apiService.post('/account', payload, (err, resp) => {
        if (err) { return alert(err.message); }
        $store.dispatch('ACCOUNT.SET_TOKEN', resp.token);
        $store.dispatch('ACCOUNT.SET_IS_LOGGED_IN', true);
        closeModal();
      });
    },
    setView(to) {
      this.viewForm = to;
    }
  }
};
