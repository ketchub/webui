const ADD_SEARCH_START = 'ADD_SEARCH_START';
const SET_CURRENT_START = 'SET_CURRENT_START';
const ADD_SEARCH_END = 'ADD_SEARCH_END';
const SET_CURRENT_END = 'SET_CURRENT_END';

const moduleTrip = {
  state: {
    searchStart: [],
    currentStart: null,
    searchEnd: [],
    currentEnd: null
  },

  mutations: {
    [ADD_SEARCH_START]( state, payload ) {
      state.searchStart.push(payload);
    },
    [ADD_SEARCH_END]( state, payload ) {
      state.searchEnd.push(payload);
    },
    [SET_CURRENT_START]( state, payload ) {
      state.currentStart = payload;
    },
    [SET_CURRENT_END]( state, payload ) {
      state.currentEnd = payload;
    }
  },

  actions: {
    [`TRIP.ADD_SEARCH_START`]( {state, commit}, payload ) {
      commit(ADD_SEARCH_START, payload);
      commit(SET_CURRENT_START, payload);
    },
    [`TRIP.ADD_SEARCH_END`]( {state, commit}, payload ) {
      commit(ADD_SEARCH_END, payload);
      commit(SET_CURRENT_END, payload);
    },
    [`TRIP.SET_CURRENT_START`]( {state, commit}, payload ) {
      commit(SET_CURRENT_START, payload);
    },
    [`TRIP.SET_CURRENT_END`]( {state, commit}, payload ) {
      commit(SET_CURRENT_END, payload);
    }
  },

  getters: {
    latestStartSearch( state ) {
      return state.searchStart[state.searchStart.length - 1];
    },
    latestStartSearchFormatted( state, getters ) {
      if (getters.latestStartSearch) {
        return getters.latestStartSearch.formatted_address;
      }
    },
    latestEndSearch( state ) {
      return state.searchEnd[state.searchEnd.length - 1];
    },
    latestEndSearchFormatted( state, getters ) {
      if (getters.latestEndSearch) {
        return getters.latestEndSearch.formatted_address;
      }
    }
  }
};

export default moduleTrip;
