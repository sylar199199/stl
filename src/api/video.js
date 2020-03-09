import request from "@/utils/axios";

//查看视频详情
export function getVideoDetailChapterList(params) {
  return request({
    url: "/learn/getVideoCourseDetailById",
    method: "get",
    params: params
  });
}

//查看视频评论
export function getVideoDetailComment(params) {
  return request({
    url: "/video/detail/comment",
    method: "get",
    params: params
  });
}

//查看分页视频列表
export function getVideoList(params) {
  return request({
    url: "/learn/getVideoListByPage",
    method: "get",
    params: params
  });
}

//查看推荐视频
export function getRecommendVideoList(params) {
  return request({
    url: "/learn/getRecommendVideoList",
    method: "get",
    params: params
  });
}

//新增视频记录
export function addVideoHistory(data) {
  return request({
    url: "/history/episode/save",
    method: "post",
    data
  });
}
