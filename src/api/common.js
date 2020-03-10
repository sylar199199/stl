import request from "@/utils/axios";

//查询banner列表
export function getBannerList(params) {
  return request({
    url: "/basic/getBannerListByPlacement",
    method: "get",
    params: params
  });
}

//查询验证码
export function getAuthCode(data) {
  return request({
    url: "/basic/getAuthCode",
    method: "post",
    data
  });
}

//新增收藏
export function addFavorite(data) {
  return request({
    url: "/collection/addCollection",
    method: "post",
    data
  });
}

//删除收藏
export function delFavorite(params) {
  return request({
    url: "/collection/deleteByObjId",
    method: "delete",
    params
  });
}

//批量删除收藏
export function delBatchFavorite(params) {
  return request({
    url: "/collection/deleteBatch",
    method: "delete",
    params
  });
}

//获取国家信息列表
export function getCountryList(params) {
  return request({
    url: "/basic/getCountryList",
    method: "get",
    params: params
  });
}

//获取反馈意见类型
export function getQuestionType(params) {
  return request({
    url: "/feedback/queryTypes",
    method: "get",
    params
  });
}

//新增反馈意见
export function addFeedBack(params) {
  return request({
    url: "/feedback/addFeedback",
    method: "post",
    data: params
  });
}

//增加阅读数
export function addReadingCount(params) {
  return request({
    url: "/learn/updateReadingCount",
    method: "put",
    data: params
  });
}
//获取web运营位列表
export function getWebBannerList(params) {
  return request({
    url: "/basic/listWebRecommend",
    method: "get",
    params: params
  });
}
//查询收藏列表
export function getSearchCollectionList(params) {
  return request({
    url: "/collection/getCollectionListByPage",
    method: "get",
    params
  });
}
