import "babel-polyfill";
import Vue from "vue";
import element from "./element";
import {Message} from "element-ui";
import confirm from "@/components/dialog/confirm";

Vue.prototype.$message = Message; //添加全局信息提示
Vue.use(element);
Vue.use(confirm);
import App from "./App";
import router from "./router";
import store from "./store/";
// 'development',use package;'production':use cdn;
//import "element-ui/lib/theme-chalk/index.css";
//Vue.config.productionTip = false;

import "./components/iconSvg"; // iconSvg
import container from "./layout/container";
//全局注册container
Vue.component("container", container);

import "@/permission"; // permission control

// i18n国际化
import i18n from "@/lang";

//mock数据
//import "@/mockjs";

new Vue({
  router,
  store,
  i18n, // 便于可以直接在组件中通过this.$i18n使用，也可以按需引用
  render: h => h(App)
}).$mount("#app");
