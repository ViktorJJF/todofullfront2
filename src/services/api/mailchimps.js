import axios from "axios";
export default {
  list(params) {
    return axios.get("/api/mailchimps", { params });
  },
  update(id, payload) {
    return axios.put(`/api/mailchimps/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/mailchimps", payload);
  },
  delete(id) {
    return axios.delete(`/api/mailchimps/${id}`);
  },
};
