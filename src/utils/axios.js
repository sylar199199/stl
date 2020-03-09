import axios from "axios";
import {Message, MessageBox} from "element-ui";
import store from "../store";
import * as types from "@/store/types";
import {getToken} from "@/utils/auth";
//import {toJson} from "@/utils/mUtils";
import md5 from "blueimp-md5";
import JSEncrypt from "jsencrypt";
import {getStore} from "@/utils/mUtils";
// 创建axios实例
let service = axios.create({
  baseURL: process.env.VUE_APP_URL, // api的base_url
  timeout: 10000 // 请求超时时间
});
// request拦截器
service.interceptors.request.use(
  config => {
    let uid = getStore("uid") || 0;
    let timestamp = `${Date.parse(new Date())}`;
    let random = `${Math.random()}`.substring(2, 10);
    let password = process.env.VUE_APP_PASSWORD;
    let token = getToken("token");
    let decrypt = new JSEncrypt();
    decrypt.setPrivateKey(process.env.VUE_APP_RSA_PRIVATE_KEY);
    let uncrypted = decrypt.decrypt(token); //密文token
    let MD5Code = md5(`${uid}-${uncrypted}-${timestamp}-${password}-${random}`); //后台接口验证
    let locale = store.getters.currentLanguage === 1 ? "zh_CN" : "zh_TW"; //设置语言提示
    let apiPower = {
      //api接口验证
      timestamp,
      random,
      password,
      uid,
      MD5Code,
      locale
    };

    config.headers = Object.assign(config.headers, apiPower);
    if (config.method === "get" || config.method === "delete") {
      if (!config.params) {
        config.params = {};
      }
      config.params.langId = store.getters.currentLanguage; //设置语言的参数
      config.params.uid = uid; //设置uid的参数
    }

    if (config.method === "post" || config.method === "put") {
      //POST传参序列化
      // let ret = "";
      // for (let it in config.data) {
      //   ret += encodeURIComponent(it) + "=" + encodeURIComponent(config.data[it]) + "&";
      // }
      if (!config.data) {
        config.data = {};
      }
      config.data.langId = store.getters.currentLanguage; //设置语言的参数
      config.data.uid = uid; //设置uid的参数
      //config.data = Qs.stringify(config.data);
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code:0,接口正常返回;
     */

    const res = response.data;
    let subCode = res.subCode;
    if (res.code === 0) {
      if (subCode.substring(subCode.length - 1, subCode.length) !== "0") {
        //最后一位是0表示成功查询
        return Promise.reject(res);
      }
      //let bodyMessage = toJson(res.bodyMessage);
      return res.bodyMessage;
    } else {
      if (subCode === "00010") {
        //判断是否登录失效
        store.commit(types.SET_LOGIN_CLEAR);
        store.commit(types.SET_LOGIN_DIALOG_VISIBLE, true);
        //window.location.reload(); //刷新重新加载未登录数据
      }
      return Promise.reject(res);
    }
  },
  error => {
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
