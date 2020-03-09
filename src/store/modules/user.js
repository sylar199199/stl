import * as types from "../types";
import {logout, getUserInfo} from "@/api/user"; // 导入用户信息相关接口
import {getToken, setToken, removeToken} from "@/utils/auth";
import {getStore, setStore} from "@/utils/mUtils";
import store from "@/store";

const user = {
  state: {
    name: "",
    avatar: "",
    introduce: "",
    amount: 0,
    level: 0,
    informationCount: 0,
    token: getToken("token"),
    uid: getStore("uid") || 0,
    totalScore: 0
  },
  getters: {
    token: state => state.token,
    userUid: state => state.uid,
    userAvatar: state => state.avatar,
    userIntroduce: state => state.introduce,
    userName: state => state.name,
    userAmount: state => state.amount,
    userLevel: state => state.level,
    userInformationCount: state => state.informationCount,
    userTotalScore: state => state.totalScore
  },
  actions: {
    //登出
    LogOut({commit, reqData}) {
      return new Promise((resolve, reject) => {
        logout(reqData).then(response => {
          setStore("uid", "0");
          commit(types.USER_SET_UID, "0");
          commit(types.USER_SET_NAME, "");
          commit(types.SET_AVATAR, "");
          removeToken("token");
          resolve();
        });
      });
    },
    //role和token是相同的;
    ChangeRoles({commit}, role) {
      return new Promise(resolve => {
        const token = role;
        setToken("token", token);
        getUserInfo({token: token}).then(res => {
          let data = res.data.userList;
          commit(types.USER_SET_UID, data.roles);
          commit(types.USER_SET_NAME, data.name);
          commit(types.SET_AVATAR, data.avatar);
          resolve();
        });
      });
    }
  },
  mutations: {
    [types.USER_SET_UID]: (state, uid) => {
      state.userUid = Number(uid);
    },
    [types.USER_SET_NAME]: (state, name) => {
      state.name = name;
    },
    [types.SET_AVATAR]: (state, avatar) => {
      state.avatar = avatar;
    },
    [types.SET_INTRODUCE]: (state, introduce) => {
      state.introduce = introduce;
    },
    [types.SET_LEVEL]: (state, level) => {
      state.level = level;
    },
    [types.SET_USERAMOUNT]: (state, amount) => {
      state.amount = amount;
    },
    [types.SET_UNREADMESSAGECOUNT]: (state, informationCount) => {
      state.informationCount = informationCount;
    },
    [types.SET_LOGIN_CLEAR]: state => {
      state.introduce = "";
      state.roles = "";
      state.name = "";
      state.avatar = "";
      state.uid = 0;
      state.totalScore = 0;
      setStore("uid", 0);
      setToken("token", process.env.VUE_APP_TOKEN);
    },
    [types.SET_LOGIN_INFO]: (state, data) => {
      state.introduce = data.intro;
      state.name = data.nickname;
      state.avatar = data.avatar || require("@/assets/img/default_avatar.jpg");
      state.uid = data.uid;
      state.level = data.level;
      state.totalScore = data.totalScore;
      state.informationCount = data.unreadMessageCount;
      state.amount = data.foreignExchangeBean;
    }
  }
};

export default user;
