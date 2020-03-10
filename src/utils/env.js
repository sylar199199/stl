const appUrl = process.env.VUE_APP_URL; // development和production环境是不同的
const shareTitle = "汇课堂";
const weibo = {
  weiboUrl: "http://service.weibo.com/share/share.php",
  weiboAppkey: "133941828",
  pic: "https://user-gold-cdn.xitu.io/2019/6/20/16b7425dfa01dbf3?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1"
};
const qq = {
  baseUrl: "http://connect.qq.com/widget/shareqq/index.html",
  pic:
    "https://user-gold-cdn.xitu.io/2019/6/20/16b7425dfa01dbf3?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1",
  desc: "让希望进入外汇行业的人员、行业内人员、炒汇人员学习相关知识，提高自身水平。",
  summary: "文章梗概",
  source: "qzone"
};
const qqZone = {
  baseUrl: "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey",
  pic:
    "https://user-gold-cdn.xitu.io/2019/6/20/16b7425dfa01dbf3?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1",
  desc: "让希望进入外汇行业的人员、行业内人员、炒汇人员学习相关知识，提高自身水平。",
  summary: "文章梗概",
  site: "qzone"
};
const douban = {
  baseUrl: "https://www.douban.com/share/service",
  pic: "https://user-gold-cdn.xitu.io/2019/6/20/16b7425dfa01dbf3?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1"
};
const line = {
  baseUrl: "https://social-plugins.line.me/lineit/share"
};
const userMenuList = [
  {
    title: "personCenter.userMenuList.buyCourse",
    name: "buyCourse",
    icon: "purchased"
  },
  {
    title: "personCenter.userMenuList.myCollection",
    name: "myCollection",
    icon: "favorite2"
  },
  {
    title: "personCenter.userMenuList.buyBeans",
    name: "buyBeans",
    icon: "huidou"
  },
  {
    title: "personCenter.userMenuList.myOrder",
    name: "myOrder",
    icon: "order"
  },
  {
    title: "personCenter.userMenuList.myInformation",
    name: "myInformation",
    icon: "news"
  },
  {
    title: "personCenter.userMenuList.historyRecord",
    name: "historyRecord",
    icon: "recording"
  },
  {
    title: "personCenter.userMenuList.setting",
    name: "personalData",
    icon: "setting"
  }
];
const settingMenuList = [
  {
    title: "个人资料",
    name: "personalData"
  },
  {
    title: "账号安全",
    name: "accountSecurity"
  },
  {
    title: "地区与语言",
    name: "language"
  },
  {
    title: "用户协议",
    name: "userAgreement"
  },
  {
    title: "隐私协议",
    name: "privacyAgreement"
  }
];
const classData = [
  {
    value: 1,
    label: "commons.big"
  },
  {
    value: 2,
    label: "commons.middle"
  },
  {
    value: 3,
    label: "commons.small"
  }
];
const payWay = {
  1: "支付宝",
  2: "微信",
  3: "paypal",
  4: "汇豆支付"
};
const payStatus = {
  1: "已支付",
  2: "待支付",
  3: "已过期",
  4: "已取消",
  5: "退款中",
  6: "已退款"
};
const currencyCode = {
  CNY: "￥",
  TWD: "NT$"
};
const currencyText = {
  BEAN: "汇豆",
  CNY: "CNY",
  TWD: "TWD"
};
const topHeaderNav = ["home", "articleList", "videoList"];
const weixinUrl = "https://open.weixin.qq.com/connect/qrconnect";
const QQUrl = "https://graph.qq.com/oauth2.0/authorize";
const weiboUrl = "https://api.weibo.com/oauth2/authorize";
const facebookLoginUrl = "https://www.facebook.com/v6.0/dialog/oauth";
const googleLoginUrl = "https://accounts.google.com/o/oauth2/v2/auth";
const linkedinUri = "https://www.linkedin.com/uas/oauth2/authorization";
const redirect_uri = `${process.env.VUE_APP_WAP_BASE_URI}/api/login/thirdPartLoginCallBack`;
const webSharePage = `${window.location.protocol}//${window.location.host}/activity/share/shareInfo`;
const H5bSharePage = `${process.env.VUE_APP_H5_BASE_URI}/api/vue/index.html#/activity/share`;
const H5bArticleInfoPage = `${process.env.VUE_APP_WAP_BASE_URI}/api/zhcn/views/html/articleList.html`;
const H5bArticleDetailPage = `${process.env.VUE_APP_WAP_BASE_URI}/api/zhcn/views/html/articleDetail.html`;
const H5bVideoDetailPage = `${process.env.VUE_APP_WAP_BASE_URI}/api/zhcn/views/html/classVideo.html`;
export {
  appUrl,
  shareTitle,
  weibo,
  qq,
  qqZone,
  line,
  douban,
  userMenuList,
  settingMenuList,
  classData,
  payWay,
  payStatus,
  currencyCode,
  currencyText,
  topHeaderNav,
  weixinUrl,
  QQUrl,
  weiboUrl,
  facebookLoginUrl,
  googleLoginUrl,
  linkedinUri,
  redirect_uri,
  webSharePage,
  H5bSharePage,
  H5bArticleInfoPage,
  H5bArticleDetailPage,
  H5bVideoDetailPage
};
