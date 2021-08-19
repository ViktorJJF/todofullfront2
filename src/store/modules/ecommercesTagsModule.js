//usar esto para consultar en base de datos sin paginacion del server
import api from "@/services/api/ecommercesTags";
import { buildSuccess, handleError } from "@/utils/utils.js";

const module = {
  namespaced: true,
  state: {
    ecommercesTags: [],
  },
  actions: {
    list({ commit }, query) {
      return new Promise((resolve, reject) => {
        commit("loadingModule/showLoading", true, { root: true });
        api
          .list(query)
          .then((response) => {
            commit("list", response.data.payload);
            commit("loadingModule/showLoading", false, { root: true });
            resolve(response.data.payload);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    create({ commit }, data) {
      return new Promise((resolve, reject) => {
        api
          .create(data)
          .then((res) => {
            commit("loadingModule/showLoading", true, { root: true });
            buildSuccess("Registro guardado con éxito", commit);
            commit("create", res.data.payload);
            resolve(res.data.payload);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    update({ commit }, { id, data }) {
      return new Promise((resolve, reject) => {
        api
          .update(id, data)
          .then((res) => {
            commit("loadingModule/showLoading", true, { root: true });
            buildSuccess("Registro actualizado con éxito", commit);
            commit("update", {
              id,
              data: res.data.payload,
            });
            resolve(res.data.payload);
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
    delete({ commit }, id) {
      return new Promise((resolve, reject) => {
        api
          .delete(id)
          .then(() => {
            commit("loadingModule/showLoading", true, { root: true });
            buildSuccess("Registro eliminado con éxito", commit);
            commit("delete", id);
            resolve();
          })
          .catch((error) => {
            handleError(error, commit, reject);
          });
      });
    },
  },
  mutations: {
    list(state, data) {
      state.ecommercesTags = data;
    },
    create(state, data) {
      state.ecommercesTags.unshift(data);
    },
    update(state, { id, data }) {
      let indexToUpdate = state.ecommercesTags.findIndex(
        (member) => member._id == id
      );
      state.ecommercesTags.splice(indexToUpdate, 1, {
        ...data,
      });
    },
    delete(state, id) {
      let indexToDelete = state.ecommercesTags.findIndex(
        (member) => member._id == id
      );
      state.ecommercesTags.splice(indexToDelete, 1);
    },
  },
  getters: {},
};

export default module;
