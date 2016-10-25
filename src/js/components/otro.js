const componentName = 'otro';

export default function ( vue ){
  return vue.component(componentName, vue.extend({
    name: componentName,
    template: '#login',
    computed: {
      classes () {
        return {
          open: this.$store.state.ui.progressBar.isOpen,
          success: this.$store.state.ui.progressBar.success
        };
      },
      percentComplete () {
        return this.$store.state.ui.progressBar.completion;
      }
    }
  }));
}
