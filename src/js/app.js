import { each } from 'lodash';
import { consoleHelper } from '@/support/util';
import getApp from '@/support/bootstrap';

// Log build information to the console
consoleHelper.blue(
  `VERSION=${process.env.VERSION}; ENVIRONMENT=${process.env.NODE_ENV}; RUNTIME=${process.title}`
);

// Initialize application, if not in test mode
if (process.env.NODE_ENV !== 'test' && window && document) {
  /**
   * Loop through all elements with the attribute 'app-mount', and
   * mount a new instance (but with the same $store and router bindings!)
   * against the node.
   */
  each(document.querySelectorAll('[app-mount]'), (bindToNode) => {
    getApp(bindToNode);
  });

  /**
   * Append document class indicating if app is in standalone mode (ie. a web
   * app on a user's homescreen, loaded in full screen mode)
   */
  document.documentElement.classList.add(
    `app-standalone-${navigator.standalone ? 'true' : 'false'}`
  );

  /**
   * Setup listeners for online/offline change events, which swaps the
   * 'app-online' class on or off the document.
   */
  window.addEventListener('online', networkStatusHandler);
  window.addEventListener('offline', networkStatusHandler);
  networkStatusHandler();
}


/**
 * Toggle the app-online class on or off, when applicable.
 */
function networkStatusHandler() {
  document.documentElement.classList.toggle('app-online', navigator.onLine);
}
