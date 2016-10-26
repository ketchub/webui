import BootstrapVue from '@/bootstrap/vue';
import VueRouter from 'vue-router';

const routes = [];

routes.push({
  path: '/',
  component: BootstrapVue.component('mapView')
});

// routes.push({
//   path: '/test',
//   component: BootstrapVue.component('otro')
// });

const app = new BootstrapVue({
  router: new VueRouter({
    mode: 'history',
    routes
  })
}).$mount('#application');
