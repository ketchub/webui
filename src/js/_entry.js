import { each } from 'lodash';
import Vue from 'vue';
import { Store } from 'vuex';
import makeRouter from '@/router';
import * as components from '@/components';
import * as mixins from '@/mixins';
import * as plugins from '@/plugins';
import * as modules from '@/modules';

export default getApp;

console.log(
  `ENVIRONMENT=%s; RUNTIME=%s`, process.env.NODE_ENV, process.title
);

each(components, ( definition, name ) => { Vue.component(name, definition); });
each(plugins, ( plugin ) => { Vue.use(plugin); });
each(mixins, ( mixin ) => { Vue.mixin(mixin); });

function getApp() {
  return new Vue({
    router: makeRouter(Vue),
    store: new Store({
      modules,
      strict: process.env.NODE_ENV !== 'production'
    })
  });
}

// Initialize the application if the #application node exists
if (process.env.NODE_ENV !== 'test' && document.querySelector('#application')) {
  getApp().$mount('#application');
}
