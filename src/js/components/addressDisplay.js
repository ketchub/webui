import { filter } from 'lodash';

export default {
  template: '#components_address-display',
  props: ['addressObj'],
  filters: {
    pluckBy(addressObj, type) {
      if (!addressObj || !addressObj.address_components) { return; }
      const component = filter(addressObj.address_components, (comp) => {
        return !!filter(comp.types, (_type) => { return _type === type; }).length;
      })[0];
      return component && component.short_name;
    }
  }
};
