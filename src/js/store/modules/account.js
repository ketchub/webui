// import { isBoolean } from 'lodash';
const SET_TOKEN = 'SET_TOKEN';
const SET_INFO = 'SET_INFO';
const SET_RIDE_HISTORY = 'SET_RIDE_HISTORY';
const DO_LOGOUT = 'DO_LOGOUT';

const moduleAccount = {
  state: {
    _token: null,
    _info: {},
    _rideHistory: [],
  },

  mutations: {
    [SET_TOKEN](state, value) {
      state._token = value;
    },
    [SET_INFO](state, value) {
      state._info = value;
    },
    [SET_RIDE_HISTORY](state, value) {
      state._rideHistory = value;
    },
    [DO_LOGOUT](state) {
      state._token = null;
      state._info = {};
      state._rideHistory = [];
    }
  },

  actions: {
    [`ACCOUNT.SET_TOKEN`]({commit}, value) {
      commit(SET_TOKEN, value);
    },
    ['ACCOUNT.SET_INFO']({commit}, value) {
      commit(SET_INFO, value);
    },
    ['ACCOUNT.SET_RIDE_HISTORY']({commit}, value) {
      commit(SET_RIDE_HISTORY, value);
    },
    ['ACCOUNT.DO_LOGOUT']({commit}) {
      commit(DO_LOGOUT);
    }
  },

  getters: {
    accountIsLoggedIn(state) {
      return state._token ? true : false;
    },
    accountToken(state) {
      return state._token;
    },
    accountInfo(state) {
      return state._info;
    },
    accountRideHistory(state) {
      return state._rideHistory;
    }
  }
};

export default moduleAccount;
