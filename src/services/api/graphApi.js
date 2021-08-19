import axios from "axios";
export default {
  createLabel(payload) {
    return axios.post("/api/graph-api/labels", payload);
  },
  deleteLabel(id, fanpageId) {
    return axios.delete(`/api/graph-api/labels/${id}?fanpageId=${fanpageId}`);
  },
};
