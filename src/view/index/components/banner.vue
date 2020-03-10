<template>
  <div class="home-banner-layer" ref="homeBannerLayer">
    <el-carousel class="advert-banner" height="1080px" v-if="banner.length != 0">
      <el-carousel-item class="banner-item" v-for="item in banner" :key="item.id">
        <a v-if="item.targetType === 1" :href="item.targetLink" :target="'_blank'">
          <img :src="item.imageUrl" />
        </a>
        <router-link
          v-else-if="item.targetType === 2 && item.extra.chapterCount === 1"
          target="_blank"
          :to="{name: 'chapterDetails', params: {chapterId: item.extra.chapterId, articleId: item.targetId}}"
        >
          <img :src="item.imageUrl" />
        </router-link>
        <router-link
          v-else-if="item.targetType === 2 && item.extra.chapterCount != 1"
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
        <router-link v-else-if="item.targetType === 4" target="_blank" :to="{name: 'testDownload'}">
          <img :src="item.imageUrl" />
        </router-link>
        <img :src="item.imageUrl" v-else />
        <div class="tag" v-if="item.tag">{{ item.tag }}</div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import * as commonAPI from "@/api/common";
import {toJson} from "@/utils/mUtils";
export default {
  props: {
    params: {}
  },
  data() {
    return {
      banner: []
    };
  },
  created() {
    commonAPI
      .getBannerList(this.params)
      .then(
        res => {
          this.banner = res.map(item => {
            if (item.targetType === 2) {
              item.extra = toJson(item.extra);
            }
            return item;
          });
        },
        res => {}
      )
      .finally(res => {});
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.home-banner-layer {
  .advert-banner h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    margin: 0;
  }

  .advert-banner {
    .el-carousel__item {
      text-align: center;
    }

    &:nth-child(2n) {
      background-color: #99a9bf;
    }

    &:nth-child(2n + 1) {
      background-color: #d3dce6;
    }

    .tag {
      z-index: 99;
      position: absolute;
      top: 24px;
      right: 0px;
      color: @white;
      padding: 5px 5px 5px 10px;
      font-size: @font-size-sm;
      border-bottom-left-radius: 30px;
      border-top-left-radius: 30px;
      background-color: rgba(0, 0, 0, 0.9);
    }
  }
}
</style>
