import 'babel-polyfill';
import { each } from 'lodash';
import Vue from 'vue';
import { Store } from 'vuex';
import makeRouter from '@/router';
import * as components from '@/components';
import * as mixins from '@/mixins';
import * as plugins from '@/plugins';
import * as modules from '@/modules';
import * as filters from '@/filters';
import * as directives from '@/directives';
import fastClick from 'fastclick';

fastClick.attach(document.body);

export default getApp;

each(components, (definition, name) => { Vue.component(name, definition); });
each(filters, (definition, name) => { Vue.filter(name, definition); });
each(directives, (definition, name) => { Vue.directive(name, definition); });
each(plugins, (plugin) => { Vue.use(plugin); });
each(mixins, (mixin) => { Vue.mixin(mixin); });

const store = new Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
});

const router = makeRouter(Vue);

function getApp() {
  return new Vue({ store, router});
}

// Initialize the application if the #application node exists
if (process.env.NODE_ENV !== 'test') {
  each(document.querySelectorAll('[app-mount]'), (bindToNode) => {
    getApp().$mount(bindToNode);
  });
}

// Log build information to the console
console.log(
  `VERSION=%s; ENVIRONMENT=%s; RUNTIME=%s`,
  process.env.VERSION,
  process.env.NODE_ENV,
  process.title
);
