import axios from "axios";
export default {
  list(query) {
    console.log("el query: ", query);
    return axios.get("/api/facebook-labels", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/facebook-labels/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/facebook-labels", payload);
  },
  delete(id) {
    return axios.delete(`/api/facebook-labels/${id}`);
  },
};
