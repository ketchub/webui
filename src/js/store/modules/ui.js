import { isBoolean } from 'lodash';
const NAV_TOGGLE = 'NAV_TOGGLE';
const SET_MODAL_COMPONENT = 'SET_MODAL_COMPONENT';
const SET_PAGE_HOME_SEARCH_OVERLAY = 'SET_PAGE_HOME_SEARCH_OVERLAY';

const moduleUi = {
  state: {
    navOpen: false,
    modal: {
      componentName: null
    },
    pageHome: {
      searchOverlay: false
    }
  },

  mutations: {
    [NAV_TOGGLE]( state, value ) {
      state.navOpen = value;
    },
    [SET_MODAL_COMPONENT]( state, value ) {
      state.modal.componentName = value;
    },
    [SET_PAGE_HOME_SEARCH_OVERLAY]( state, value ) {
      state.pageHome.searchOverlay = value;
    }
  },

  actions: {
    [`UI.NAV_TOGGLE`]( {state, commit}, value ) {
      commit(NAV_TOGGLE, isBoolean(value) ? value : !state.navOpen);
    },
    [`UI.SET_MODAL_COMPONENT`]( {commit}, value ) {
      commit(SET_MODAL_COMPONENT, value);
    },
    [`UI.SET_PAGE_HOME_SEARCH_OVERLAY`]( {state, commit}, value ) {
      commit(SET_PAGE_HOME_SEARCH_OVERLAY, isBoolean(value) ? value : !state.pageHome.searchOverlay);
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
    },
    pageHomeSearchOverlay( state ) {
      return state.pageHome.searchOverlay;
    }
  }
};

export default moduleUi;
