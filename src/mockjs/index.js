import Vue from "vue";
import Mock from "mockjs";

process.env.NODE_ENV === "development" ? Vue.use(Mock) : null;

import videoAPI from "./video";
import shareAPI from "./share";
// 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
Mock.setup({
  timeout: "300-600"
});

// video
Mock.mock(/\/video\/detail\/get/, "get", videoAPI.getVideoDetailList);

Mock.mock(/\/activity\/share\/getShareInfo/, "get", shareAPI.getShareInfoList);

Mock.mock(/\/activity\/share\/getHelpList/, "get", shareAPI.getHelpList);

export default Mock;
