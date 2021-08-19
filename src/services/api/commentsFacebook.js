import axios from "axios";
export default {
  list(query = { sort: "createdAt", order: "0" }) {
    return axios.get("/api/comments-facebook", { params: query });
  },
  listOne(id) {
    return axios.get("/api/comments-facebook/" + id);
  },
  update(id, payload) {
    return axios.put(`/api/comments-facebook/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/comments-facebook", payload);
  },
  delete(id) {
    return axios.delete(`/api/comments-facebook/${id}`);
  },
};
