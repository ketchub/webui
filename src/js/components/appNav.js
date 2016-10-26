const componentName = 'appNav';

export default function ( vue ) {
  return vue.component(componentName, vue.extend({
    name: componentName,
    template: '#components_nav',
    methods: {
      toggleNav( className ) {
        this.toggleDocumentClass(className);
      }
    },
    mounted () {
      const rootNode = this.$el;
    }
  }));
}
