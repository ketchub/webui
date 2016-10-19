import { each } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
// import registry from '@/bootstrap/registry';
// import bindings from '@/bootstrap/bindings';

Vue.use(Vuex);
console.log('aww yea so dope dudez sdf mk mk2 again');

// let instance;
//
// export default function Runtime(){
//   if( instance ){ return instance; }
//
//   bindings(() => {
//     each(registry.plugins(), ( plugin ) => {
//       Vue.use(plugin);
//     });
//
//     instance = Vue.extend({
//       name:       'runtime',
//       mixins:     registry.mixins(),
//       partials:   registry.partials(),
//       store:      new Vuex.Store({
//         modules: registry.modules(),
//         strict: true
//       }),
//       vuex: {
//         actions: registry.actions(),
//         getters: registry.getters()
//       }
//     });
//
//     each(registry.components(), ( makeComponentFunc ) => {
//       makeComponentFunc( instance );
//     });
//   });
//
//   return instance;
// }
//
// Runtime.registry = registry;
