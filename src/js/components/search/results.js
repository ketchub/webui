import eventBus from '@/support/eventBus';

export default {
  template: '#components_search_results',
  props: ['record'],
  computed: {
    accountImageStyleObj() {
      return {
        'background-image': `url("${this.record._account.image}")`
      };
    }
  },
  methods: {
    onClick() {
      console.log('on click');
    },
    onMouseEnter() {
      eventBus.$emit('polyline:highlight', this.record.id);
    },
    onMouseLeave() {
      eventBus.$emit('polyline:unhighlight', this.record.id);
    }
  }
};
