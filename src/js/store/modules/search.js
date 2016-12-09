const SET_RESULTS = 'SET_RESULTS';

const moduleSearch = {
  state: {
    _results: []
  },

  mutations: {
    [SET_RESULTS]( state, payload ) {
      state._results = payload;
    }
  },

  actions: {
    [`SEARCH.SET_RESULTS`]( {commit}, payload ) {
      commit(SET_RESULTS, payload);
    }
  },

  getters: {
    searchResults( state ) {
      return state._results;
    }
  }
};

export default moduleSearch;
