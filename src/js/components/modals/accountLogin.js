export default {
  template: '#components_modals_account-login',
  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    doLogin() {
      const { $ketchApi, $_toggleModal } = this;
      $ketchApi.account.authLocal({
        email: this.email,
        password: this.password
      }, (err, resp) => {
        if (!err) { $_toggleModal(false); }
      });
    },
    openCreateAccountModal() {
      this.$_toggleModal({
        componentName: 'modalsAccountCreate',
        title: 'Create Account'
      });
    }
  }
};
