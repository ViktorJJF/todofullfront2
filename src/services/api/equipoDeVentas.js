import axios from "axios";
export default {
  list(query = { sort: "name", order: "1" }) {
    return axios.get("/api/equipos-de-ventas", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/equipos-de-ventas/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/equipos-de-ventas", payload);
  },
  delete(id) {
    return axios.delete(`/api/equipos-de-ventas/${id}`);
  },
};
