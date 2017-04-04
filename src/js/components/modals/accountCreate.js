export default {
  template: '#components_modals_account-create',
  data() {
    return {
      email: null,
      phone: null,
      password: null,
      firstName: null,
      lastName: null
    };
  },
  methods: {
    doCreateAccount() {
      const { $ketchApi, $_toggleModal } = this;
      $ketchApi.account.create({
        email: this.email,
        phone: this.phone,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName
      }, (err/*, resp*/) => {
        if (!err) { $_toggleModal(false); }
      });
    }
  }
};
