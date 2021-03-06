import getGoogleSdk from '@/support/getGoogleSdk';
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
    unsetAction: {
      type: String,
      required: true
    },
    valueGetter: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false
    }
  },
  computed: {
    valueObj() {
      return this.$store.getters[this.valueGetter];
    },
    formattedValue() {
      return this.valueObj ? this.valueObj.formatted_address : null;
    }
  },
  methods: {
    unset(actionName) {
      this.$store.dispatch(this.unsetAction);
      this.$refs.searchField.value = null;
    }
  },
  mounted() {
    const { $store, mapName, addAction } = this;
    const $input = this.$refs.searchField;

    getGoogleSdk((err, google) => {
      if (err) { /* @todo */ }
      const autoComplete = new google.maps.places.Autocomplete($input);

      getInstance(mapName, (err, map) => {
        if (err) { /* @todo */ }
        autoComplete.bindTo('bounds', map);
        autoComplete.addListener('place_changed', () => {
          const place = autoComplete.getPlace();
          if (!place.address_components || !place.geometry) {
            return alert('Details unavailable for this location!');
          }
          $store.dispatch(addAction, place);
        });
      });
    });
  }
};
