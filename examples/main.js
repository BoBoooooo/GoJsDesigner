import Vue from "vue";
import App from "./App.vue";
import GoJsDesigner from "../packages/index";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css"; // 白垩主题，此文件在node_modules下的elementui包内
// import GoJsDesigner from 'gojs-designer'
// import 'gojs-designer/lib/gojs-designer.css';

Vue.use(GoJsDesigner);
Vue.use(Element);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
