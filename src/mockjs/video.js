import Mock from "mockjs";

import * as mUtils from "@/utils/mUtils";

export default {
  getVideoDetailList: config => {
    let List = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      List.push(
        Mock.mock({
          id: i,
          title: Mock.Random.cword(15, 18),
          createTime: Mock.Random.datetime(),
          playCount: Mock.Random.integer(0, 9999),
          keyWord: [Mock.Random.cword(2, 4), Mock.Random.cword(2, 4), Mock.Random.cword(2, 4)]
        })
      );
    }
    return {
      code: 200,
      data: {
        total: 12,
        list: []
      }
    };
  }
};
