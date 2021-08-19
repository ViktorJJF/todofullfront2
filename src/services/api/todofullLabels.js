import axios from "axios";
export default {
  list(query) {
    if (query && !query.sort && !query.order) {
      (query.sort = "createdAt"), (query.order = "desc");
    }
    return axios.get("/api/todofull-labels", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/todofull-labels/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/todofull-labels", payload);
  },
  delete(id) {
    return axios.delete(`/api/todofull-labels/${id}`);
  },
};
