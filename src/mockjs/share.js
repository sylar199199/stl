import Mock from "mockjs";

export default {
  getShareInfoList: config => {
    var List = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      List.push(
        Mock.mock({
          id: i,
          name: Mock.Random.cword(5, 20),
          img: Mock.Random.image("24x24"),
          huidou: 100
        })
      );
    }
    return {
      code: 200,
      data: {
        total: 12,
        list: List
      }
    };
  },
  getHelpList: config => {
    var List = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      List.push(
        Mock.mock({
          id: i,
          img: Mock.Random.image("24x24")
        })
      );
    }
    return {
      code: 200,
      data: {
        total: 10,
        list: List
      }
    };
  }
};
