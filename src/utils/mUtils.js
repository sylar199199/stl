import {setToken} from "@/utils/auth";
import dayjs from "dayjs";

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  let value = window.localStorage.getItem(name);
  if (value !== null) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return "";
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};
/** 金额转换
 */
export const formatMoney = (num, decimals = 2, thousandsSep = "") => {
  if (isNaN(num) || num == 0) {
    num = "0";
  }
  let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals); // 保留的位数一定是有限位数的正整数
  let s = num.toString().replace(/,/g, ""); // 字符串，将，变成'';
  let p = parseFloat(s); // 解析一个字符串，并返回一个浮点数
  let n = isNaN(p) ? 1 : p;
  let formatNum = n
    .toFixed(prec)
    .toString()
    .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
      return $1 + ",";
    });
  if (formatNum.substring(formatNum.indexOf("."), formatNum.length) === ".00") {
    formatNum = formatNum.substring(0, formatNum.indexOf("."));
  }
  return num ? `${formatNum}${thousandsSep}` : "";
};
/** 时间格式转换
 * @param {string}
 * @param {type}
 *   type == 1 ---> "{YYYY} MM-DDTHH:mm:ss SSS [Z] A"
 */
export const formatDate = (date, type = "YYYY-MM-DD HH:mm:ss") => {
  if (date) {
    return dayjs(date).format(type);
  }
  return dayjs().format(type);
};
/** 最近时间转换
 * val
 */
export const formatDateDay = val => {
  //获取js 时间戳
  let currentTime = new Date();
  currentTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
  let recordingTime = new Date(val);
  recordingTime = new Date(recordingTime.getFullYear(), recordingTime.getMonth(), recordingTime.getDate());
  let diffDay = (recordingTime - currentTime) / 1000 / 60 / 60 / 24;
  console.log(diffDay);
  if (diffDay < 0 && diffDay >= -1) {
    return `昨天${formatDate(val, "HH:mm")}`;
  } else if (diffDay === 0) {
    return `今天${formatDate(val, "HH:mm")}`;
  } else {
    return formatDate(val, "YYYY-MM-DD");
  }

  // if (currentTime >= todayTime) {
  //   //超过1小时少于24小时
  //   return `今天${formatDate(val, "HH:mm")}`;
  // } else if (currentTime < todayTime && yesterdayTime <= currentTime) {
  //   //超过1天少于2天内
  //   return `昨天${formatDate(val, "HH:mm")}`;
  // } else if (currentTime < yesterdayTime && lastYesterdayTime <= currentTime) {
  //   return `前天${formatDate(val, "HH:mm")}`;
  // } else {
  //   return formatDate(val, "YYYY-MM-DD");
  // }
};

export const formatTimeDay = timestamp => {
  function zeroize(num) {
    return (String(num).length == 1 ? "0" : "") + num;
  }

  var curTimestamp = parseInt(new Date().getTime() / 1000);

  var curDate = new Date(curTimestamp * 1000);
  var tmDate = new Date(timestamp);
  var Y = tmDate.getFullYear(),
    m = tmDate.getMonth() + 1,
    d = tmDate.getDate();
  var H = tmDate.getHours(),
    i = tmDate.getMinutes(),
    s = tmDate.getSeconds();
  if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return "今天" + zeroize(H) + ":" + zeroize(i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return "昨天" + zeroize(H) + ":" + zeroize(i);
    } else {
      return Y + "-" + zeroize(m) + "-" + zeroize(d);
    }
  }
};
/**
 *  数字转千位K
 * @param str 数字
 * @returns {string}
 */
export const formatNumToThousand = str => {
  let num = Number(str);
  if (num < 1000) {
    return str;
  }
  return (num / 1000).toFixed(1) + "K";
};

/**
 * 判断空值
 */
export const isEmpty = keys => {
  if (typeof keys === "string") {
    keys = keys.replace(/"|&nbsp;|\\/g, "").replace(/(^\s*)|(\s*$)/g, "");
    if (keys == "" || keys == null || keys == "null" || keys === "undefined") {
      return true;
    } else {
      return false;
    }
  } else if (typeof keys === "undefined") {
    // 未定义
    return true;
  } else if (typeof keys === "number") {
    return false;
  } else if (typeof keys === "boolean") {
    return false;
  } else if (typeof keys == "object") {
    if (JSON.stringify(keys) == "{}") {
      return true;
    } else if (keys == null) {
      // null
      return true;
    } else {
      return false;
    }
  }

  if (keys instanceof Array && keys.length == 0) {
    // 数组
    return true;
  }
};

/**
 * 返回两位的小数的字符串
 */
export const toFixedNum = num => {
  const tonum = Number(num).toFixed(2);
  return tonum;
};

export const showMessage = () => {
  this.$message({
    showClose: true,
    message: "对不起，您暂无此操作权限~",
    type: "success"
  });
};

/**
 * 读取base64
 */
export const readFile = file => {
  //var file = this.files[0];
  //判断是否是图片类型
  if (!/image\/\w+/.test(file.raw.type)) {
    alert("只能选择图片");
    return false;
  }
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(e) {
    var filedata = {
      filename: file.name,
      filebase64: e.target.result
    };
    alert(e.target.result);
  };
};
/**
 *
 */
export const trim = val => {
  return val.replace(/(^\s*)|(\s*$)/g, "");
};
/**
 * 动态插入css
 */
export const loadStyle = url => {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
};

//设置标签页title
export const setLabelTitle = val => {
  window.document.title = `${val}-汇课堂`;
};

//是否全屏
export const checkFullScreen = () => {
  return (
    window.fullScreen ||
    document.fullscreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen ||
    document.webkitFullScreen ||
    document.msFullScreen
  );
};
//是否为正整数
export const isInteger = s => {
  if (s === "") {
    return true;
  }
  let reg = /^[0-9]+$/;
  return reg.test(s);
};

export const setContentHeight = (that, ele, height) => {
  that.$nextTick(() => {
    ele.style.height = document.body.clientHeight - height + "px";
  });
};

export const changeLocale = type => {
  setToken("lang", type);
  this.$i18n.locale = type;
};

//函数防抖
let timeout;
export const debounce = (fn, wait = 0) => {
  if (timeout !== null) clearTimeout(timeout);
  timeout = setTimeout(fn, wait);
};

//节流
export function throttle(fn, wait) {
  wait = wait || 0;
  let timerId,
    lastTime = 0;

  function throttled() {
    let currentTime = new Date();
    if (currentTime >= lastTime + wait) {
      fn();
      lastTime = currentTime;
    } else {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      timerId = setTimeout(function() {
        fn();
      }, wait);
    }
  }

  return throttled;
}

//转换json字符串
export const toJson = str => {
  if (Object.prototype.toString.call(str) === "[object String]") {
    if (str) {
      return eval("(" + str + ")");
    }
    return "";
  }
  return str;
};

//计算用户等级进度
export const userLevelPercent = val => {
  if (val < 1500) {
    return (val / 1500) * 100;
  } else if (val < 5000) {
    return (val / 5000) * 100;
  }
  return 100;
};

///新窗口
export const openWindow = (url, name, iWidth, iHeight) => {
  //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
  let iTop = (window.screen.height - 30 - iHeight) / 2; //获得窗口的垂直位置;
  let iLeft = (window.screen.width - 10 - iWidth) / 2; //获得窗口的水平位置;
  window.open(
    url,
    name,
    "height=" +
      iHeight +
      ",innerHeight=" +
      iHeight +
      ",width=" +
      iWidth +
      ",innerWidth=" +
      iWidth +
      ",top=" +
      iTop +
      ",left=" +
      iLeft +
      ",toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no"
  );
};

//设置分享meta
export const setShareMeta = (url, title, description, image, type = "website") => {
  let doc = window.document;
  let metaUrl = doc.querySelector("meta[property='og:url']");
  if (!metaUrl) {
    metaUrl = document.createElement("meta");
    metaUrl.setAttribute("property", "og:url");
    document.getElementsByTagName("head")[0].appendChild(metaUrl);
  }
  metaUrl.setAttribute("content", url);
  let metaType = doc.querySelector("meta[property='og:type']");
  if (!metaType) {
    metaType = document.createElement("meta");
    metaType.setAttribute("property", "og:type");
    document.getElementsByTagName("head")[0].appendChild(metaType);
  }
  metaType.setAttribute("content", type);
  let metaTitle = doc.querySelector("meta[property='og:title']");
  if (!metaTitle) {
    metaTitle = document.createElement("meta");
    metaTitle.setAttribute("property", "og:title");
    document.getElementsByTagName("head")[0].appendChild(metaTitle);
  }
  metaTitle.setAttribute("content", title);
  let metaDescription = doc.querySelector("meta[property='og:description']");
  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("property", "og:description");
    document.getElementsByTagName("head")[0].appendChild(metaDescription);
  }
  metaDescription.setAttribute("content", url);
  let metaImage = doc.querySelector("meta[property='og:image']");
  if (!metaImage) {
    metaImage = document.createElement("description");
    metaImage.setAttribute("property", "og:image");
    document.getElementsByTagName("head")[0].appendChild(metaImage);
  }
  metaImage.setAttribute("content", image);
};
