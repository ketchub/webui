export default {
  methods: {
    verifyPhone() {
      this.$ketchApi.account.verifyPhoneRequest(() => {

      });
    }
  }
};
