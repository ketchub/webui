const config = require(`../../../config/${process.env.NODE_ENV}`);

export default {
  install( Vue ) {
    Vue.prototype.$apiService = {

      get(route, queryParams, done) {
        this._fetchThen(fetch(fullyQualified(route), {
          method: 'GET'
        }), done);
      },

      post(route, payload, done) {
        this._fetchThen(fetch(fullyQualified(route), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }), done);
      },

      // put() {}, // implement once needed
      // delete() {}, // implement once needed

      _fetchThen(fetchPromise, done) {
        fetchPromise
          .then((resp) => { return resp.json(); })
          .then((resp) => {
            if (resp.error) {
              // push to store
              return done(resp.error);
            }
            done(null, resp);
          });
      }
    };
  }
};

function fullyQualified(route) {
  return config.API_ENDPOINT + route;
}

/**
 * This does some stuff to make sending query parameters easier;
 * specifically be accepting a 'query' key with an object and further
 * {key:value} in the options argument. Note - we DO NOT mutate whatever
 * other values are passed into the options, as 'query' will just be ignored.
 * @return {promise} Return of fetch invocation.
 */
function _fetch() {
  const fetch = window['fetch'];
  const args = Array.prototype.slice.call(arguments);
  args[0] = `${config.API_ENDPOINT}${args[0]}`;
  if (args[1] && args[1].query) {
    args[0] = `${args[0]}?${queryParams(args[1].query)}`;
  }
  return fetch.apply(null, args);
}

/**
 * Turn a flat map of {key:value} pairs into a query string.
 * @param  {Object} params Key:values
 * @return {string}        a=b&c=d...
 */
function queryParams( params ) {
  return Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
}
