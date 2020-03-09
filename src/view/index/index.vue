<template>
  <container class="home-layer" ref="homeLayer">
    <div class="container">
      <banner :params="bannerParams"></banner>
      <el-row class="activity-layer" :gutter="16">
        <el-col :span="24 / bannerList.length" v-for="(item, index) in bannerList" :key="index" class="text-center">
          <template v-if="item.targetType === 1 || item.targetType === 4">
            <a v-if="item.targetLink" :href="item.targetLink" :target="'_blank'">
              <img :src="item.imageUrl" />
            </a>
            <img v-else :src="item.imageUrl" />
          </template>
          <router-link
            v-else-if="item.targetType === 2 && item.chapterCount === 1"
            target="_blank"
            :to="{name: 'chapterDetails', params: {chapterId: item.chapterId, articleId: item.targetId}}"
          >
            <img :src="item.imageUrl" />
          </router-link>
          <router-link
            v-else-if="item.targetType === 2 && item.chapterCount != 1"
            target="_blank"
            :to="{name: 'articleInfo', params: {articleId: item.targetId}}"
          >
            <img :src="item.imageUrl" />
          </router-link>
          <router-link
            v-else-if="item.targetType === 3"
            target="_blank"
            :to="{name: 'videoDetail', params: {id: item.targetId}}"
          >
            <img :src="item.imageUrl" />
          </router-link>
        </el-col>
      </el-row>
      <div class="illustration article-title text-center">{{ $t("commons.read") }}</div>
      <el-row v-loading="articleListLoading">
        <el-col :span="6" v-for="item in articleList" :key="item.index">
          <router-link
            v-if="item.chapterCount === 1"
            target="_blank"
            :to="{name: 'chapterDetails', params: {articleId: item.id, chapterId: item.chapterId}}"
          >
            <article-list-card class="article-list-card" :data="item"></article-list-card>
          </router-link>
          <router-link v-else target="_blank" :to="{name: 'articleInfo', params: {articleId: item.id}}">
            <article-list-card class="article-list-card" :data="item"></article-list-card>
          </router-link>
        </el-col>
      </el-row>
      <div class="look-more text-muted" @click="$router.push({name: 'articleList'})">
        <span class="vertical-align-middle" v-show="articleListCount != 0">{{ $t("commons.lookMore") }}</span>
        <img class="vertical-align-middle" src="@/assets/img/icon/arrow_right.svg" />
      </div>
      <div class="illustration video-title text-center">{{ $t("commons.video") }}</div>
      <el-row v-loading="videoListLoading">
        <el-col :span="6" v-for="item in videoList" :key="item.index">
          <router-link target="_blank" :to="{name: 'videoDetail', params: {id: item.id}}">
            <video-list-card class="video-list-card" :data="item"></video-list-card>
          </router-link>
        </el-col>
      </el-row>
      <div class="look-more text-muted" @click="$router.push({name: 'videoList'})">
        <span class="vertical-align-middle" v-show="videoListCount != 0">{{ $t("commons.lookMore") }}</span>
        <img class="vertical-align-middle" src="@/assets/img/icon/arrow_right.svg" />
      </div>
    </div>
  </container>
</template>

<script>
import Banner from "./components/banner";
import {mapMutations, mapGetters} from "vuex";
import * as types from "@/store/types";
import articleListCard from "@/components/articleCard/list";
import videoListCard from "@/components/videoListCard";
import * as api from "@/api/article";
import * as apiVideo from "@/api/video";
import {formatDate, toJson} from "@/utils/mUtils";
import * as commonAPI from "@/api/common";

export default {
  data() {
    return {
      bannerParams: {
        placement: 4
      },
      articleListLoading: false,
      videoListLoading: false,
      articleList: [], //文章列表
      videoList: [], //视频列表
      bannerList: [],
      articleListCount: 0,
      videoListCount: 0
    };
  },
  components: {
    Banner,
    articleListCard,
    videoListCard
  },
  mounted() {
    this.getWebBannerList();
    this.getArticleContentList();
    this.getVideoContentList();
  },
  methods: {
    ...mapMutations([types.USER_SET_NAME]),
    //查询文章列表
    getArticleContentList(val = 0) {
      this.articleListLoading = true;
      api
        .getArticleList({
          gradeId: 0,
          pageSize: 8,
          pageIndex: 1
        })
        .then(res => {
          this.articleListCount = res.rowCount;
          this.articleList = res.pageDatas.map(item => {
            item.isEdit = false;
            item.isChecked = false;
            return item;
          });
        })
        .finally(() => {
          this.articleListLoading = false;
        });
    },

    //查询视频列表
    getVideoContentList(val = 0) {
      this.videoListLoading = true;
      apiVideo
        .getVideoList({
          gradeId: 0,
          pageSize: 8,
          pageIndex: 1
        })
        .then(res => {
          this.videoListCount = res.rowCount;
          this.videoList = res.pageDatas.map(item => {
            item.isEdit = false;
            item.isChecked = false;
            return item;
          });
        })
        .finally(() => {
          this.videoListLoading = false;
        });
    },
    getWebBannerList() {
      commonAPI.getWebBannerList().then(res => {
        this.bannerList = res;
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/view/home/index.less";
</style>
