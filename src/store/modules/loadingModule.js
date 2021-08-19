const namespaced = true;

const getters = {
  // showLoading: state => state.showLoading
};
const actions={
  showLoading({commit},value){
    commit("showLoading",value)
  }
};
const mutations = {
  showLoading(state, value = true) {
    state.loading = value;
  },
};

const state = {
  loading: false,
};

export default {
  actions,
  namespaced,
  state,
  getters,
  mutations,
};
