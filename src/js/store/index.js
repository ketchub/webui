import { Store } from 'vuex';
import * as modules from '@/store/modules';

/**
 * Make this a function to return new store instances so they're easy to
 * recreate during testing.
 */
export default function( persistable = false ) {
  const store = new Store({
    modules,
    strict: process.env.NODE_ENV !== 'production'
  });

  if (localStorage.getItem('trip')) {
    store.replaceState(Object.assign({}, store.state, {
      trip: JSON.parse(localStorage.getItem('trip'))
    }));
  }

  if (persistable) {
    store.subscribe((mutation, state) => {
      localStorage.setItem('trip', JSON.stringify(state.trip));
    });
  }

  return store;
}
