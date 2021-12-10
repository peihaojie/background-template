/*
 * @Date         : 2021-12-10 08:45:32
 * @LastEditors  : HaoJie
 * @LastEditTime : 2021-12-10 14:54:25
 * @FilePath     : \src\main.js
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/utils/initCss";
import ElementUI from "@/utils/initElement";
import components from "@/components/init";

Vue.config.productionTip = false;

components.forEach((component) => {
  Vue.component(component.name, component);
});
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
