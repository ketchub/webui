import { Store } from 'vuex';
import * as modules from '@/store/modules';
import getConfig from '@/support/getConfig';
import modernizr from 'modernizr';

/**
 * Make this a function to return new store instances so they're easy to
 * recreate during testing.
 */
export default function() {
  const store = new Store({
    modules,
    strict: process.env.NODE_ENV !== 'production'
  });

  if ( getConfig('ENABLE_TRIP_LOCAL_STORAGE') && modernizr.localstorage ) {
    // Persist the trip data to local storage on change
    if (localStorage.getItem('ketch.trip')) {
      store.replaceState(Object.assign({}, store.state, {
        trip: JSON.parse(localStorage.getItem('ketch.trip'))
      }));
    }
    store.subscribe((mutation, state) => {
      localStorage.setItem('ketch.trip', JSON.stringify(state.trip));
    });
  }

  // Persist the login data to local storage on change
  // Currently we're operating under the assumption localStorage is available
  // no matter what; need a backup plan for this
  if (localStorage.getItem('ketch.account')) {
    store.replaceState(Object.assign({}, store.state, {
      account: JSON.parse(localStorage.getItem('ketch.account'))
    }));
  }
  store.subscribe((mutation, state) => {
    localStorage.setItem('ketch.account', JSON.stringify(state.account));
  });

  return store;
}
