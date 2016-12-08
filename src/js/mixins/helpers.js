import { get } from 'lodash';
import Modernizr from 'modernizr';
const config = require(`../../../config/${process.env.NODE_ENV}`);
const loadScriptsPromises = {};
const navToggleClass = 'nav-open';


/**
 * Just to maintain some semblance of convention (and since these methods
 * are injected into the global Vue instance), prefix follow the naming
 * convention "$__{methodName}Helper". Its verbose but effective.
 */
export default {
  methods: {
    $__configHelper(query, defaultValue) {
      return get(config, query, defaultValue);
    },

    $__toggleNavHelper(to) {
      this.$store.dispatch('UI.NAV_TOGGLE', to);
    },

    $__loadScriptHelper(url, callback) {
      if (!loadScriptsPromises[url]){
        loadScriptsPromises[url] = new Promise((resolve, reject) => {
          let script  = document.createElement('script');
          script.type = 'text/javascript';
          script.src  = url;
          script.onreadystatechange = script.onload = resolve;
          document.querySelector('head').appendChild(script);
        });
      }
      loadScriptsPromises[url].then(callback);
    },

    $__loadGoogleSDKHelper( done ) {
      if (window['google']) { return done(window['google']); }
      const { $__configHelper, $__loadScriptHelper } = this;
      const apiKey = $__configHelper('GOOGLE_MAPS_API_KEY');
			const scriptUrl = `//maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
      $__loadScriptHelper(scriptUrl, () => { done(window['google']); });
    }
  }
};
