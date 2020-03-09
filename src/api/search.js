import request from "@/utils/axios";

//获取搜索字段列表
export function getSearchList(params) {
  return request({
    url: "/basic/globalSearch",
    method: "get",
    params: params
  });
}
