import Vue from "vue";
import deepcopy from "deepcopy";

const deepCopy = {
  install: (Vue) => {
    Vue.prototype.$deepCopy = (src) => {
      return deepcopy(src);
    };
  },
};

Vue.use(deepCopy);
