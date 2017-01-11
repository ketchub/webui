import { isBoolean } from 'lodash';
const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN';
const SET_TOKEN = 'SET_TOKEN';

const moduleAccount = {
  state: {
    _isLoggedIn: false,
    _token: null
  },

  mutations: {
    [SET_IS_LOGGED_IN]( state, value ) {
      state._isLoggedIn = value;
    },
    [SET_TOKEN]( state, value ) {
      state._token = value;
    }
  },

  actions: {
    [`ACCOUNT.SET_IS_LOGGED_IN`]( {commit}, value ) {
      commit(SET_IS_LOGGED_IN, value);
    },
    [`ACCOUNT.SET_TOKEN`]( {commit}, value ) {
      commit(SET_TOKEN, value);
    }
  },

  getters: {
    accountIsLoggedIn( state ) {
      return state._isLoggedIn;
    },
    accountToken( state ) {
      return state._token;
    }
  }
};

export default moduleAccount;
