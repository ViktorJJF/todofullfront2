import axios from "axios";
export default {
  list(query = { sort: "nombre", order: "1" }) {
    return axios.get("/api/ecommerces-contacts", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/ecommerces-contacts/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/ecommerces-contacts", payload);
  },
  delete(id, payload) {
    return axios.delete(`/api/ecommerces-contacts/${id}`, { data: payload });
  },
};
