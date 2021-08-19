import axios from "axios";
export default {
  list(query = { sort: "nombre", order: "1" }) {
    return axios.get("/api/ecommerces-attributes", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/ecommerces-attributes/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/ecommerces-attributes", payload);
  },
  delete(id, payload) {
    return axios.delete(`/api/ecommerces-attributes/${id}`, { data: payload });
  },
};
