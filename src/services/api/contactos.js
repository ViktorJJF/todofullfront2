import axios from "axios";
export default {
  list(query = { sort: "nombre", order: "1" }) {
    return axios.get("/api/contactos", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/contactos/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/contactos", payload);
  },
  delete(id, payload) {
    return axios.delete(`/api/contactos/${id}`, { data: payload });
  },
};
