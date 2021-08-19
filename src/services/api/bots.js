import axios from "axios";
export default {
  list(query = { sort: "createdAt", order: "1" }) {
    return axios.get("/api/bots", { params: query });
  },
  listOne(id) {
    return axios.get("/api/bots/" + id);
  },
  update(id, payload) {
    return axios.put(`/api/bots/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/bots", payload);
  },
  delete(id) {
    return axios.delete(`/api/bots/${id}`);
  },
};
