import Vue from "vue";
import "./plugins/vuetify";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// Importing the global css file
import "@/assets/css/customStyles.css";

// styles
import "./styles/styles.scss";

//i18n
import i18n from "@/plugins/i18n";

//vee validate
import "./plugins/vee-validate";
//sweet alert
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
Vue.use(VueSweetalert2);

Vue.config.productionTip = false;

//plugins
import "@/plugins/deepCopy";
import "@/plugins/vee-validate";
import "@/plugins/axios";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import VuetifyConfirm from "vuetify-confirm";
Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: "Aceptar",
  buttonFalseText: "Cancelar",
  color: "error",
  icon: "mdi-alert-circle-outline",
  title: "Advertencia",
  width: 350,
  property: "$confirm",
  buttonTrueColor: "red lighten3",
  // buttonFalseColor: "yellow lighten3"
});

//mixins
Vue.mixin({
  computed: {
    console: () => console,
  },
});
//filters

new Vue({
  vuetify,
  router,
  store,
  i18n,
  created() {
    console.log(store.getters["authModule/isTokenSet"]);
    if (store.getters["authModule/isTokenSet"]) {
      store.dispatch("authModule/autoLogin");
    }
  },
  render: (h) => h(App),
}).$mount("#app");
