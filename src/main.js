import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

import BootstrapVue from "bootstrap-vue/dist/bootstrap-vue.esm";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL_API;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
