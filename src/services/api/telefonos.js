import axios from "axios";
export default {
  list(query = { sort: "name", order: "1" }) {
    return axios.get("/api/telefonos", { params: query });
  },
  listOne(id) {
    return axios.get("/api/telefonos/" + id);
  },
  update(id, payload) {
    return axios.put(`/api/telefonos/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/telefonos", payload);
  },
  delete(id) {
    return axios.delete(`/api/telefonos/${id}`);
  },
};
