import "babel-polyfill";
import "classlist-polyfill";
import Vue from "vue";
import axios from "./router/axios";
import VueAxios from "vue-axios";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import animate from "animate.css";
import Avue from "@smallwei/avue";
import "@smallwei/avue/lib/index.css";
import "./permission"; // 权限
import "./error"; // 日志
import router from "./router/router";
import store from "./store";
import i18n from './lang/';
import { language, messages } from './lang/';
import { loadStyle, downBlobFile, handleDataPermissions } from "@/util/util";
import { validatenull } from "@/util/validate";
import * as urls from "@/config/env";
import { iconfontUrl, iconfontVersion } from "@/config/env";
import * as filters from "./filters"; // 全局filter
import "./styles/common.scss";
import basicContainer from "./components/basic-container/main";
// 字典数据组件
// import DictResolver from '@/components/DictResolver'
// 字典标签组件
// import DictTag from '@/components/DictTag'

import './icons' // icon

import '/public/js/lib-flexable.js'

// 打包部署后清除浏览器 localStorage 缓存
const VUE_APP_VERSION = require('../package.json').version
const vers = window.localStorage.getItem('appVersion')
if(VUE_APP_VERSION != vers){
  localStorage.clear()
  window.localStorage.setItem('appVersion', VUE_APP_VERSION)
  location.reload()
}

// 挂载常用全局方法，import 引入
Vue.prototype.validatenull = validatenull;
Vue.prototype.downBlobFile = downBlobFile;
Vue.prototype.handleDataPermissions = handleDataPermissions;

Vue.prototype.$bus = new Vue()

// DictResolver.install()

window.axios = axios;
Vue.use(VueAxios, axios);

Vue.use(ElementUI, {
  size: "small",
  menuType: "text",
  locale: messages[language],
  i18n: (key, value) => i18n.t(key, value)
});

Vue.use(Avue, {
  size: "small",
  menuType: "text",
  locale: messages[language],
  i18n: (key, value) => i18n.t(key, value)
});

Vue.use(router);

Vue.use(animate);

// 注册全局容器
Vue.component("basicContainer", basicContainer);
// Vue.component('DictTag', DictTag)

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
});

//加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  console.log(iconfontUrl.replace("$key", ele));
  loadStyle(iconfontUrl.replace("$key", ele));
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

//设置主题为 DB2

document.body.className = "theme-iview";
