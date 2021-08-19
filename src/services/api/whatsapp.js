import axios from "axios";
export default {
  restartWhatsapp() {
    return axios.post("http://todo-full.digital/api/restart-whatsapp");
  },
};
