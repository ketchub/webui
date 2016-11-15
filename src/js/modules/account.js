const moduleAccount = {
  state: {
    balance: 0
  },

  mutations: {
    incrementBalance(state) {
      state.balance++;
    }
  },

  actions: {
    incrementBalance({ state, commit }) {
      commit('incrementBalance');
    }
  },

  getters: {
    accountBalance(state) {
      return state.balance;
    }
  }
};

export default moduleAccount;
