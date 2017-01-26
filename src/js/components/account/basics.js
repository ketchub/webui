import eventBus from '@/support/eventBus';

export default {
  template: '#components_account_basics',
  computed: {
    accountImageStyleObj() {
      const accountInfo = this.$store.getters.accountInfo;
      if (accountInfo && accountInfo.image) {
        return {
          'background-image': `url("${accountInfo.image.full}")`
        };
      }
    }
  },
  mounted() {
    // invoking this will set data on the store appropriately
    this.$ketchApi.account.get();
  }
};
