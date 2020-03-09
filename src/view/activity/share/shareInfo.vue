<template>
  <container v-loading="shareLoading">
    <div class="shareinfo-layer">
      <div class="container shareinfo">
        <div class="shareinfo-content">
          <h1>助力赢汇豆，免费学外汇</h1>
          <p class="text-ll common-margin user-name">Hi, {{ userName }}</p>
          <p class="common-margin spefic-color">
            我是{{ contentObj.fromNickname }},正在使用汇课堂学习外汇,这是我最近学习的课程，需要你的协助获得
          </p>
          <div class="shareinfo-Huidou-layer">
            <el-row>
              <el-col :span="16" class="share-card">
                <el-row>
                  <template v-if="paramsObj.type === '1'">
                    <router-link target="_blank" :to="{name: 'articleInfo', params: {articleId: paramsObj.objId}}">
                      <article-card-cover
                        class="article-card-cover"
                        :data="contentObj.shareContent"
                        width="94px"
                        height="120px"
                      ></article-card-cover>
                    </router-link>
                    <span class="text-lg content-title-article">{{ contentObj.shareContent.title }}</span>
                  </template>
                  <template v-else>
                    <router-link target="_blank" :to="{name: 'videoDetail', params: {id: paramsObj.objId}}">
                      <img :src="shareCard.imageUrl" class="video-card" />
                      <span class="text-lg content-title">{{ shareCard.title }}</span>
                    </router-link>
                  </template>
                </el-row>
                <el-row class="help-list">
                  <img
                    v-for="(item, index) in contentObj.recordModelList"
                    :key="index"
                    :src="item.avatar"
                    class="img-avator vertical-align-middle"
                  />
                  <span v-if="helpCount === 10">
                    已被助力
                    <span class="help-count">10</span>
                    次，汇豆已全部拿到
                  </span>
                  <span v-else>
                    已被助力
                    <span class="help-count">{{ helpCount }}</span>
                    次，还差
                    <span class="help-count">{{ 10 - helpCount }}</span>
                    次拿到全部汇豆
                  </span>
                </el-row>
                <el-row class="progress-layer">
                  <el-col :span="13">
                    <el-progress :percentage="percentage" class="progress-bar" :show-text="false"></el-progress>
                  </el-col>
                  <el-col :span="11" v-if="contentObj.eachShareRewardBean * helpCount > 0">
                    <p class="text-sm text-primary proportion">
                      {{ contentObj.eachShareRewardBean * helpCount }}/{{ contentObj.totalRewardBeanCount }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="8">
                <ul class="help-wall">
                  <p class="help-title text-center">汇豆助攻墙</p>
                  <div class="help-name">
                    <li v-for="(item, index) in contentObj.recordModelList" :key="index">
                      <el-row>
                        <el-col :span="4" class="text-center">
                          <img :src="item.avatar" class="img-avator vertical-align-middle" />
                        </el-col>
                        <el-col :span="15" class="text-truncate">
                          <span class="text-sm">{{ item.nickname }}</span>
                        </el-col>
                        <el-col :span="5">
                          <span class="text-sm text-primary">{{ item.rewardBean }}汇豆</span>
                        </el-col>
                      </el-row>
                    </li>
                  </div>
                </ul>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="12" :class="userUid === paramsObj.fromUid ? 'hidden' : ''">
              <el-row :gutter="20">
                <el-col :span="5">
                  <div class="carousel">
                    <ul class="text-sm spefic-color">
                      <li v-for="(item, index) in helpList" :key="index">"{{ item.nickname }}"</li>
                    </ul>
                  </div>
                </el-col>
                <el-col :span="14">
                  <span class="text-sm spefic-color help-list">为您助力，离获得全部还差一小步</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" class="text-right">
              <el-button
                class="text-lg help-late-color"
                v-if="contentObj.recordModelList && contentObj.recordModelList.length === 10"
              >
                遗憾，来晚了一步
              </el-button>
              <el-button type="primary" class="text-lg" @click="helpToObtain" v-else>
                助力好友领取汇豆
              </el-button>
            </el-col>
          </el-row>
          <div class="rule-info">
            <p>规则说明:</p>
            <p class="text-sm spefic-color common-margin">1、请使用参与活动的手机号登录汇课堂app，登录后权益自动到账</p>
            <p class="text-sm spefic-color common-margin">2、活动时间：长期有效</p>
            <p class="text-sm spefic-color common-margin">3、每个汇课堂用户仅能从一次分享中得到一次汇豆</p>
          </div>
        </div>
      </div>
    </div>
    <template v-slot:rightMenu>
      <div></div>
    </template>
  </container>
</template>
<script>
import articleCardCover from "@/components/articleCard/cover";
import * as api from "@/api/share";
import * as articleApi from "@/api/article";
import * as videoApi from "@/api/video";
import {mapGetters, mapMutations} from "vuex";
export default {
  data() {
    return {
      shareCard: {},
      shareLoading: true,
      contentObj: {
        shareContent: {}
      }, //分享内容
      helpList: [{nickname: "哈哈1"}, {nickname: "哈哈2"}, {nickname: "哈哈3"}, {nickname: "哈哈4"}]
    };
  },
  components: {
    articleCardCover
  },
  computed: {
    ...mapGetters(["userName", "userUid"]),
    percentage() {
      return (100 / 1000) * 100;
    },
    helpCount() {
      return this.contentObj.recordModelList ? this.contentObj.recordModelList.length : 0;
    },
    paramsObj() {
      //url参数对象
      return this.$route.query;
    }
  },
  created() {
    this.getShareInfoList();
    this.shareLoading = false;
  },
  methods: {
    //获取奖励汇豆的分享信息
    getShareInfoList() {
      api
        .getRewardBeanShareInfo({
          fromUid: this.paramsObj.fromUid, //发出分享用户的id
          objId: this.paramsObj.objId, //文章id/视频id
          objType: this.paramsObj.type //文章/视频
        })
        .then(res => {
          this.contentObj = res;
          this.shareCard = res.shareContent;
        });
    },
    //助力好友领取汇豆
    helpToObtain() {
      this.$router.push({
        name: this.userName ? "achievement" : "shareLogin",
        query: {
          params: this.paramsObj
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/view/share/shareinfo.less";
</style>
