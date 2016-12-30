export default {
  template: '#components_modal-window',
  // mounted() {
  //   this.$store.watch(state => state.ui.modal, (v) => {
  //     console.log('watcher called and cahnged', v);
  //   });
  // },
  computed: {
    componentName() {
      console.log('evaluated: ', this.$store.getters.modalComponentName);
      return this.$store.getters.modalComponentName;
    }
  }
};
