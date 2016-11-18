export default {
  methods: {
    checkSupport(feature) {
      return !!(window['Modernizr'] && window['Modernizr'][feature] );
    }
  }
};
