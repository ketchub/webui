/**
 * This could be bundled into a plugin easily, but we want plugin to always
 * be completely self-contained. Since this interacts with the single store's
 * 'ui' module, keep it as a mixin for self-documenting purposes.
 */
export default {
  methods: {
    openModal(componentName) {
      this.$store.dispatch('UI.SET_MODAL_COMPONENT', componentName);
    },
    closeModal() {
      this.$store.dispatch('UI.SET_MODAL_COMPONENT', null);
    }
  }
};
