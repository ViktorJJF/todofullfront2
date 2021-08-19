import axios from "axios";
export default {
  list(query = { sort: "createdAt", order: "-1" }) {
    return axios.get("/api/comments-without-responses", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/comments-without-responses/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/comments-without-responses", payload);
  },
  delete(id) {
    return axios.delete(`/api/comments-without-responses/${id}`);
  },
};
