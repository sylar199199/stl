<template>
  <div>
    <banner class="banner" :params="bannerParams"></banner>
    <container class="home-layer" ref="homeLayer">
      <el-row class="title-layer">
        <div class="illustration text-center recommend">推荐</div>
        <recommend
          :picList="displayPicList"
          :recommendPicList="recommendPicList"
          @switchNext="onClickSwitchNextHandle"
          @switchLast="onClickSwitchLastHandle"
        ></recommend>
      </el-row>
      <el-row class="title-layer">
        <el-col :span="12">
          <div class="illustration text-center video">{{ $t("commons.video") }}</div>
        </el-col>
        <el-col :span="12">
          <div class="vertical-align-middle look-more text-right" @click="$router.push({name: 'videoList'})">
            <el-button class="vertical-align-middle btn read" v-show="videoListCount != 0">
              {{ $t("commons.lookMore") }}
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row v-loading="videoListLoading">
        <div class="video-wrap">
          <div class="video-item" v-for="item in videoList" :key="item.index">
            <router-link target="_blank" :to="{name: 'videoDetail', params: {id: item.id}}">
              <video-list-card class="video-list-card" :data="item" width="340px" height="250px"></video-list-card>
            </router-link>
          </div>
        </div>
      </el-row>
      <el-row class="operate-layer">
        <el-col :span="12">
          <div class="operation-descript">
            <p class="title">推广运营位标题，最多显示一行</p>
            <p class="descript text-sm">
              内容说明，最多显示两行。内容说明，最多显示两行。内容说明，最多显示两行。内容说明，最多显示两行。内容说明，最多显示两行。
            </p>
            <el-button class="btn">查看更多</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <img
            class="img-box fr"
            src="https://huiketang.oss-cn-shenzhen.aliyuncs.com/test/image/2019/12/26/751383e53ac9d1f828ec703394831d1.jpg"
          />
        </el-col>
      </el-row>
      <el-row class="title-layer">
        <el-col :span="12">
          <div class="illustration text-center read">{{ $t("commons.read") }}</div>
        </el-col>
        <el-col :span="12">
          <div class="vertical-align-middle look-more text-right read" @click="$router.push({name: 'articleList'})">
            <el-button class="vertical-align-middle btn" v-show="articleListCount != 0">
              {{ $t("commons.lookMore") }}
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row v-loading="articleListLoading">
        <el-col :span="6" v-for="item in articleList" :key="item.index">
          <router-link
            v-if="item.chapterCount === 1"
            target="_blank"
            :to="{name: 'chapterDetails', params: {articleId: item.id, chapterId: item.chapterId}}"
          >
            <article-list-card class="article-list-card" :data="item" width="355px"></article-list-card>
          </router-link>
          <router-link v-else target="_blank" :to="{name: 'articleInfo', params: {articleId: item.id}}">
            <article-list-card class="article-list-card" :data="item"></article-list-card>
          </router-link>
        </el-col>
      </el-row>
      <el-row class="avatage-layer">
        <el-col :span="8" class="list-item">
          <div class="item-wrap text-center">
            <div class="img-box">
              <img src="@/assets/img/icon/avatange-one.svg" />
            </div>
            <p class="title bold">{{ $t("index.avatangeOne") }}</p>
            <div class="descript">
              <p>{{ $t("account.huiketang") }}{{ $t("index.avatangeOneTipsOne") }}{{ $t("index.avatangeOne") }}</p>
              <p>{{ $t("index.avatangeOneTipsTwo") }}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8" class="list-item">
          <div class="item-wrap text-center">
            <div class="img-box">
              <img src="@/assets/img/icon/avatange-two.svg" />
            </div>
            <p class="title bold">{{ $t("index.avatangeTwo") }}</p>
            <div class="descript">
              <p>{{ $t("index.avatangeTwoTipsOne") }}{{ $t("index.avatangeTwo") }}</p>
              <p>{{ $t("account.huiketang") }}{{ $t("index.avatangeTwoTipsTwo") }}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8" class="list-item">
          <div class="item-wrap text-center">
            <div class="img-box">
              <img src="@/assets/img/icon/avatange-three.svg" />
            </div>
            <p class="title bold">{{ $t("index.avatangeThree") }}</p>
            <div class="descript">
              <p>{{ $t("index.avatangeThreeTipsOne") }}{{ $t("account.huiketang") }}{{ $t("account.huiketang") }}</p>
              <p>{{ $t("index.avatangeThreeTipsTwo") }}{{ $t("index.avatangeThree") }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </container>
  </div>
</template>

<script>
import Banner from "./components/banner";
import recommend from "./components/recommend";
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
      videoListCount: 0,
      displayPicList: [],
      recommendPicList: [
        {url: "https://img.wbp5.com/upload/images/fxbible/2019/09/04/144453942.jpeg"},
        {url: "https://huiketang.oss-cn-shenzhen.aliyuncs.com/test/image/2020/3/2/6ea6ea0642f4721b6c86a6b0027b63a.jpg"},
        {url: "https://huiketang.oss-cn-shenzhen.aliyuncs.com/test/image/2020/3/3/647ff491fd1c322b2738d94a4be24ae.png"},
        {url: "https://fxbible.oss-cn-hangzhou.aliyuncs.com/test/image/2019/10/14/36f9873efd6c949a53a0ca7a4a0d11e.jpg"},
        {
          url:
            "https://huiketang.oss-cn-shenzhen.aliyuncs.com/test/image/2019/12/25/9e69f7abd6d112ba09f6309f18056b8.png"
        },
        {
          url:
            "https://huiketang.oss-cn-shenzhen.aliyuncs.com/test/image/2019/12/26/751383e53ac9d1f828ec703394831d1.jpg"
        }
      ]
    };
  },
  components: {
    Banner,
    articleListCard,
    videoListCard,
    recommend
  },
  mounted() {
    this.getWebBannerList();
    this.getArticleContentList();
    this.getVideoContentList();
    this.displayPicList = this.recommendPicList.slice(0, 3);
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
    },
    onClickSwitchNextHandle() {
      this.displayPicList = [];
      if (this.recommendPicList.length > 3) {
        this.displayPicList = this.recommendPicList.slice(-3);
      } else {
        this.playPdisplayPicListicList = this.recommendPicList;
      }
    },
    onClickSwitchLastHandle() {
      this.displayPicList = [];
      if (this.recommendPicList.length > 3) {
        this.displayPicList = this.recommendPicList.slice(0, 3);
      } else {
        this.playPdisplayPicListicList = this.recommendPicList;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/view/home/index.less";
</style>
