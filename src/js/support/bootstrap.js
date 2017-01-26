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
  const app = new Application({el: node});

  /**
   * This is a hack for the vue-router issue where it'll only update the route
   * on *the last app instance* created on the DOM :(. Note that app._route is
   * an ES5 getter/setter, so setting the _route on the instance in this way
   * seems to work fine...
   * @see https://github.com/vuejs/vue-router/issues/1102
   */
  router.afterEach((to, from) => {
    app._route = to;
  });

  return app;
}
