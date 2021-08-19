const namespaced = true;

const getters = {
  showErrorMessage: (state) => state.showErrorMessage,
  errorMessage: (state) => state.errorMessage,
};

const mutations = {
  error(state, payload) {
    if (payload === null) {
      state.showErrorMessage = false;
      state.errorMessage = null;
    } else {
      state.showErrorMessage = true;
      state.errorMessage = payload;
    }
  },
  showError(state, payload) {
    state.showErrorMessage = !!payload;
  },
};

const state = {
  showErrorMessage: false,
  errorMessage: null,
};

export default {
  namespaced,
  state,
  getters,
  mutations,
};
