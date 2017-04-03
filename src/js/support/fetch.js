import { isFunction } from 'lodash';
const config = require(`../../../config/${process.env.NODE_ENV}`);
export default { get, post, put, setAuthorizationToken };

let _authorizationToken;

function get(route, query, done) {
  if (isFunction(query)) {
    done = query;
    query = {};
  }
  const _route  = _fullyQualified(route);
  _fetchThen(_fetch(_route, {
    query,
    method: 'GET',
    headers: _headers()
  }), done);
}

function post(route, payload, done) {
  _fetchThen(_fetch(_fullyQualified(route), {
    method: 'POST',
    headers: _headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  }), done);
}

function put(route, payload, done) {
  _fetchThen(_fetch(_fullyQualified(route), {
    method: 'PUT',
    headers: _headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  }), done);
}

// function delete() {}, // implement once needed

/**
 * Set the authorization token to a value, or nullify it.
 * @param {String|null} value Token value or null
 */
function setAuthorizationToken(value) {
  _authorizationToken = value ? value : null;
}

/**
 * Generate headers for the request (mainly whether to include the Authorization
 * token).
 * @param  {Object} [extra={}] Extra header parameters to merge.
 * @return {Object}
 */
function _headers(extra = {}) {
  return Object.assign(extra, _authorizationToken ? {
    'Authorization': `JWT ${_authorizationToken}`
  } : {});
}

/**
 * Wrap a promise with standard error handling and json parsing.
 * @param  {promise}  fetchPromise Promise from 'fetch'
 * @param  {Function} done         Callback
 * @return {void}
 */
function _fetchThen(fetchPromise, done) {
  fetchPromise
    .then((resp) => { return resp.json(); })
    .then((resp) => {
      // @todo: ensure "err" or "error" is standardized!
      if (resp.error || resp.err) {
        return done(resp.error || resp.err);
      }
      done(null, resp);
    })
    .catch((ex) => {
      console.log('Request failed at the fetch level: ', ex);
    });
}

/**
 * Append the API endpoint to queries.
 * @param  {string} route Route path
 * @return {string}       Fully qualified
 */
function _fullyQualified(route) {
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
  if (args[1] && args[1].query) {
    args[0] = `${args[0]}?${_queryParams(args[1].query)}`;
  }
  return fetch.apply(null, args);
}

/**
 * Turn a flat map of {key:value} pairs into a query string.
 * @param  {Object} params Key:values
 * @return {string}        a=b&c=d...
 */
function _queryParams(params) {
  return Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
}
