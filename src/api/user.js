import request from "@/utils/axios";

//密码登录
export function accountLogin(params) {
  return request({
    url: "/login/loginByAccount",
    method: "post",
    data: params
  });
}

//短信登录
export function SMSLogin(params) {
  return request({
    url: "/login/loginBySms",
    method: "post",
    data: params
  });
}

//登出
export function logout(params) {
  return request({
    url: "/login/logout",
    method: "delete",
    params
  });
}

//通过第三方信息加上手机号注册新用户
export function registerByThirdPhone(data) {
  return request({
    url: "/login/registerByThirdPhone",
    method: "post",
    data
  });
}

//获取用户信息
export function getUserInfo(params) {
  return request({
    url: "/user/getUserInfo",
    method: "get",
    params: params
  });
}

//获取验证码
export function getUserMobileCode(params) {
  return request({
    url: "/user/mobile/code",
    method: "get",
    data: params
  });
}

//获取协议内容
export function getAgreementContent(params) {
  return request({
    url: "/basic/getAgreement",
    method: "get",
    params: params
  });
}

//添加文章历史记录
export function addHistoryChapter(params) {
  return request({
    url: "/history/chapter/save",
    method: "post",
    data: params
  });
}

//获取历史记录列表
export function getMyLearnHistory(params) {
  return request({
    url: "/history/course/list",
    method: "get",
    params
  });
}

//获取收藏记录
export function getMyCollection(params) {
  return request({
    url: "/collection/getCollectionListByPage",
    method: "get",
    params
  });
}

//获取系统消息
export function getSystemInformation(params) {
  return request({
    url: "/message/getSysMessageList",
    method: "get",
    params
  });
}

//获取消息回复
export function getMessageInfo(params) {
  return request({
    url: "/message/getReplyMessageList",
    method: "get",
    params
  });
}

//通知已读
export function readNotice(data) {
  return request({
    url: "/message/readNotice",
    method: "put",
    data
  });
}

//查询我的学习记录
export function getLearnHistory(params) {
  return request({
    url: "/history/course/learn",
    method: "get",
    params: params
  });
}

//查询用户相关绑定信息
export function queryBindThirdInfo(params) {
  return request({
    url: "/user/queryBindThirdInfo",
    method: "get",
    params: params
  });
}

//解绑第三方账号
export function unBindThird(data) {
  return request({
    url: "/user/unBindThird",
    method: "post",
    data
  });
}

//绑定第三方账号
export function bindThird(data) {
  return request({
    url: "/user/bindThird",
    method: "post",
    data
  });
}

//更改用户手机号
export function updatePhone(data) {
  return request({
    url: "/user/updatePhone",
    method: "put",
    data
  });
}

//更改用户头像昵称
export function updateUserBaseInfo(data) {
  return request({
    url: "/user/updateUserBaseInfo",
    method: "put",
    data
  });
}

//已购课程
export function alreadyBoughtCourseList(params) {
  return request({
    url: "/alreadyBoughtCourse/list",
    method: "get",
    params: params
  });
}

//汇豆账单
export function foreignExchangeBeanList(params) {
  return request({
    url: "/web/foreignExchangeBean/list",
    method: "get",
    params
  });
}

//获取阿里滑块token
export function CheckSlideReg(params) {
  return request({
    url: "/web/foreignExchangeBean/list",
    method: "get",
    params
  });
}
