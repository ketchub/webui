import { defer } from 'lodash';

export default {
  template: '#components_account_basics',
  computed: {
    accountImageStyleObj() {
      const accountInfo = this.$store.getters.accountInfo;
      if (accountInfo && accountInfo.image) {
        return {
          'background-image': `url("${accountInfo.image}")`
        };
      }
    }
  },
  mounted() {
    // shouldn't need to defer this, there is a funny order of events occurring
    // somewhere higher up the chain...
    // @todo
    defer(() => {
      // invoking this will set data on the store appropriately
      this.$ketchApi.account.get();
    });
  }
};
