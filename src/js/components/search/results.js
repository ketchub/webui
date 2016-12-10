import eventBus from '@/support/eventBus';

export default {
  template: '#components_search_results',
  props: ['record'],
  methods: {
    onClick() {
      console.log('on click');
    },
    onMouseEnter() {
      eventBus.$emit('polyline:highlight', this.record.doc.id);
    },
    onMouseLeave() {
      eventBus.$emit('polyline:unhighlight', this.record.doc.id);
    }
  }
};
