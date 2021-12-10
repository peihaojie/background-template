/*
 * @Date         : 2021-12-10 08:50:06
 * @LastEditors  : HaoJie
 * @LastEditTime : 2021-12-10 14:55:05
 * @FilePath     : \src\index.js
 */
import "@/utils/initCss";
import components from "@/components/init";
import ElementUI from "@/utils/initElement";

const install = function (Vue) {
  Vue.use(ElementUI);

  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ...components,
};
