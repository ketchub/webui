import VueRouter from 'vue-router';

export default function ( Vue ) {
  const router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: Vue.extend({template: '#pages_home'})
      },
      {
        path: '/get-started',
        component: Vue.extend({template:'#pages_get-started'})
      },
      {
        path: '/how-it-works',
        component: Vue.extend({template:'#pages_how-it-works'})
      },
      {
        path: '/about-us',
        component: Vue.extend({template:'#pages_about-us'})
      },
      {
        path: '/safety',
        component: Vue.extend({template:'#pages_safety'})
      },
      {
        path: '/contact',
        component: Vue.extend({template:'#pages_contact'})
      },
    ]
  });

  router.beforeEach((to, from, next) => {
    if (router.app.toggleDocumentClass) {
      router.app.toggleDocumentClass('nav-open');
    }
    next();
  });

  return router;
}
