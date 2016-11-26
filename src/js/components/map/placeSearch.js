import getInstance from '@/components/map/_instance';

/**
 * @ref: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
 */
export default {
  template: '#components_place-search',
  props: {
    mapName: {
      type: String,
      required: true
    },
    addAction: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false
    }
  },
  mounted() {
    const { $store, mapName, addAction, $__loadGoogleSDKHelper } = this;
    const $input = this.$refs.searchField;

    // https://developers.google.com/places/supported_types#table3
    $__loadGoogleSDKHelper((google) => {
      const autoCompleteApi = new google.maps.places.Autocomplete($input);
      getInstance(google, mapName, (instance) => {
        autoCompleteApi.bindTo('bounds', instance.map);
        autoCompleteApi.addListener('place_changed', () => {
          const place = autoCompleteApi.getPlace();
          if (!place.address_components) { return; }
          $store.dispatch(addAction, place);
        });
      });
    });
  }
};
