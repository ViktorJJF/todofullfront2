import Vue from "vue";
import Vuex from "vuex";
//plugins
import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: modules,
  state: {
    itemsPerPage: 30,
    snackbar: {
      text: "",
      active: false,
      color: "success",
    },
    toolbar: {
      drawerIcon: null,
    },
    overlay: {
      active: false,
    },
    selectedTelefono: {
      numero: "",
      googleContactEmail: "",
      credenciales: {
        clientId: "",
        clientSecret: "",
        access_token: "",
        refresh_token: "",
        scope: "",
        token_type: "",
        id_token: "",
        expiry_date: "",
      },
      agenteId: "",
    },
    selectedCommentFacebook: {},
    countries: ["Peru", "Chile", "Colombia"],
    maxPaginationButtons: 16,
  },
  mutations: {
    showOverlay(state, active) {
      state.overlay.active = active;
    },
    setSelectedTelefono(state, payload) {
      state.selectedTelefono = payload;
    },
  },
  actions: {
    showOverlay({ commit }, active) {
      commit("showOverlay", active);
    },
  },
});
