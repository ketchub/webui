export default {
  template: '#components_modal-window',
  computed: {
    componentName() {
      return this.$store.getters.modalComponentName;
    }
  }
};
