import axios from "axios";
export default {
  updateEntityValue(payload) {
    return axios.put("/api/dialogflow-api/update-entity-value", payload);
  },
};
