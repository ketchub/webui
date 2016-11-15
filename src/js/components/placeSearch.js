/**
 * @ref: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
 */
export default {
  template: '#components_place-search',
  props: ['map-obj', 'action', 'initial-value'],
  data() {
    return {
      value: this.initialValue || null
    };
  },
  mounted() {
    const { $store, action, mapObj, loadGoogleSDK } = this;
    const $input = this.$el.querySelector('input');

    loadGoogleSDK((google) => {
      const autoCompleteApi = new google.maps.places.Autocomplete($input);
      autoCompleteApi.bindTo('bounds', mapObj);

      autoCompleteApi.addListener('place_changed', () => {
        const place = autoCompleteApi.getPlace();
        $store.dispatch(action, place);

        // mapObj.setCenter(place.geometry.location);
        // mapObj.setZoom(17);
        //
        // const marker = makeMarker(google, mapObj);
        // marker.setIcon(/** @type {google.maps.Icon} */({
        //   url: place.icon,
        //   size: new google.maps.Size(71, 71),
        //   origin: new google.maps.Point(0, 0),
        //   anchor: new google.maps.Point(17, 34),
        //   scaledSize: new google.maps.Size(35, 35)
        // }));
        // marker.setPosition(place.geometry.location);
        // marker.setVisible(true);

      });
    });
  }
};

function makeMarker(google, map) {
  return new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29)
  });
}
