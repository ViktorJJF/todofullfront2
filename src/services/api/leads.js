import axios from "axios";
import store from "@/store";
export default {
  list(query = { sort: "createdAt", order: "1" }) {
    if (query.telefonoId === null) query.telefonoId = "";
    if (query.pais) {
      //filtro pais
      let filterCountries = "";
      for (const paisIndex of query.pais) {
        filterCountries += "pais=" + store.state.countries[paisIndex] + "&";
      }
      return axios.get("/api/leads?" + filterCountries, { params: query });
    }
    return axios.get("/api/leads", { params: query });
  },
  listAll(query = { sort: "createdAt", order: "1" }) {
    if (query.telefonoId === null) query.telefonoId = "";
    if (query.pais) {
      //filtro pais
      let filterCountries = "";
      for (const paisIndex of query.pais) {
        filterCountries += "pais=" + store.state.countries[paisIndex] + "&";
      }
      return axios.get("/api/leads/all?" + filterCountries, { params: query });
    }
    return axios.get("/api/leads/all", { params: query });
  },
  listOne(id) {
    return axios.get("/api/leads/" + id);
  },
  update(id, payload) {
    return axios.put(`/api/leads/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/leads", payload);
  },
  delete(id) {
    return axios.delete(`/api/leads/${id}`);
  },
};
