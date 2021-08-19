const namespaced = true;

const getters = {
  showSuccessMessage: (state) => state.successMessage,
  successMessage: (state) => state.successMessage,
  successMessageParams: (state) => state.successMessageParams,
  successMessageTimeout: (state) => state.successMessageTimeout,
};

const mutations = {
  success(state, msg) {
    if (msg === null) {
      state.showSuccessMessage = false;
      state.successMessage = null;
      state.successMessageParams = [];
    } else {
      state.showSuccessMessage = true;
      state.successMessageTimeout = 3000;
      // msg.timeout === 0 ? 0 : msg.timeout || 6000;
      state.successMessage = msg;
      // if (msg.params) {
      //   state.successMessageParams = payload.params;
      // }
    }
  },
  showSuccess(state, payload) {
    state.showSuccessMessage = !!payload;
  },
  // showSuccess(state, msg) {
  //   state.showSuccessMessage = true;
  //   state.successMessage = msg;
  // },
};

const state = {
  showSuccessMessage: false,
  successMessage: null,
  successMessageParams: [],
  successMessageTimeout: 0,
};

export default {
  namespaced,
  state,
  getters,
  mutations,
};
