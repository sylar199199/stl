<template>
  <container class="buy-course-layer gray-bg">
    <user-panel activeIndex="0">
      <div class="buy-course-content">
        <default-tabs :list="menuList" :active-index="activeIndex" @change="onChangeTypeHandle"></default-tabs>
        <template v-if="activeIndex === 0">
          <el-row :gutter="20" class="content" v-loading="loading" v-if="articleList.length">
            <el-col :span="8" v-for="item in articleList" :key="item.title">
              <router-link v-if="item.state === 2" target="_blank" :to="{name: 'offLevel'}">
                <article-list-card
                  class="article-list-card"
                  :data="item"
                  width="296px"
                  height="104px"
                  coverWidth="62px"
                  coverHeight="80px"
                  textBoxFontSize="12px"
                  textFontSize="14px"
                  textBoxFontSizeEm="2em"
                  @onChangeCheck="onChangeItemCheckHandle"
                ></article-list-card>
              </router-link>
              <template v-else>
                <router-link
                  v-if="item.chapterCount === 1"
                  target="_blank"
                  :to="{name: 'chapterDetails', params: {articleId: item.courseId, chapterId: item.chapterId}}"
                >
                  <article-list-card
                    class="article-list-card"
                    :data="item"
                    width="296px"
                    height="104px"
                    coverWidth="62px"
                    coverHeight="80px"
                    textBoxFontSize="12px"
                    textFontSize="14px"
                    textBoxFontSizeEm="2em"
                    @onChangeCheck="onChangeItemCheckHandle"
                  >
                    <div class="text-muted text-xs" slot="info">
                      <span>{{ item.tagCount }}{{ $t("commons.KnowledgePoint") }}</span>
                    </div>
                  </article-list-card>
                </router-link>
                <router-link v-else target="_blank" :to="{name: 'articleInfo', params: {articleId: item.courseId}}">
                  <article-list-card
                    class="article-list-card"
                    :data="item"
                    width="296px"
                    height="104px"
                    coverWidth="62px"
                    coverHeight="80px"
                    textBoxFontSize="12px"
                    textFontSize="14px"
                    textBoxFontSizeEm="2em"
                    @onChangeCheck="onChangeItemCheckHandle"
                  >
                    <div class="text-muted text-xs" slot="info">
                      <span>{{ item.tagCount }}{{ $t("commons.KnowledgePoint") }}</span>
                    </div>
                  </article-list-card>
                </router-link>
              </template>
            </el-col>
          </el-row>
          <el-row v-else class="empty-content text-center">
            <img src="@/assets/img/icon/empty-content.svg" />
            <p>{{ $t("commons.noRelateContent") }}</p>
          </el-row>
        </template>
        <template v-else>
          <el-row :gutter="20" class="content" v-loading="loading" v-if="videoList.length">
            <el-col :span="8" v-for="item in videoList" :key="item.title">
              <router-link v-if="item.state === 2" target="_blank" :to="{name: 'offLevel'}">
                <video-list-card
                  class="video-list-card"
                  :data="item"
                  type="horizontal"
                  width="296px"
                  height="81px"
                  coverWidth="112px"
                  coverHeight="62px"
                  textFontSize="14px"
                  @onChangeCheck="onChangeItemCheckHandle"
                ></video-list-card>
              </router-link>
              <router-link target="_blank" v-else :to="{name: 'videoDetail', params: {id: item.courseId}}">
                <video-list-card
                  class="video-list-card"
                  :data="item"
                  type="horizontal"
                  width="296px"
                  height="81px"
                  coverWidth="112px"
                  coverHeight="62px"
                  textFontSize="14px"
                  @onChangeCheck="onChangeItemCheckHandle"
                ></video-list-card>
              </router-link>
            </el-col>
          </el-row>
          <el-row v-else class="empty-content text-center">
            <img src="@/assets/img/icon/empty-content.svg" />
            <p>{{ $t("commons.noRelateContent") }}</p>
          </el-row>
        </template>
        <el-row class="pagination-layer">
          <el-col :span="24">
            <pagination
              :page-total="pagination.total"
              :page-index="pagination.index"
              :page-size="pagination.size"
              @onCurrentChange="paginationChangeHandle"
              @onSizeChange="paginationChangeSizeHandle"
            ></pagination>
          </el-col>
        </el-row>
      </div>
    </user-panel>
  </container>
</template>

<script>
import userPanel from "@/layout/user/panel";
import defaultTabs from "@/components/defaultTabs";
import articleListCard from "@/components/articleCard/list";
import videoListCard from "@/components/videoListCard";
import pagination from "@/components/pagination";
import * as api from "@/api/user";
import {formatDate} from "@/utils/mUtils";

export default {
  name: "buyCourse",
  components: {
    userPanel,
    defaultTabs,
    articleListCard,
    videoListCard,
    pagination
  },
  data() {
    return {
      menuList: this.$t("commons.menuList"),
      articleList: [],
      videoList: [],
      pagination: {
        index: 1,
        size: 8,
        total: 0
      },
      loading: false,
      isEdit: false
    };
  },
  watch: {
    activeIndex(value) {
      this.pagination.index = 1;
      this.getContentList(); //tabs切换更新列表
    },
    isEdit(value) {
      if (this.isArticle) {
        this.articleList.forEach(item => {
          item.isEdit = value;
        });
      } else {
        this.videoList.forEach(item => {
          item.isEdit = value;
        });
      }
    }
  },
  created() {
    this.getContentList();
  },
  mounted() {},
  computed: {
    isArticle() {
      return this.activeIndex === 0;
    },
    isAllChecked() {
      if (this.isArticle) {
        return this.articleList.every(item => {
          return item.isChecked;
        });
      } else {
        return this.videoList.every(item => {
          return item.isChecked;
        });
      }
    },
    isAllCheckedText() {
      return this.isAllChecked ? "全部取消" : this.$t("buyCourse.selectAll");
    },
    activeIndex: {
      get() {
        return Number(this.$route.query.type) || 0;
      },
      set(val) {
        this.$router.push({name: "buyCourse", query: {type: val}});
      }
    }
  },
  methods: {
    getContentList(pageIndex = 1, pageSize = 16) {
      this.loading = true;
      if (this.isArticle) {
        api
          .alreadyBoughtCourseList({
            courseType: 1,
            pageIndex,
            pageSize
          })
          .then(res => {
            this.articleList = res.map(item => {
              item.createTime = formatDate(item.createTime, "YYYY-MM-DD");
              item.isEdit = false;
              item.isChecked = false;
              item.title = item.courseName;
              return item;
            });
            this.pagination.total = res.rowCount;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        api
          .alreadyBoughtCourseList({
            courseType: 2,
            pageIndex,
            pageSize
          })
          .then(res => {
            this.videoList = res.map(item => {
              item.createTime = formatDate(item.createTime, "YYYY-MM-DD");
              item.isEdit = false;
              item.isChecked = false;
              item.title = item.courseName; //课程名称
              return item;
            });
            this.pagination.total = res.rowCount;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    onChangeTypeHandle(value) {
      this.activeIndex = value;
    },
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getContentList(this.pagination.index, this.pagination.size);
    },
    paginationChangeSizeHandle(size) {
      this.pagination.size = size;
      this.getContentList(this.pagination.index, this.pagination.size);
    },
    onChangeItemCheckHandle(item) {
      item.isChecked = !item.isChecked;
    },
    onAllItemCheckedHandle() {
      let isAllChecked = this.isAllChecked; //判断是否全部选择来取消选择
      if (this.isArticle) {
        this.articleList.forEach(item => {
          item.isChecked = !isAllChecked;
        });
      } else {
        this.videoList.forEach(item => {
          item.isChecked = !isAllChecked;
        });
      }
    },
    onClickDelCollectionHandle() {
      let delId;
      if (this.isArticle) {
        delId = this.articleList.filter(item => item.isChecked).map(item => item.id); //筛选出勾选的收藏
      } else {
        delId = this.videoList.filter(item => item.isChecked).map(item => item.id);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.buy-course-layer {
  .buy-course-content {
    .content {
      padding: 20px;

      .article-list-card,
      .video-list-card {
        margin: 0 0 20px;
      }
    }

    .empty-content {
      color: @global-muted2;
      margin: 30px 0;
    }
  }
}
</style>
