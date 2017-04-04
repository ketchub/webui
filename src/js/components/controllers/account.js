import { forEach } from 'lodash';

export default {
  data() {
    return {
      accountInfo: Object.assign({}, this.$store.getters.accountInfo),
      editPhone: false,
      phoneValidationCode: null,
      editEmail: false
    };
  },
  methods: {
    // phone stuff
    toggleEditPhone(to) {
      this.editPhone = to;
    },
    verifyPhone() {
      const self = this;
      const { verifyPhone } = this.$ketchApi.account;
      verifyPhone(self.phoneValidationCode, (err, resp) => {
        if (resp.err) { return alert(resp.err); }
        self.$ketchApi.account.get();
      });
    },
    updatePhone() {
      const self = this;
      const phone = this.accountInfo.phone;
      this.$ketchApi.account.updatePhone(phone, () => {
        self.toggleEditPhone(false);
        self.$ketchApi.account.get();
      });
    },
    // email stuff
    toggleEditEmail(to) {
      this.editEmail = to;
    },
    updateEmail() {
      const self = this;
      const email = this.accountInfo.email;
      this.$ketchApi.account.updateEmail(email, () => {
        self.toggleEditEmail(false);
        self.$ketchApi.account.get();
      });
    }
  },
  mounted() {
    const self = this;

    // this only changes the values if they change *in the store*; eg.
    // if the user loads the UI on the account page, and the API request
    // for account details hasn't completed yet
    self.$store.watch(state => state.account._info, (v) => {
      forEach(v, (value, key) => {
        self.$set(self.accountInfo, key, value);
      });
    });

    // if the route query contains ?verify_email, then pass along
    const verifyEmailToken = this.$route.query.verify_email;
    if (verifyEmailToken) {
      self.$ketchApi.account.verifyEmail(verifyEmailToken, (err/*, resp*/) => {
        if (err) { return alert(err); }
        // if no error, assume it worked and refetch account
        self.$router.replace(self.$route.path);
        self.$ketchApi.account.get();
      });
    }
  }
};
