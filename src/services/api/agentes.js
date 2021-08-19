import axios from "axios";
export default {
  list(query = { sort: "name", order: "1" }) {
    return axios.get("/api/agentes", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/agentes/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/agentes", payload);
  },
  delete(id) {
    return axios.delete(`/api/agentes/${id}`);
  },
};
