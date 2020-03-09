import request from "@/utils/axios";

//添加汇豆奖励记录
export function addRewardRecord(data) {
  return request({
    url: "/share/addRewardRecord",
    method: "post",
    data
  });
}

//获取奖励汇豆的分享信息
export function getRewardBeanShareInfo(params) {
  return request({
    url: "/share/getRewardBeanShareInfo",
    method: "get",
    params: params
  });
}

//领英分享url
export function getlinkedinShareLink(data) {
  return request({
    url: "http://api.linkedin.com/v1/people/~/shares?format=json",
    baseURI: "",
    method: "get",
    params: data
  });
}
