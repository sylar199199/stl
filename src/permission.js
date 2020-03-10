import router from "./router";
import store from "./store";
import * as types from "@/store/types";
import NProgress from "nprogress"; // Progress 进度条
process.env.NODE_ENV === "development" && import("nprogress/nprogress.css");
import {getToken, setToken} from "@/utils/auth"; // 验权(从cookie中获取)
import {getUserInfo} from "@/api/user";
import {asyncRouterMap} from "@/router";
import {setLabelTitle, setStore, getStore} from "@/utils/mUtils";

router.beforeEach((to, from, next) => {
  NProgress.start();
  // 设置浏览器头部标题
  const browserHeaderTitle = to.meta.title;
  if (browserHeaderTitle) {
    setLabelTitle(browserHeaderTitle);
  }
  store.commit(types.SET_ROUTER_PREV, from.name); //记录上一页地址
  store.commit(types.USER_SET_UID, getStore("uid") || 0); //设置最新uid
  // 用户登录成功之后，每次点击路由都进行了角色的判断;
  if (to.query.token && to.query.uid) {
    //如果有有token表示第三方返回的数据,后台返回%20是空格代替+，需要返回%2B
    //let token = decodeURI(to.query.token).replace(/\s+/g, "+");
    setToken("token", to.query.token); //保存token密钥
    setStore("uid", to.query.uid); //保存uid
    store.commit(types.USER_SET_UID, to.query.uid); //保存uid
    next(to.path);
  }
  if (to.query.langId) {
    store.commit(types.SET_CURRENT_LANGUAGE, Number(to.query.langId) || 1); //保存用户信息
  }
  getUserInfo()
    .then(res => {
      // 根据token拉取用户信息
      store.commit(types.SET_LOGIN_INFO, res); //保存用户信息
      next();
    })
    .catch(err => {
      store.commit(types.SET_LOGIN_CLEAR);
      let isLoginRouter = asyncRouterMap.some(item => {
        return item.name === to.name;
      });
      if (isLoginRouter) {
        //要登录的路由返回到首页
        router.push({name: "home"});
      } else {
        next();
      }
    });
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
