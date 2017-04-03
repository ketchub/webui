import { isBoolean } from 'lodash';
const NAV_TOGGLE = 'NAV_TOGGLE';
const SET_MODAL = 'SET_MODAL';
const SET_PAGE_HOME_RESULTS_VIEW = 'SET_PAGE_HOME_RESULTS_VIEW';

const moduleUi = {
  state: {
    navOpen: false,
    modal: {
      open: false,
      componentName: null,
      title: null
    },
    pageHome: {
      resultsView: false
    }
  },

  mutations: {
    [NAV_TOGGLE](state, value) {
      state.navOpen = value;
    },
    [SET_MODAL](state, value) {
      state.modal = value;
    },
    [SET_PAGE_HOME_RESULTS_VIEW](state, value) {
      state.pageHome.resultsView = value;
    }
  },

  actions: {
    [`UI.NAV_TOGGLE`]({state, commit}, value) {
      commit(NAV_TOGGLE, isBoolean(value) ? value : !state.navOpen);
    },
    [`UI.SET_MODAL`]({state, commit}, value) {
      commit(SET_MODAL, Object.assign({}, state.modal, value));
    },
    [`UI.SET_PAGE_HOME_RESULTS_VIEW`]({state, commit}, value) {
      commit(SET_PAGE_HOME_RESULTS_VIEW, 
        isBoolean(value) ? value : !state.pageHome.resultsView
      );
    }
  },

  getters: {
    navStatus(state) {
      return state.navOpen;
    },
    modalData(state) {
      return state.modal;
    },
    modalStatus(state) {
      return state.modal.open;
    },
    pageHomeResultsView(state) {
      return state.pageHome.resultsView;
    }
  }
};

export default moduleUi;
