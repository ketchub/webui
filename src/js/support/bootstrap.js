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
import * as appmounts from '@/appmounts';
import getGoogleSdk from '@/support/getGoogleSdk';

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

const scripts = new Promise((resolve, reject) => {
  getGoogleSdk((err, _google) => {
    if (err) { return reject(err); }
    resolve(_google);
  });
});

export default function getApp(node) {
  scripts.then(($google) => {
    /*eslint-disable no-new */
    new Application(Object.assign(
      {
        el: node,
        provide: {
          $google
        }
      },
      // This is a mechanism by which we can extend only *specific* instances
      // that are mounted to nodes with the 'app-mount="..."' attribute. If the
      // attribute does have a value, we try and look for the matching name
      // exported from the appmounts directory and load that.
      appmounts[node.getAttribute('app-mount')] || {}
    ));
  });
}
