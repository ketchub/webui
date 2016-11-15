import { filter } from 'lodash';

export default {
  template: '#components_address-display',
  props: ['addressObj'],
  computed: {
    numberAndStreet() {
      if (!this.addressObj) { return; }
      return `${this.streetNumber} ${this.streetName}`;
    },
    streetNumber() {
      if (!this.addressObj) { return; }
      let component = filter(this.addressObj.address_components, (obj) => {
        return !!filter(obj.types, (type) => {
          return type === 'street_number';
        }).length;
      })[0];
      return component && component.short_name;
    },
    streetName() {
      if (!this.addressObj) { return; }
      let component = filter(this.addressObj.address_components, (obj) => {
        return !!filter(obj.types, (type) => {
          return type === 'route';
        }).length;
      })[0];
      return component && component.short_name;
    },
    city() {
      if (!this.addressObj) { return; }
      let component = filter(this.addressObj.address_components, (obj) => {
        return !!filter(obj.types, (type) => {
          return type === 'locality';
        }).length;
      })[0];
      return component && component.short_name;
    },
    state() {
      if (!this.addressObj) { return; }
      let component = filter(this.addressObj.address_components, (obj) => {
        return !!filter(obj.types, (type) => {
          return type === 'administrative_area_level_1';
        }).length;
      })[0];
      return component && component.short_name;
    },
    postalCode() {
      if (!this.addressObj) { return; }
      let component = filter(this.addressObj.address_components, (obj) => {
        return !!filter(obj.types, (type) => {
          return type === 'postal_code';
        }).length;
      })[0];
      return component && component.short_name;
    }
  },
  mounted() {
    console.log('address display mounted');
  }
};
