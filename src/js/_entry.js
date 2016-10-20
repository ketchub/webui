import { each } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
// import registry from '@/bootstrap/registry';
// import bindings from '@/bootstrap/bindings';

Vue.use(Vuex);

let gMapsApiKey = document.documentElement.getAttribute('gmaps-apikey');
loadScript(`//maps.googleapis.com/maps/api/js?key=${gMapsApiKey}`, () => {
  let google = window['google'];
  let map = new google.maps.Map(document.querySelector('[gmap]'), {
    center: {lat:-34, lng:150},
    zoom: 8
  });
});

function loadScript(url, callback) {
  let script  = document.createElement('script');
  script.type = 'text/javascript';
  script.src  = url;
  script.onreadystatechange = script.onload = callback;
  document.querySelector('head').appendChild(script);
}

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
