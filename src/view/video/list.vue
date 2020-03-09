<!-- 视频列表 -->
<template>
  <container class="video-list-layer">
    <div class="container">
      <!-- 轮播图 -->
      <banner :params="bannerParams"></banner>
      <education-tabs
        class="edu-tabs-layer"
        :activeIndex="gradeId"
        :classData="classData"
        @getContentList="changeLevelList"
      ></education-tabs>
      <el-row v-loading="loading" v-if="videoList.length">
        <el-col :span="6" v-for="item in videoList" :key="item.index">
          <router-link target="_blank" :to="{name: 'videoDetail', params: {id: item.id}}">
            <video-list-card
              class="video-list-card"
              :data="item"
              width="282px"
              height="230px"
              @getContentList="getContentList"
            ></video-list-card>
          </router-link>
        </el-col>
      </el-row>
      <el-row v-else class="empty-content text-center">
        <img src="@/assets/img/icon/empty-content.svg" />
        <p>{{ $t("commons.noRelateContent") }}</p>
      </el-row>
      <pagination
        :page-total="pagination.total"
        :page-index="pagination.index"
        :page-size="pagination.size"
        @onCurrentChange="paginationChangeHandle"
      ></pagination>
    </div>
  </container>
</template>

<script>
import Banner from "@/view/index/components/banner";
import videoListCard from "@/components/videoListCard";
import educationTabs from "@/components/educationTabs";
import * as api from "@/api/video";
import pagination from "@/components/pagination/index.vue";
import {classData} from "@/utils/env.js";
import {mapGetters} from "vuex";
import {getStore, setStore} from "@/utils/mUtils";

export default {
  name: "videoList",
  components: {
    Banner,
    educationTabs,
    videoListCard,
    pagination
  },
  data() {
    return {
      bannerParams: {
        placement: 6
      },
      loading: false,
      videoList: [], //视频列表
      pagination: {
        index: 1,
        size: 24,
        total: 0
      },
      classData: classData, //学历
      gradeId: 1
    };
  },
  computed: {
    ...mapGetters(["userLevel", "prevRouter"])
  },
  created() {
    if (this.prevRouter === "home") {
      this.gradeId = this.userLevel || 1;
    } else {
      this.gradeId = getStore("videoGradeIdCache") || 1;
    }
    this.getContentList();
  },
  methods: {
    //查询视频列表
    getContentList(pageIndex = 1, gradeId) {
      this.loading = true;
      api
        .getVideoList({
          gradeId: this.gradeId,
          pageSize: 24,
          pageIndex
        })
        .then(res => {
          setStore("videoGradeIdCache", this.gradeId);
          this.videoList = res.pageDatas.map(item => {
            item.isEdit = false;
            item.isChecked = false;
            return item;
          });
          this.pagination.total = res.rowCount;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changeLevelList(level) {
      this.gradeId = level;
      this.getContentList(1, level);
    },
    //页码改变
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getContentList(this.pagination.index);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/view/video/list.less";
</style>
