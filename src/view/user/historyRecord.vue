<template>
  <container class="history-record-layer gray-bg">
    <user-panel activeIndex="5">
      <div class="history-record-content">
        <default-tabs :list="menuList" :active-index="activeIndex" @change="onChangeTypeHandle"></default-tabs>
        <el-row :gutter="20" class="content" v-loading="loading">
          <template v-if="activeIndex === 0">
            <el-row v-if="articleList.length">
              <el-col :span="8" v-for="item in articleList" :key="item.courseId">
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
                    coverWidth="64px"
                    coverHeight="80px"
                    textFontSize="14px"
                    textBoxFontSize="12px"
                    textBoxFontSizeEm="2em"
                  >
                    <div class="text-muted text-xs" slot="info">
                      <div class="text-muted">
                        <span>{{ item.tagCount }}{{ $t("commons.KnowledgePoint") }}</span>
                        <div class="fr">
                          <span>{{ item.updateTime | formatTimeDay }}</span>
                        </div>
                      </div>
                    </div>
                  </article-list-card>
                </router-link>
                <router-link v-else target="_blank" :to="{name: 'articleInfo', params: {articleId: item.courseId}}">
                  <article-list-card
                    class="article-list-card"
                    :data="item"
                    width="296px"
                    height="104px"
                    coverWidth="64px"
                    coverHeight="80px"
                    textFontSize="14px"
                    textBoxFontSize="12px"
                    textBoxFontSizeEm="2em"
                  >
                    <div class="text-muted text-xs" slot="info">
                      <div class="text-muted">
                        <span>{{ item.tagCount }}{{ $t("commons.KnowledgePoint") }}</span>
                        <div class="fr">
                          <span>{{ item.updateTime | formatTimeDay }}</span>
                        </div>
                      </div>
                    </div>
                  </article-list-card>
                </router-link>
              </el-col>
            </el-row>
            <el-row v-else class="empty-content text-center">
              <img src="@/assets/img/icon/empty-content.svg" />
              <p>{{ $t("commons.noRelateContent") }}</p>
            </el-row>
          </template>
          <template v-else>
            <el-row v-if="videoList.length">
              <el-col :span="8" v-for="item in videoList" :key="item.courseId">
                <router-link target="_blank" :to="{name: 'videoDetail', params: {id: item.courseId}}">
                  <video-list-card
                    class="video-list-card"
                    :data="item"
                    type="horizontal"
                    width="296px"
                    height="81px"
                    coverWidth="112px"
                    coverHeight="64px"
                    textFontSize="14px"
                  >
                    <div class="text-muted text-xs" slot="info">
                      <div class="text-muted">
                        <span>{{ item.tagCount }}{{ $t("commons.KnowledgePoint") }}</span>
                        <div class="fr">
                          <span>{{ item.updateTime | formatTimeDay }}</span>
                        </div>
                      </div>
                    </div>
                  </video-list-card>
                </router-link>
              </el-col>
            </el-row>
            <el-row v-else class="empty-content text-center">
              <img src="@/assets/img/icon/empty-content.svg" />
              <p>{{ $t("commons.noRelateContent") }}</p>
            </el-row>
          </template>
        </el-row>
        <el-row class="pagination-layer">
          <el-col :span="24">
            <pagination
              :page-total="pagination.total"
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
import {formatTimeDay} from "@/utils/mUtils";

export default {
  name: "historyRecord",
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
        size: 21,
        total: 0
      },
      loading: false
    };
  },
  filters: {
    formatTimeDay
  },
  watch: {
    activeIndex(value) {
      this.pagination.index = 1;
      this.getContentList(this.pagination.index, this.pagination.size); //tabs切换更新列表
    }
  },
  created() {
    this.getContentList();
  },
  computed: {
    isArticle() {
      return this.activeIndex === 0;
    },
    activeIndex: {
      get() {
        return Number(this.$route.query.type) || 0;
      },
      set(val) {
        this.$router.push({name: "historyRecord", query: {type: val}});
      }
    }
  },
  methods: {
    getContentList(pageIndex = 1, pageSize = 21) {
      this.loading = true;
      if (this.isArticle) {
        api
          .getMyLearnHistory({
            courseType: 1,
            pageIndex,
            pageSize
          })
          .then(res => {
            this.articleList = res.pageDatas;
            this.pagination.total = res.rowCount;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        api
          .getMyLearnHistory({
            courseType: 2,
            pageIndex,
            pageSize
          })
          .then(res => {
            this.videoList = res.pageDatas;
            this.pagination.total = res.rowCount;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    onChangeTypeHandle(index) {
      this.activeIndex = index;
    },
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getContentList(this.pagination.index, this.pagination.size);
    },
    paginationChangeSizeHandle(size) {
      this.pagination.size = size;
      this.getContentList(pagination.index, this.pagination.size);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.history-record-layer {
  ::v-deep .collection-search-input {
    width: 200px;
    margin: 20px 0 0;

    .svg-icon {
      margin: 5px 0 0;
    }
  }

  .history-record-content {
    .content {
      padding: 20px;

      .article-list-card,
      .video-list-card {
        margin: 0 0 20px;
      }

      .empty-content {
        color: @global-muted2;
        margin: 30px 0;
      }
    }
  }
}
</style>
