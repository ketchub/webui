const moduleAccount = {
  state: {
    balance: 0
  },

  mutations: {
    incrementBalance(state) {
      console.log('mutation:incrementBalance', state);
      state.balance++;
    }
  },

  actions: {
    incrementBalance({ state, commit }) {
      console.log('action:incrementBalance', state);
      commit('incrementBalance');
    }
  },

  getters: {
    accountBalance(state) {
      console.log('getter:accountBalance', state);
      return state.balance;
    }
  }
};

export default moduleAccount;
