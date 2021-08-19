import axios from "axios";
export default {
  list(query = { sort: "createdAt", order: "1" }) {
    if (query.telefonoId === null) query.telefonoId = "";
    return axios.get("/api/woocommerces", { params: query });
  },
  listOne(id) {
    return axios.get("/api/woocommerces/" + id);
  },
  update(id, payload) {
    return axios.put(`/api/woocommerces/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/woocommerces", payload);
  },
  delete(id) {
    return axios.delete(`/api/woocommerces/${id}`);
  },
};
