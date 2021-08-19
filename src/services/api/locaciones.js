import axios from "axios";
export default {
  list(query = { sort: "name", order: "1" }) {
    return axios.get("/api/locaciones", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/locaciones/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/locaciones", payload);
  },
  delete(id) {
    return axios.delete(`/api/locaciones/${id}`);
  },
};
