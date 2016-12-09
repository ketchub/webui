import { get } from 'lodash';

export default [
  {
    beforeEnter,
    path: '/',
    name: 'Home',
    component: doKeepAlive({template: '#pages_home'}),
    meta: {
      bodyClass: 'home'
    }
  },
  {
    beforeEnter,
    path: '/get-started',
    name: 'Get Started',
    component: noKeepAlive({template:'#pages_get-started'})
  },
  {
    beforeEnter,
    path: '/how-it-works',
    name: 'How It Works',
    component: noKeepAlive({template:'#pages_how-it-works'})
  },
  {
    beforeEnter,
    path: '/about-us',
    name: 'About Us',
    component: noKeepAlive({template:'#pages_about-us'})
  },
  {
    beforeEnter,
    path: '/safety',
    name: 'Safety',
    component: noKeepAlive({template:'#pages_safety'})
  },
  {
    beforeEnter,
    path: '/contact',
    name: 'Contact',
    component: noKeepAlive({template:'#pages_contact'})
  }
  // ,{
  //   beforeEnter,
  //   path: '/*',
  //   name: 'Anonz',
  //   component: (resolve, reject) => {
  //     console.log('dynamic route matched');
  //     setTimeout(() => {
  //       resolve(noKeepAlive({
  //         template: '<div>resolved each time</div>'
  //       }));
  //     }, 1000);
  //   }
  // }
];

/**
 * In order to allow keep-alive to work on the components, we have to provide
 * a name that the keep-alive directive can match on. If a name isn't provided,
 * <router-view /> will render it as an Anonymous component, which the
 * keep-alive directive will NOT work against (eg, it'll try to keep Anonymous
 * components alive). So we ALWAYS, for top-level pages, want to ensure that
 * a component is given a name.
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function doKeepAlive(options) {
  return Object.assign(options, {name: 'doKeepAlive'});
}

/**
 * See above.
 */
function noKeepAlive(options) {
  return Object.assign(options, {name: 'noKeepAlive'});
}

/**
 * Pass this in as the beforeEnter parameter to INDIVIDUAL routes that
 * act as top level pages.
 */
function beforeEnter(to, from, next) {
  const bodyClass = get(to, 'meta.bodyClass', null);
  document.body.className = bodyClass ? `page-${bodyClass}` : 'page-default';
  next();
}