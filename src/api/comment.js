import request from "@/utils/axios";

/**
 * Created by lidy on 2019/12/20.
 */
//发布评论
export function addComment(data) {
  return request({
    url: "/comment/addComment",
    method: "post",
    data
  });
}

//获取评论
export function getCommentList(params) {
  return request({
    url: "/comment/getCommentList",
    method: "get",
    params
  });
}

//获取热门评论
export function getHotCommentList(params) {
  return request({
    url: "/comment/getHotCommentList",
    method: "get",
    params
  });
}

//回复评论
export function addCommentReply(data) {
  return request({
    url: "/comment/addReply",
    method: "post",
    data
  });
}

//删除评论
export function delCommentReply(params) {
  return request({
    url: "/comment/deleteComment",
    method: "delete",
    params
  });
}

//查询评论所处页码
export function getCommentPageIndex(params) {
  return request({
    url: "/comment/getCommentPageIndex",
    method: "get",
    params
  });
}
