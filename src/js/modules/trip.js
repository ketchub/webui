const ADD_SEARCH_START = 'ADD_SEARCH_START';
const CLEAR_CURRENT_START = 'CLEAR_CURRENT_START';
const ADD_SEARCH_END = 'ADD_SEARCH_END';
const CLEAR_CURRENT_END = 'CLEAR_CURRENT_END';
const SET_DIRECTIONS = 'SET_DIRECTIONS';

const moduleTrip = {
  state: {
    searchStart: [],
    currentStart: null,
    searchEnd: [],
    currentEnd: null,
    directions: null
  },

  mutations: {
    [ADD_SEARCH_START]( state, payload ) {
      state.searchStart.push(payload);
      state.currentStart = state.searchStart.length - 1;
    },
    [ADD_SEARCH_END]( state, payload ) {
      state.searchEnd.push(payload);
      state.currentEnd = state.searchEnd.length - 1;
    },
    [CLEAR_CURRENT_START]( state, payload ) {
      state.currentStart = payload;
    },
    [CLEAR_CURRENT_END]( state, payload ) {
      state.currentEnd = payload;
    },
    [SET_DIRECTIONS]( state, payload ) {
      state.directions = payload;
    }
  },

  actions: {
    [`TRIP.ADD_SEARCH_START`]( {state, commit}, payload ) {
      commit(ADD_SEARCH_START, payload);
    },
    [`TRIP.ADD_SEARCH_END`]( {state, commit}, payload ) {
      commit(ADD_SEARCH_END, payload);
    },
    [`TRIP.CLEAR_CURRENT_START`]( {state, commit}, payload ) {
      commit(CLEAR_CURRENT_START, payload);
    },
    [`TRIP.CLEAR_CURRENT_END`]( {state, commit}, payload ) {
      commit(CLEAR_CURRENT_END, payload);
    },
    [`TRIP.SET_DIRECTIONS`]( {state, commit}, payload ) {
      commit(SET_DIRECTIONS, payload);
    }
  },

  getters: {
    $currentStart( state ) {
      return state.searchStart[state.currentStart];
    },
    $currentEnd( state ) {
      return state.searchEnd[state.currentEnd];
    },
    directionsDistance( state ) {
      if (state.directions && state.directions.routes) {
        return state.directions.routes[0].legs[0].distance;
      }
    }
  }
};

export default moduleTrip;
