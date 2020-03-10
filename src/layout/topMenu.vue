<template>
  <div class="menu-top" ref="menuTop">
    <!--导航搜索框-->
    <el-row>
      <el-col :span="14">
        <keep-alive>
          <ul class="nav-tab-layer fr" :style="{color: fontColor}">
            <li
              v-for="item in navList"
              :key="item.value"
              :class="{active: activeIndex === item.value}"
              @click="onChangeTabsHandle(item.value)"
            >
              {{ item.label }}
            </li>
          </ul>
        </keep-alive>
      </el-col>
      <el-col :span="7">
        <div class="search-icon fr" v-if="isInputShow">
          <img class="vertical-align-middle pointer" :src="searchIcon" @click="isInputShow = false" />
        </div>
        <div class="search-input-bar fr" v-else>
          <el-input
            size="small"
            class="search-input"
            :placeholder="$t('layout.searchCourse')"
            v-model="searchText"
            @focus="showEnter = true"
            @blur="showEnter = false"
          >
            <img
              slot="prefix"
              src="@/assets/icon/navibar-search.svg"
              class="vertical-align-middle pointer"
              @click="onSearchEnterHandle"
            />
            <img
              slot="suffix"
              src="@/assets/img/icon/close-icon.svg"
              class="vertical-align-middle pointer"
              @click="isInputShow = true"
            />
          </el-input>
        </div>
      </el-col>
      <el-col :span="3">
        <!--右侧菜单开始-->
        <div class="right-menu-list fr">
          <!--已登录-->
          <template v-if="userName">
            <slot name="rightMenu">
              <!--消息-->
              <div class="notice pointer">
                <template v-if="userInformationCount > 0">
                  <el-badge :value="userInformationCount > 99 ? '99+' : userInformationCount" class="item">
                    <img :src="noticeIcon" @click="onRouterLinkHandle(info.name, 0)" class="vertical-align-middle" />
                  </el-badge>
                </template>
                <template v-else>
                  <img :src="noticeIcon" @click="onRouterLinkHandle(info.name, 0)" class="vertical-align-middle" />
                </template>
              </div>
              <router-link class="user-link fr" :to="{name: 'buyCourse'}">
                <el-divider v-if="userName" direction="vertical"></el-divider>
                <!--个人头像用户中心下拉列表-->
                <el-dropdown>
                  <div class="user-avatar">
                    <el-avatar class="vertical-align-middle el-avatar-default" :src="userAvatar"></el-avatar>
                  </div>
                  <el-dropdown-menu slot="dropdown" class="info-dropdown">
                    <el-dropdown-item class="user-info cf">
                      <el-avatar class="el-avatar-default head-pic fl" :src="userAvatar"></el-avatar>
                      <div class="info-box fr">
                        <div class="info">
                          <span class="nick-name text-truncate vertical-align-middle">{{ userName }}</span>
                          <level-explain class="level-explain vertical-align-middle"></level-explain>
                        </div>
                        <el-progress
                          class="default-progress progress"
                          :percentage="levelPercent"
                          :stroke-width="4"
                          :show-text="false"
                        ></el-progress>
                      </div>
                    </el-dropdown-item>
                    <div class="my-list user-menu-list">
                      <el-dropdown-item
                        @click.native="onRouterLinkHandle(item.name, 0)"
                        v-for="item in $t('layout.userMenuList')"
                        :key="item.title"
                      >
                        <div class="item-content">
                          <icon-svg
                            class="text-icon text-muted2 vertical-align-middle inline-block"
                            :icon-class="'icon-' + item.icon"
                          ></icon-svg>
                          <span class="text-default vertical-align-middle">{{ item.title }}</span>
                        </div>
                      </el-dropdown-item>
                    </div>
                    <el-dropdown-item class="logout text-center" divided @click.native="onClickLogoutHandle">
                      {{ $t("layout.loginout") }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </router-link>
            </slot>
          </template>
          <!-- 未登录 -->
          <p v-else class="text-right">
            <a class="vertical-align-middle font-class" :style="{color: fontColor}" @click="onLoginPopVisible(true)">
              {{ $t("layout.loginRegister") }}
            </a>
          </p>
        </div>
      </el-col>
    </el-row>
    <template v-if="loginDialogVisible">
      <login-pop :dialogVisible="loginDialogVisible" @close="onLoginPopVisible(false)"></login-pop>
    </template>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import * as types from "@/store/types";
import {formatDate, trim} from "@/utils/mUtils";
import * as userApi from "@/api/user";
import levelExplain from "@/components/levelExplain";
import {asyncRouterMap} from "@/router";
import {userLevelPercent} from "@/utils/mUtils";
import {topHeaderNav} from "@/utils/env";
export default {
  name: "top-menu",
  props: {
    scrollHeight: {
      type: Number,
      default: 0
    }
  },
  components: {
    levelExplain,
    LoginPop: () => import("@/components/login/loginPop")
  },

  data() {
    return {
      learn: {
        title: this.$t("layout.myStudy"),
        name: "historyRecord"
      },
      info: {
        title: "",
        name: "myInformation"
      },
      showEnter: false,
      myLearnIsFirst: true,
      myLearnLoading: true,
      searchText: "",
      isInputShow: true,
      navList: [
        {label: "首页", value: 0},
        {label: "文章", value: 1},
        {label: "视频", value: 2}
      ],
      scrollFixedHeight: 1080
    };
  },
  computed: {
    ...mapGetters([
      "userName",
      "userAvatar",
      "prevRouter",
      "topMenuRecentLearn",
      "loginDialogVisible",
      "userUid",
      "userInformationCount",
      "userTotalScore",
      "currentNavTab"
    ]),
    isShowEnterIcon() {
      return this.showEnter && this.searchText;
    },
    levelPercent() {
      return userLevelPercent(this.userTotalScore);
    },
    activeIndex: {
      get() {
        return this.currentNavTab;
      },
      set(val) {
        this[types.SET_CURRENT_NAV_TAB](val);
      }
    },
    fontColor() {
      return this.scrollHeight <= this.scrollFixedHeight ? "#fff" : "#353c46";
    },
    searchIcon() {
      return this.scrollHeight <= this.scrollFixedHeight
        ? require("@/assets/img/icon/nav-search-white.svg")
        : require("@/assets/img/icon/nav-search-black.svg");
    },
    noticeIcon() {
      return this.scrollHeight <= this.scrollFixedHeight
        ? require("@/assets/img/icon/nav-notice-white.svg")
        : require("@/assets/img/icon/nav-notice-black.svg");
    }
  },
  watch: {
    activeIndex(val) {
      this.$router.push({name: topHeaderNav[val]});
    }
  },
  methods: {
    ...mapMutations([
      types.SET_RECENT_LEARN,
      types.SET_LOGIN_DIALOG_VISIBLE,
      types.SET_LOGIN_CLEAR,
      types.SET_CURRENT_NAV_TAB
    ]),
    onRouterLinkHandle(name, type) {
      this.$router.push({
        name: name,
        query: {
          type: type
        }
      });
    },
    onSearchEnterHandle() {
      if (this.searchText) {
        this.doGetSearchList(this.searchText);
      }
    },
    getArticleLearnList() {
      this.myLearnLoading = true;
      userApi
        .getLearnHistory({
          courseType: 1,
          pageSize: 8,
          pageIndex: 1
        })
        .then(
          res => {
            this.myLearnIsFirst = false; //赋值以后切换不刷新数据
            let dataList = res.pageDatas.map(item => {
              item.createTime = formatDate(item.createTime, "YYYY-MM-DD");
              item.isEdit = false;
              item.isChecked = false;
              return item;
            });
            this[types.SET_RECENT_LEARN]({
              article: dataList
            });
          },
          res => {}
        )
        .finally(res => {
          this.myLearnLoading = false;
        });
    },
    getVideoLearnList() {
      this.myLearnLoading = true;
      userApi
        .getLearnHistory({
          courseType: 2,
          pageSize: 8,
          pageIndex: 1
        })
        .then(
          res => {
            this.myLearnIsFirst = false; //赋值以后切换不刷新数据
            let dataList = res.pageDatas.map(item => {
              item.createTime = formatDate(item.createTime, "YYYY-MM-DD");
              item.isEdit = false;
              item.isChecked = false;
              return item;
            });
            this[types.SET_RECENT_LEARN]({
              video: dataList
            });
          },
          res => {}
        )
        .finally(res => {
          this.myLearnLoading = false;
        });
    },
    doGetSearchList(text) {
      this.searchText = "";
      this.$router.push({name: "searchList", params: {query: trim(text)}});
    },
    onLoginPopVisible(visible) {
      this[types.SET_LOGIN_DIALOG_VISIBLE](visible);
    },
    onClickLogoutHandle() {
      userApi.logout().then(res => {
        this[types.SET_LOGIN_CLEAR]();
        let isLoginRouter = asyncRouterMap.some(item => {
          return item.name === this.$route.name;
        });
        if (isLoginRouter) {
          //要登录的路由返回到首页
          this.$router.push({name: "home"});
        } else {
          this.$router.go(0);
        }
      });
    },
    onChangeTabsHandle(val) {
      this.activeIndex = val;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/view/layout/topMenu.less";
</style>

<style lang="less">
.nav-menu-popover {
  font-size: 11px;
  padding: 2px 4px;
  margin: 0;
  color: #fff;
  min-width: 0px;
  width: 56px !important;
  opacity: 0.88;
  border-radius: 4px;
  border: solid 1px #ffffff;
  background-color: #1a1a1a;
}
</style>
