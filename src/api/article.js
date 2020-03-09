import request from "@/utils/axios";

//查询文章详情
export function getArticleInfo(params) {
  return request({
    url: "/learn/getArticleCourseDetailById",
    method: "get",
    params: params
  });
}

export function getArticleList(params) {
  return request({
    url: "/learn/getArticleListByPage",
    method: "get",
    params: params
  });
}

//查询章节详情
export function getArticleChapterDetails(params) {
  return request({
    url: "/learn/getChapterDetailById",
    method: "get",
    params: params
  });
}

//删除书签
export function deleteBookmark(params) {
  return request({
    url: "/learn/deleteBookmark",
    method: "delete",
    params
  });
}

export function addBookmark(data) {
  return request({
    url: "/learn/addBookmark",
    method: "post",
    data
  });
}
