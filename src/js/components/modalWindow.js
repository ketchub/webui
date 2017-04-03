export default {
  template: '#components_modal-window',
  computed: {
    modalData() {
      return this.$store.getters.modalData;
    }
  }
};
