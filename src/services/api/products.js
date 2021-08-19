import axios from "axios";
export default {
  list(query = { sort: "name", order: "1" }) {
    return axios.get("/api/products", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/products/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/products", payload);
  },
  delete(id) {
    return axios.delete(`/api/products/${id}`);
  },
};
