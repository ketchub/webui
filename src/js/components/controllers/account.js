export default {
  // computed: {
  //   phone: {
  //     get() {
  //       return this.$store.getters.accountInfo.phone;
  //     },
  //     set(value) {
  //       this._phone = value;
  //     }
  //   }
  // },
  data() {
    return {
      newPhone: null
      // phone: this.$store.getters.accountInfo.phone
    };
  },
  methods: {
    verifyPhone() {
      this.$ketchApi.account.verifyPhoneRequest(() => {

      });
    },
    updatePhone() {
      this.$ketchApi.account.update({phone: this.newPhone}, (a,b,c) => {
        console.log('returned: ', a, b, c);
      });
    }
  }
};
