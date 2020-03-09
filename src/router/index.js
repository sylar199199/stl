import Vue from "vue";
import Router from "vue-router";

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
process.env.NODE_ENV === "development" ? Vue.use(Router) : null;

//默认不需要权限的页面
export const constantRouterMap = [
  {
    path: "*",
    redirect: "/404"
  },
  {
    path: "/account/login",
    name: "login",
    meta: {
      title: "登录注册"
    },
    component: () => import("@/view/account/login")
  },
  {
    path: "/account/bindMobile",
    name: "bindMobile",
    meta: {
      title: "注册"
    },
    component: () => import("@/view/account/bindMobile")
  },
  {
    path: "/404",
    component: () => import("@/view/errorPage/404")
  },
  {
    path: "/errorMsg",
    component: () => import("@/view/errorPage/errorMsg")
  },
  {
    path: "/",
    name: "home",
    meta: {
      title: "首页"
    },
    component: () => import("@/view/index")
  },
  {
    path: "/video/list",
    name: "videoList",
    meta: {
      title: "视频列表"
    },
    component: () => import("@/view/video/list")
  },
  {
    path: "/video/detail/:id",
    name: "videoDetail",
    meta: {
      title: "视频详情"
    },
    component: () => import("@/view/video/detail")
  },
  {
    path: "/article/list",
    name: "articleList",
    meta: {
      title: "文章列表"
    },
    component: () => import("@/view/article/list")
  },
  {
    path: "/article/info/:articleId",
    name: "articleInfo",
    meta: {
      title: "文章章节列表"
    },
    component: () => import("@/view/article/info")
  },
  {
    path: "/article/chapterDetails/:articleId/:chapterId",
    name: "chapterDetails",
    meta: {
      title: "文章章节详情"
    },
    component: () => import("@/view/article/chapterDetails")
  },
  {
    path: "/search/list/:query",
    name: "searchList",
    meta: {
      title: "搜索结果"
    },
    component: () => import("@/view/search/list")
  },
  {
    path: "/help/feedback",
    name: "feedback",
    meta: {
      title: "反馈"
    },
    component: () => import("@/view/help/feedback")
  },
  {
    path: "/help/testDownload",
    name: "testDownload",
    meta: {
      title: "试卷"
    },
    component: () => import("@/view/help/testDownload")
  },
  {
    path: "/user/loginAgreement",
    name: "loginAgreement",
    meta: {
      title: "登录协议"
    },
    component: () => import("@/view/user/loginAgreement")
  },
  {
    path: "/offLevel",
    name: "offLevel",
    meta: {
      title: "内容已下架"
    },
    component: () => import("@/view/index/offLevel")
  },
  {
    path: "/activity/share/achievement",
    name: "achievement",
    meta: {
      title: "个人成就"
    },
    component: () => import("@/view/activity/share/achievement")
  },
  {
    path: "/activity/share/login",
    name: "shareLogin",
    meta: {
      title: "登录"
    },
    component: () => import("@/view/activity/share/login")
  },
  {
    path: "/activity/share/shareInfo",
    name: "shareInfo",
    meta: {
      title: "分享"
    },
    component: () => import("@/view/activity/share/shareInfo")
  }
];

//异步路由（需要权限的页面）
export const asyncRouterMap = [
  {
    path: "/user/myCollection",
    name: "myCollection",
    meta: {
      title: "我的收藏"
    },
    component: () => import("@/view/user/myCollection")
  },
  {
    path: "/user/historyRecord",
    name: "historyRecord",
    meta: {
      title: "历史记录"
    },
    component: () => import("@/view/user/historyRecord")
  },
  {
    path: "/user/myInformation",
    name: "myInformation",
    meta: {
      title: "我的消息"
    },
    component: () => import("@/view/user/myInformation")
  },
  {
    path: "/user/setting/personalData",
    name: "personalData",
    meta: {
      title: "个人资料"
    },
    component: () => import("@/view/user/setting/personalData")
  },
  {
    path: "/user/setting/accountSecurity",
    name: "accountSecurity",
    meta: {
      title: "账户与安全"
    },
    component: () => import("@/view/user/setting/accountSecurity")
  },
  {
    path: "/user/setting/language",
    name: "language",
    meta: {
      title: "区域和语言"
    },
    component: () => import("@/view/user/setting/language")
  },
  {
    path: "/user/setting/userAgreement",
    name: "userAgreement",
    meta: {
      title: "用户协议"
    },
    component: () => import("@/view/user/setting/userAgreement")
  },
  {
    path: "/user/setting/privacyAgreement",
    name: "privacyAgreement",
    meta: {
      title: "隐私协议"
    },
    component: () => import("@/view/user/setting/privacyAgreement")
  },
  {
    path: "/user/order/list",
    name: "myOrder",
    meta: {
      title: "我的订单"
    },
    component: () => import("@/view/user/order/myOrder")
  },
  {
    path: "/user/order/payOrder",
    name: "payOrder",
    meta: {
      title: "支付页面"
    },
    component: () => import("@/view/user/order/payOrder")
  },
  {
    path: "/user/order/payStatus",
    name: "payStatus",
    meta: {
      title: "支付状态"
    },
    component: () => import("@/view/user/order/payStatus")
  },
  {
    path: "/user/huidou/buyBeans",
    name: "buyBeans",
    meta: {
      title: "购买汇豆"
    },
    component: () => import("@/view/user/buyBeans")
  },
  {
    path: "/user/order/buyCourse",
    name: "buyCourse",
    meta: {
      title: "已购课程"
    },
    component: () => import("@/view/user/buyCourse")
  }
];

//注册路由
export default new Router({
  mode: "history", // 默认为'hash'模式
  base: "/", // 添加跟目录,对应服务器部署子目录
  routes: constantRouterMap.concat(asyncRouterMap),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {x: 0, y: 0};
    }
  }
});
