const componentName = 'placeSearch';

/**
 * @ref: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
 */
export default function ( vue ) {
  console.log('global method: ', vue);
  vue.component(componentName, vue.extend({
    name: componentName,
    template: '#components_place-search',
    props: ['mapObj'],
    watch: {
      mapObj(val) {
        console.log('computed the: ', val);
        this.initialize();
      }
    },
    methods: {
      initialize() {
        console.log('initing', this.mapObj);
      }
    },
    mounted() {
      console.log('this is: ', this);
      const $input = this.$el.querySelector('input');
      console.log('place search: ', this.mapObj);

      this.$loadGoogleSDK((google) => {
        const autoCompleteApi = new google.maps.places.Autocomplete($input);
      });
    }
  }));
}
