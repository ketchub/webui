import { isBoolean } from 'lodash';
const NAV_TOGGLE = 'NAV_TOGGLE';

const moduleUi = {
  state: {
    navOpen: false
  },

  mutations: {
    [NAV_TOGGLE]( state, value ) {
      state.navOpen = value;
    }
  },

  actions: {
    [`UI.NAV_TOGGLE`]( {state, commit}, value ) {
      commit(NAV_TOGGLE, isBoolean(value) ? value : !state.navOpen);
    }
  },

  getters: {
    navStatus( state ) {
      return state.navOpen;
    }
  }
};

export default moduleUi;
