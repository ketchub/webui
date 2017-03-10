import 'babel-polyfill';
import { each } from 'lodash';
import Vue from 'vue';
import * as components from '@/components';
import * as mixins from '@/mixins';
import * as plugins from '@/plugins';
import * as filters from '@/filters';
import * as directives from '@/directives';
import getStore from '@/store';
import router from '@/support/router';
import ketchApi from '@/plugins/ketchApi';

each(components, (definition, name) => { Vue.component(name, definition); });
each(filters, (definition, name) => { Vue.filter(name, definition); });
each(directives, (definition, name) => { Vue.directive(name, definition); });
each(plugins, (plugin) => { Vue.use(plugin); });
each(mixins, (mixin) => { Vue.mixin(mixin); });

const store = getStore();

const Application = Vue.extend({
  store,
  router,
  ketchApi: new ketchApi.Api(store)
});

export default function getApp(node) {
  return new Application({el: node});
}
