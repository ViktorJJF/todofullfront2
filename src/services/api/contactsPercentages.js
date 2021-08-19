import axios from "axios";
export default {
  list(query = { sort: "nombre", order: "1" }) {
    return axios.get("/api/contacts-percentages", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/contacts-percentages/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/contacts-percentages", payload);
  },
  delete(id) {
    return axios.delete(`/api/contacts-percentages/${id}`);
  },
};
