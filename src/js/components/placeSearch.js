/**
 * @ref: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
 */
export default {
  template: '#components_place-search',
  props: ['map-obj', 'action', 'pass-value', 'placeholder'],
  computed: {
    value() {
      return this.passValue;
    }
  },
  mounted() {
    const { $store, action, mapObj, loadGoogleSDK } = this;
    const $input = this.$el.querySelector('input');

    // https://developers.google.com/places/supported_types#table3
    loadGoogleSDK((google) => {
      const autoCompleteApi = new google.maps.places.Autocomplete($input);
      autoCompleteApi.bindTo('bounds', mapObj);

      autoCompleteApi.addListener('place_changed', () => {
        const place = autoCompleteApi.getPlace();
        if (!place.address_components) { return; }
        $store.dispatch(action, place);
      });
    });
  }
};
