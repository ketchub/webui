import { each } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import bindings from '@/bootstrap/bindings';
import makeRouter from '@/router';

bindings((registry) => {
  each(registry.plugins(), ( plugin ) => { Vue.use(plugin); });
  each(registry.mixins(), ( mixin ) => { Vue.mixin(mixin); });
  each(registry.components(), ( makeComponentFunc ) => {
    makeComponentFunc( Vue );
  });

  // Instantiate the application
  new Vue({
    el: '#application',
    router: makeRouter(Vue),
    store: new Vuex.Store({
      modules: registry.modules(),
      strict: true
    }),
    vuex: {
      actions: registry.actions(),
      getters: registry.getters()
    }
  });
});
