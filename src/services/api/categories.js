import axios from "axios";
export default {
  list(query = { sort: "name", order: "1" }) {
    return axios.get("/api/categories", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/categories/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/categories", payload);
  },
  delete(id) {
    return axios.delete(`/api/categories/${id}`);
  },
};
