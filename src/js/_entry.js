import { each } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import bindings from '@/bootstrap/bindings';

bindings((registry) => {
  each(registry.plugins(), ( plugin ) => { Vue.use(plugin); });
  each(registry.mixins(), ( mixin ) => { Vue.mixin(mixin); });
  each(registry.components(), ( makeComponentFunc ) => {
    makeComponentFunc( Vue );
  });

  // Instantiate the application
  new Vue({
    el: '#application',
    router: new VueRouter({
      mode: 'history',
      routes: [{
        path: '/',
        component: Vue.extend({template: '#pages_home'})
      }]
    }),
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

// import BootstrapVue from '@/bootstrap/vue';
// import VueRouter from 'vue-router';
//
// const routes = [];
//
// routes.push({
//   path: '/',
//   component: BootstrapVue.extend({template: '#pages_home'})
// });
//
// routes.push({
//   path: '/get-started',
//   component: BootstrapVue.extend({template:'#pages_get-started'})
// });
//
// routes.push({
//   path: '/how-it-works',
//   component: BootstrapVue.extend({template:'#pages_how-it-works'})
// });
//
// routes.push({
//   path: '/about-us',
//   component: BootstrapVue.extend({template:'#pages_about-us'})
// });
//
// routes.push({
//   path: '/safety',
//   component: BootstrapVue.extend({template:'#pages_safety'})
// });
//
// routes.push({
//   path: '/contact',
//   component: BootstrapVue.extend({template:'#pages_contact'})
// });
//
// // routes.push({
// //   path: '/login/:id?',
// //   component: { template: '#login' }
// // });
//
// const router = new VueRouter({
//   mode: 'history',
//   routes
// });
//
// router.beforeEach((to, from, next) => {
//   if (router.app.toggleDocumentClass) {
//     router.app.toggleDocumentClass('nav-open');
//   }
//   next();
// });
//
// // Initialize the app
// new BootstrapVue({ router }).$mount('#application');
