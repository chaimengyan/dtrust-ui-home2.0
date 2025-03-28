import axios from "axios";
import { serialize } from "@/util/util";
import NProgress from "nprogress"; // progress bar
import errorCode from "@/const/errorCode";
import { Message, MessageBox } from "element-ui";
import "nprogress/nprogress.css";
import qs from "qs";
import store from "@/store"; // progress bar style
import { isDev } from '@/util/env'

axios.defaults.baseURL = isDev() ? '/' : process.env.VUE_APP_BASE_URL
axios.defaults.timeout = 30000;

const successStatus = [200, 201]

// 返回其他状态吗
axios.defaults.validateStatus = function(status) {
  return status >= 200 && status <= 500; // 默认的
};
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});

// HTTPrequest拦截
axios.interceptors.request.use(
  config => {
    NProgress.start(); // start progress bar
    const isToken = (config.headers || {}).isToken === false;
    let token = store.getters.access_token;
    if (token && !isToken) {
      config.headers["Authorization"] = "Bearer " + token; // token
    }
    // headers中配置serialize为true开启序列化
    if (config.methods === "post" && config.headers.serialize) {
      config.data = serialize(config.data);
      delete config.data.serialize;
    }

    // 处理get 请求的数组 springmvc 可以处理
    if (config.method === "get") {
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// HTTPresponse拦截
axios.interceptors.response.use(
  res => {
    NProgress.done();
    const status = Number(res.status) || 200;
    const message = res.data.message || errorCode[status] || errorCode["default"];

    const serverStatus = ('status' in res.data) && res.data.status

    const errorMsg = function(res) {
        Message({
            message: message,
            type: "error"
        });
        return Promise.reject(res);
    }

    // 后台定义 424 针对令牌过去的特殊响应码
    if (status === 424) {
      MessageBox.alert("令牌状态已过期，请点击重新登录", "系统提示", {
        confirmButtonText: "重新登录",
        callback: action => {
            store.dispatch("LogOut").then(() => {
                // 刷新登录页面，避免多次弹框
                window.location.reload();
            });
          }
        })
      return;
    }

    if(status !== 200 || res.data.status == 204) {
      return errorMsg(res)
    } else {
      if (serverStatus && !successStatus.includes(serverStatus)) {
       return errorMsg()
      }
      return res;
    }

  },
  error => {
    NProgress.done();
    return Promise.reject(new Error(error));
  }
);

export default axios;
