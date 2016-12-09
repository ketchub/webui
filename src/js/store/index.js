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
    if (localStorage.getItem('ketch.trip')) {
      store.replaceState(Object.assign({}, store.state, {
        trip: JSON.parse(localStorage.getItem('ketch.trip'))
      }));
    }
    store.subscribe((mutation, state) => {
      localStorage.setItem('ketch.trip', JSON.stringify(state.trip));
    });
  }

  return store;
}
