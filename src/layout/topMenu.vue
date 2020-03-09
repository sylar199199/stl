<template>
  <div class="menu-top" ref="menuTop">
    <!--导航搜索框-->
    <el-input
      size="small"
      class="search-input"
      :placeholder="$t('layout.searchCourse')"
      v-model="searchText"
      @focus="showEnter = true"
      @blur="showEnter = false"
      @keyup.native.enter="onSearchEnterHandle"
    >
      <img slot="prefix" src="@/assets/icon/navibar-search.svg" class="vertical-align-middle" />
      <img
        v-show="searchText.length"
        @click="onSearchEnterHandle"
        slot="suffix"
        src="@/assets/icon/navibar-enter.svg"
        class="vertical-align-middle pointer"
      />
    </el-input>
    <!--右侧菜单开始-->
    <div class="right-menu-list fr">
      <!--已登录-->
      <template v-if="userName">
        <slot name="rightMenu">
          <!--我的学习下拉框-->
          <el-dropdown
            :offset="20"
            class="my-learn-text fl"
            :hide-timeout="500"
            @visible-change="onHoverLearnDropdownHandle"
          >
            <div class="my-learn">{{ $t("layout.myStudy") }}</div>
            <el-dropdown-menu class="my-learn-dropdown">
              <div class="card-box">
                <el-tabs class="default-tabs my-learn-tabs" v-model="activeName">
                  <el-tab-pane
                    v-loading="myLearnLoading"
                    :label="$t('commons.read')"
                    name="article"
                    class="tab-content scroll-bar"
                  >
                    <template v-if="topMenuRecentLearn.article.length">
                      <div class="content scroll-bar">
                        <li v-for="item in topMenuRecentLearn.article" :key="item.id">
                          <router-link
                            v-if="item.chapterCount === 1"
                            target="_blank"
                            :to="{
                              name: 'chapterDetails',
                              params: {articleId: item.courseId, chapterId: item.chapterId}
                            }"
                          >
                            <article-list-card
                              class="article-list-card"
                              :data="item"
                              width="296px"
                              height="104px"
                              cover-width="64px"
                              cover-height="80px"
                              text-box-font-size="12px"
                            >
                              <p class="text-muted text-xs" slot="info">{{ $t("layout.watchTo") }}{{ item.idx }}章</p>
                            </article-list-card>
                          </router-link>
                          <router-link
                            v-else
                            target="_blank"
                            v-for="item in topMenuRecentLearn.article"
                            :key="item.id"
                            :to="{name: 'articleInfo', params: {articleId: item.courseId}}"
                          >
                            <article-list-card
                              class="article-list-card"
                              :data="item"
                              width="296px"
                              height="104px"
                              cover-width="64px"
                              cover-height="80px"
                              text-box-font-size="12px"
                            >
                              <p class="text-muted text-xs" slot="info">{{ $t("layout.watchTo") }}{{ item.idx }}章</p>
                            </article-list-card>
                          </router-link>
                        </li>
                      </div>
                      <div class="look-all text-center" @click="onRouterLinkHandle('historyRecord', 0)">
                        查看全部
                      </div>
                    </template>
                    <template v-else>
                      <div class="empty-layer text-center">
                        <img src="@/assets/img/search/search_empty.svg" />
                        <p class="text-muted">{{ $t("layout.noData") }}</p>
                      </div>
                    </template>
                  </el-tab-pane>
                  <el-tab-pane
                    v-loading="myLearnLoading"
                    :label="$t('commons.video')"
                    name="video"
                    class="tab-content scroll-bar"
                  >
                    <template v-if="topMenuRecentLearn.video.length">
                      <div class="content scroll-bar">
                        <router-link
                          target="_blank"
                          v-for="item in topMenuRecentLearn.video"
                          :key="item.id"
                          :to="{name: 'videoDetail', params: {id: item.courseId}}"
                        >
                          <video-list-card
                            class="video-list-card"
                            type="horizontal"
                            :data="item"
                            width="296px"
                            height="81px"
                            coverWidth="112px"
                            coverHeight="64px"
                            textFontSize="14px"
                          >
                            <p class="text-muted text-xs" slot="info">{{ $t("layout.watchTo") }} {{ item.idx }}集</p>
                          </video-list-card>
                        </router-link>
                      </div>
                      <div class="look-all text-center" @click="onRouterLinkHandle('historyRecord', 1)">
                        查看全部
                      </div>
                    </template>
                    <template v-else>
                      <div class="empty-layer text-center">
                        <img src="@/assets/img/search/search_empty.svg" />
                        <p class="text-muted">{{ $t("layout.noData") }}</p>
                      </div>
                    </template>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <!--消息-->
          <div class="notice pointer fl">
            <template v-if="userInformationCount > 0">
              <el-badge :value="userInformationCount > 99 ? '99+' : userInformationCount" class="item">
                <img
                  src="@/assets/icon/notice.svg"
                  @click="onRouterLinkHandle(info.name, 0)"
                  class="vertical-align-middle"
                />
              </el-badge>
            </template>
            <template v-else>
              <img
                src="@/assets/icon/notice.svg"
                @click="onRouterLinkHandle(info.name, 0)"
                class="vertical-align-middle"
              />
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
        <a class="vertical-align-middle font-class" @click="onLoginPopVisible(true)">
          {{ $t("layout.loginRegister") }}
        </a>
      </p>
    </div>
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
import articleListCard from "@/components/articleCard/list";
import videoListCard from "@/components/videoListCard";
import levelExplain from "@/components/levelExplain";
import {asyncRouterMap} from "@/router";
import {userLevelPercent} from "@/utils/mUtils";

export default {
  name: "top-menu",
  components: {
    articleListCard,
    videoListCard,
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
      activeName: "article",
      myLearnIsFirst: true,
      myLearnLoading: true,
      searchText: ""
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
      "userTotalScore"
    ]),
    isShowEnterIcon() {
      return this.showEnter && this.searchText;
    },
    levelPercent() {
      return userLevelPercent(this.userTotalScore);
    }
  },
  watch: {
    searchText(val) {
      // debounce(() => {
      //   if (!val) {
      //     this.$router.push(this.prevRouter);
      //   }
      // }, 1000);
    },
    activeName(type) {
      if (type === "video") {
        this.getVideoLearnList();
      } else {
        this.getArticleLearnList();
      }
    }
  },
  methods: {
    ...mapMutations([types.SET_RECENT_LEARN, types.SET_LOGIN_DIALOG_VISIBLE, types.SET_LOGIN_CLEAR]),
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
    onHoverLearnDropdownHandle(visible) {
      //显示隐藏我的学习下拉
      if (visible) {
        if (this.activeName === "article") {
          this.getArticleLearnList();
        } else {
          this.getVideoLearnList();
        }
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
