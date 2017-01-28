import { noop } from 'lodash';
import fetch from '@/support/fetch';

export default { Api, install };

let Vue; // bind on install (this is how the Vue core team does it)

function install(_Vue) {
  if (Vue) { return console.error('[ketchApi] already installed.'); }
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      const options = this.$options;
      if (options.ketchApi) {
        this.$ketchApi = options.ketchApi;
        return;
      }
      if (options.parent && options.parent.$ketchApi) {
        this.$ketchApi = options.parent.$ketchApi;
      }
    }
  });
}

/**
 * Initialized once and injected into all vue instances.
 * @param {store} store Vuex store instance.
 */
function Api( store ) {
  // On init, if store has an account token, pass to fetch
  if (store.getters.accountToken) {
    fetch.setAuthorizationToken(store.getters.accountToken);
  }

  // Watch store for changes to the account token, and pass to fetch on change
  store.watch(state => state.account._token, (newVal) => {
    fetch.setAuthorizationToken(newVal ? newVal : null);
  });

  return {
    account: {
      get() {
        fetch.get('/account', (err, resp) => {
          if (err) { return alert(err); }
          store.dispatch('ACCOUNT.SET_INFO', resp);
        });
      },
      authLocal( payload, done = noop ) {
        fetch.post('/auth/local', payload, (err, resp) => {
          if (err) { return alert(err); }
          store.dispatch('ACCOUNT.SET_TOKEN', resp.token);
          done(err, resp);
        });
      },
      create( payload, done = noop ) {
        fetch.post('/account', payload, (err, resp) => {
          if (err) { return alert(err); }
          store.dispatch('ACCOUNT.SET_TOKEN', resp.token);
          done(err, resp);
        });
      },
      verifyPhoneRequest( done = noop ) {
        fetch.get('/account/verify-phone-request', (err, resp) => {
          if (err) { return alert(err); }
          console.log(resp);
          done(err, resp);
        });
      }
    },

    rides: {
      list( query, done = noop ) {
        fetch.get('/trips/list', query, (err, resp) => {
          if (err) { return alert(err); }
          done(err, resp);
        });
      },
      search( payload, done = noop ) {
        fetch.post('/trips/search', payload, (err, resp) => {
          if (err) { return alert(err); }
          store.dispatch('SEARCH.SET_RESULTS', resp.results);
          done(err, resp);
        });
      },
      add( payload, done = noop ) {
        fetch.post('/trips/add', payload, (err, resp) => {
          if (err) { return alert(err); }
          console.log('ride added');
          // @todo: dispatch something to the store?
          done(err, resp);
        });
      }
    }
  };
}
