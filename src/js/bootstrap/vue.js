import { each } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import registry from '@/bootstrap/registry';
import bindings from '@/bootstrap/bindings';

let instance;

bindings(() => {
  each(registry.plugins(), ( plugin ) => {
    Vue.use(plugin);
  });

  instance = Vue.extend({
    name: 'runtime',
    mixins: registry.mixins(),
    store: new Vuex.Store({
      modules: registry.modules(),
      strict: true
    }),
    vuex: {
      actions: registry.actions(),
      getters: registry.getters()
    }
  });

  each(registry.components(), ( makeComponentFunc ) => {
    makeComponentFunc( instance );
  });
});

export default instance;
