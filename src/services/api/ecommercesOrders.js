import axios from "axios";
export default {
  list(query = { sort: "nombre", order: "1" }) {
    return axios.get("/api/ecommerces-orders", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/ecommerces-orders/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/ecommerces-orders", payload);
  },
  delete(id, payload) {
    return axios.delete(`/api/ecommerces-orders/${id}`, { data: payload });
  },
};
