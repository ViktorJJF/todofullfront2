import axios from "axios";
export default {
  list(query) {
    return axios.get("/api/mailchimp-contacts", { params: query });
  },
  update(id, payload) {
    return axios.put(`/api/mailchimp-contacts/${id}`, payload);
  },
  create(payload) {
    return axios.post("/api/mailchimp-contacts", payload);
  },
  delete(id) {
    return axios.delete(`/api/mailchimp-contacts/${id}`);
  },
};
