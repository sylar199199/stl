<!-- 文章列表 -->
<template>
  <container class="article-list-layer">
    <div class="container">
      <!-- 轮播图 -->
      <banner :params="bannerParams"></banner>
      <education-tabs
        class="edu-tabs-layer"
        :activeIndex="gradeId"
        :classData="classData"
        @getContentList="changeLevelList"
      ></education-tabs>
      <el-row class="list" v-loading="loading" v-if="articleList.length">
        <el-col :span="6" v-for="item in articleList" :key="item.id">
          <router-link
            v-if="item.chapterCount === 1"
            target="_blank"
            :to="{name: 'chapterDetails', params: {articleId: item.id, chapterId: item.chapterId}}"
          >
            <article-list-card class="article-list-card" width="306px" height="140px" :data="item"></article-list-card>
          </router-link>
          <router-link v-else target="_blank" :to="{name: 'articleInfo', params: {articleId: item.id}}">
            <article-list-card class="article-list-card" width="306px" height="140px" :data="item"></article-list-card>
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
import articleListCard from "@/components/articleCard/list";
import educationTabs from "@/components/educationTabs";
import * as api from "@/api/article";
import {formatDate, getStore, setStore} from "@/utils/mUtils";
import pagination from "@/components/pagination/index.vue";
import {classData} from "@/utils/env.js";
import {mapGetters} from "vuex";

export default {
  name: "articleList",
  components: {
    Banner,
    educationTabs,
    articleListCard,
    pagination
  },
  data() {
    return {
      bannerParams: {
        placement: 5
      },
      loading: false,
      articleList: [], //文章列表
      articleId: -1,
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
      this.gradeId = getStore("articleGradeIdCache") || 1;
    }
    this.getContentList();
  },
  methods: {
    // 查询章节列表
    getContentList(pageIndex = 1, gradeId) {
      this.loading = true;
      api
        .getArticleList({
          gradeId: this.gradeId,
          pageSize: this.pagination.size,
          pageIndex
        })
        .then(res => {
          setStore("articleGradeIdCache", this.gradeId);
          this.articleList = res.pageDatas.map(item => {
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
      this.getContentList(1);
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
@import "~@/style/view/article/list.less";
</style>
