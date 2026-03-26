import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import datav from "@jiaminghi/data-view";
import "./styles/global.less";
import "./styles/element-override.less";

Vue.use(ElementUI);
Vue.use(datav);

// 开发环境下启用 Mock
if (
  process.env.NODE_ENV === "development" &&
  process.env.VUE_APP_USE_MOCK === "true"
) {
  require("./mock");
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
