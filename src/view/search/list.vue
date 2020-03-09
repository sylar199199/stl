<template>
  <container>
    <div v-loading="loading" class="container search-list-layer">
      <div class="tips-layer text-center" :class="{empty: isSearchEmpty}">
        <p class="title" v-if="isSearchEmpty">
          {{ $t("search.sorryMsg") }}
          <span class="text-secondary">"{{ searchQuery }}"</span>
          {{ $t("search.relateContent") }}
        </p>
        <p class="title" v-else>
          共找到
          <span class="text-secondary">"{{ searchCountTotal }}"</span>
          {{ $t("search.courseCount") }}
          <span class="text-secondary">"{{ searchQuery }}"</span>
          {{ $t("search.relateCourse") }}
        </p>
      </div>
      <template v-if="!isSearchEmpty">
        <template v-if="searchArticleList.length">
          <h2 class="title">{{ $t("commons.read") }}</h2>
          <el-row class="article-list">
            <el-col :span="6" v-for="item in searchArticleList" :key="item.id">
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
          <p class="text-center more" v-if="searchArticleList.length < searchArticleCount">
            <a class="more-btn" @click="onClickMoreHandle(1)">{{ $t("search.displayMore") }}</a>
          </p>
        </template>
        <template v-if="searchVideoList.length">
          <h2 class="title">{{ $t("commons.video") }}</h2>
          <el-row class="video-list">
            <el-col :span="6" v-for="item in searchVideoList" :key="item.index">
              <router-link target="_blank" :to="{name: 'videoDetail', params: {id: item.id}}">
                <video-list-card class="video-list-card" :data="item"></video-list-card>
              </router-link>
            </el-col>
          </el-row>
          <p class="text-center more" v-if="searchVideoList.length < searchVideoCount">
            <a class="more-btn" @click="onClickMoreHandle(2)">{{ $t("search.displayMore") }}</a>
          </p>
        </template>
      </template>
      <div v-else class="empty-layer text-center">
        <img src="@/assets/img/search/search_empty.svg" />
        <p class="text-muted">{{ $t("commons.noRelateContent") }}</p>
      </div>
    </div>
  </container>
</template>

<script>
import {mapMutations, mapGetters} from "vuex";
import articleListCard from "@/components/articleCard/list";
import videoListCard from "@/components/videoListCard";
import * as api from "@/api/search";
import {formatDate} from "@/utils/mUtils";
import * as types from "@/store/types";

export default {
  data() {
    return {
      articleMoreShow: false,
      videoMoreShow: false,
      searchArticleList: [],
      searchVideoList: [],
      searchArticleCount: 0,
      searchArticleIndex: 1,
      searchVideoCount: 0,
      searchVideoIndex: 1,
      pageSize: 12,
      loading: true
    };
  },
  components: {
    articleListCard,
    videoListCard
  },
  watch: {
    searchQuery(value) {
      this.searchArticleIndex = 1;
      this.searchVideoIndex = 1;
      if (value) {
        this.onChangeSearchText(value);
      }
    }
  },
  mounted() {
    this.onChangeSearchText();
  },
  computed: {
    searchQuery() {
      return this.$route.params.query;
    },
    isSearchEmpty() {
      return this.searchArticleList.length === 0 && this.searchVideoList.length === 0;
    },
    searchCountTotal() {
      return this.searchArticleCount + this.searchVideoCount;
    }
  },
  methods: {
    getContent(page = 1, type = 3) {
      this.loading = true;
      return api.getSearchList({
        keyword: this.searchQuery,
        pageIndex: page,
        pageSize: 12,
        searchType: type
      });
    },
    onChangeSearchText() {
      this.getContent().then(res => {
        if (res.articleCourseModelList) {
          this.searchArticleList = res.articleCourseModelList.pageDatas || [];
          this.searchArticleCount = res.articleCourseModelList.rowCount;
        } else {
          this.searchArticleList = [];
          this.searchArticleCount = 0;
        }

        if (res.videoCourseModelList) {
          this.searchVideoList = res.videoCourseModelList.pageDatas || [];
          this.searchVideoCount = res.videoCourseModelList.rowCount;
        } else {
          this.searchVideoList = [];
          this.searchVideoCount = 0;
        }
        this.loading = false;
      });
    },
    onClickMoreHandle(type) {
      let page;
      if (type === 1) {
        page = this.searchArticleIndex = this.searchArticleIndex + 1;
      } else {
        page = this.searchVideoIndex = this.searchVideoIndex + 1;
      }
      this.getContent(page, type).then(res => {
        if (res.articleCourseModelList) {
          this.searchArticleList = this.searchArticleList.concat(res.articleCourseModelList.pageDatas);
        }
        if (res.videoCourseModelList) {
          this.searchVideoList = this.searchVideoList.concat(res.videoCourseModelList.pageDatas);
        }
      });
      this.loading = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/view/search/list.less";
</style>
