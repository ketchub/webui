import { Store } from 'vuex';
import * as modules from '@/store/modules';
import getConfig from '@/support/getConfig';
import modernizr from 'modernizr';
import eventBus from '@/support/eventBus';

/**
 * Make this a function to return new store instances so they're easy to
 * recreate during testing.
 */
export default function () {
  const store = new Store({
    modules,
    strict: process.env.NODE_ENV !== 'production'
  });

  if (getConfig('ENABLE_TRIP_LOCAL_STORAGE') && modernizr.localstorage) {
    // Persist the trip data to local storage on change
    if (localStorage.getItem('ketch.trip')) {
      store.replaceState(Object.assign({}, store.state, {
        trip: JSON.parse(localStorage.getItem('ketch.trip'))
      }));
    }
    store.subscribe((mutation, state) => {
      // @todo: persist trip state in a more efficient way, this will
      // reserialize and update on EVERY store mutation (NOT JUST CHANGES
      // TO THE TRIP MODULE).
      localStorage.setItem('ketch.trip', JSON.stringify(state.trip));
    });
  }

  eventBus.$on('token:set', (token) => {
    store.commit('SET_TOKEN', token);
  });
  // Persist the login data to local storage on change
  // Currently we're operating under the assumption localStorage is available
  // no matter what; need a backup plan for this
  if (localStorage.getItem('ketch.account.token')) {
    eventBus.$emit('token:set', localStorage.getItem('ketch.account.token'));
    // store.commit('SET_TOKEN', localStorage.getItem('ketch.account.token'));
  }
  store.watch(state => state.account._token, (newVal) => {
    if (newVal) {
      return localStorage.setItem('ketch.account.token', newVal);
    }
    localStorage.removeItem('ketch.account.token');
  });

  return store;
}
