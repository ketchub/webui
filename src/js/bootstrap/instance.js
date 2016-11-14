import { each } from 'lodash';
import Vue from 'vue';
import { Store } from 'vuex';
import makeRouter from '@/router';
import * as components from '@/components';
import * as mixins from '@/mixins';
import * as plugins from '@/plugins';
import * as modules from '@/modules';

each(components, ( definition, name ) => { Vue.component(name, definition); });
each(plugins, ( plugin ) => { Vue.use(plugin); });
each(mixins, ( mixin ) => { Vue.mixin(mixin); });

export default function getApp() {
  return new Vue({
    router: makeRouter(Vue),
    store: new Store({ modules })
  });
}
