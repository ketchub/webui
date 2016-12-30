import { isBoolean } from 'lodash';
const NAV_TOGGLE = 'NAV_TOGGLE';
const SET_MODAL_COMPONENT = 'SET_MODAL_COMPONENT';

const moduleUi = {
  state: {
    navOpen: false,
    modal: {
      componentName: null
    }
  },

  mutations: {
    [NAV_TOGGLE]( state, value ) {
      state.navOpen = value;
    },
    [SET_MODAL_COMPONENT]( state, value ) {
      state.modal.componentName = value;
    }
  },

  actions: {
    [`UI.NAV_TOGGLE`]( {state, commit}, value ) {
      commit(NAV_TOGGLE, isBoolean(value) ? value : !state.navOpen);
    },
    [`UI.SET_MODAL_COMPONENT`]( {commit}, value ) {
      commit(SET_MODAL_COMPONENT, value);
    }
  },

  getters: {
    navStatus( state ) {
      return state.navOpen;
    },
    modalComponentName( state ) {
      return state.modal.componentName;
    },
    modalStatus( state ) { // derived from state data
      return !!state.modal.componentName;
    }
  }
};

export default moduleUi;
