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
      const { $ketchApi, $_toggleModal } = this;
      $ketchApi.account.authLocal({
        email: this.email,
        password: this.password
      }, (err, resp) => {
        if (!err) { $_toggleModal(false); }
      });
    },
    createAccountLocal() {
      const { $ketchApi, $_toggleModal } = this;
      $ketchApi.account.create({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName
      }, (err, resp) => {
        if (!err) { $_toggleModal(false); }
      });
    },
    setView(to) {
      this.viewForm = to;
    }
  }
};
