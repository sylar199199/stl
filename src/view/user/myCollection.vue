<template>
  <container class="my-collection-layer gray-bg">
    <user-panel activeIndex="1">
      <el-row>
        <el-col :span="12">
          <default-tabs :list="menuList" :active-index="activeIndex" @change="onChangeTypeHandle"></default-tabs>
        </el-col>
        <el-col :span="12">
          <el-input
            size="small"
            class="search-input-collection fr"
            placeholder="搜索"
            v-model="searchText"
            @focus="showEnter = true"
            @blur="showEnter = false"
            @keyup.native.enter="onSearchEnterHandle()"
          >
            <img slot="prefix" src="@/assets/icon/navibar-search.svg" class="vertical-align-middle" />
            <img
              v-show="searchText.length"
              @click="onSearchEnterHandle()"
              slot="suffix"
              src="@/assets/icon/navibar-enter.svg"
              class="vertical-align-middle pointer"
            />
          </el-input>
        </el-col>
      </el-row>
      <!--文章-->
      <el-row class="my-collection-content">
        <template v-if="activeIndex === 0">
          <div v-show="articleList.length" @click="handleEdit()" class="text-primary2 text-right is-edit">
            {{ isEdit ? $t("commons.determineBtn") : $t("commons.edit") }}
          </div>
          <el-row :gutter="20" class="content" v-loading="loading" v-if="articleList.length">
            <el-col :span="8" v-for="item in articleList" :key="item.title">
              <template v-if="isEdit">
                <article-list-card
                  class="article-list-card"
                  :data="item"
                  width="296px"
                  height="104px"
                  coverWidth="62px"
                  coverHeight="80px"
                  textFontSize="14px"
                  textBoxFontSize="12px"
                  textBoxFontSizeEm="2em"
                  :is-edit="isEdit"
                  @handleFavorite="onChangeFavoriteStatus"
                  @onChangeCheck="onChangeItemCheckHandle"
                >
                  <div class="text-muted text-xs" slot="info">
                    <span>{{ item.tagCount }}{{ $t("commons.KnowledgePoint") }}</span>
                  </div>
                </article-list-card>
              </template>
              <template v-else>
                <router-link v-if="item.state === 2" target="_blank" :to="{name: 'offLevel'}">
                  <article-list-card
                    class="article-list-card"
                    :data="item"
                    width="296px"
                    height="104px"
                    coverWidth="62px"
                    coverHeight="80px"
                    textFontSize="14px"
                    textBoxFontSize="12px"
                    textBoxFontSizeEm="2em"
                    :is-edit="isEdit"
                    @handleFavorite="onChangeFavoriteStatus"
                    @onChangeCheck="onChangeItemCheckHandle"
                  >
                    <div class="text-muted text-xs" slot="info"></div>
                  </article-list-card>
                </router-link>
                <template v-else>
                  <router-link
                    v-if="item.chapterCount === 1"
                    target="_blank"
                    :to="{name: 'chapterDetails', params: {articleId: item.id, chapterId: item.chapterId}}"
                  >
                    <article-list-card
                      class="article-list-card"
                      :data="item"
                      width="296px"
                      height="104px"
                      coverWidth="62px"
                      coverHeight="80px"
                      textFontSize="14px"
                      textBoxFontSize="12px"
                      textBoxFontSizeEm="2em"
                      :is-edit="isEdit"
                      @handleFavorite="onChangeFavoriteStatus"
                      @onChangeCheck="onChangeItemCheckHandle"
                    >
                      <div class="text-muted text-xs" slot="info">
                        <span>{{ item.tagCount }}{{ $t("commons.KnowledgePoint") }}</span>
                      </div>
                    </article-list-card>
                  </router-link>
                  <router-link v-else target="_blank" :to="{name: 'articleInfo', params: {articleId: item.id}}">
                    <article-list-card
                      class="article-list-card"
                      :data="item"
                      width="296px"
                      height="104px"
                      coverWidth="62px"
                      coverHeight="80px"
                      textFontSize="14px"
                      textBoxFontSize="12px"
                      textBoxFontSizeEm="2em"
                      :is-edit="isEdit"
                      @handleFavorite="onChangeFavoriteStatus"
                      @onChangeCheck="onChangeItemCheckHandle"
                    >
                      <div class="text-muted text-xs" slot="info">
                        <span>{{ item.tagCount }}{{ $t("commons.KnowledgePoint") }}</span>
                      </div>
                    </article-list-card>
                  </router-link>
                </template>
              </template>
            </el-col>
          </el-row>
          <el-row v-else class="empty-content text-center">
            <img src="@/assets/img/icon/empty-content.svg" />
            <p>{{ $t("commons.noRelateContent") }}</p>
          </el-row>
        </template>
        <!--视频-->
        <template v-else>
          <div v-show="videoList.length" @click="handleEdit" class="text-primary2 text-right is-edit">
            {{ isEdit ? $t("commons.determineBtn") : $t("myCollection.edit") }}
          </div>
          <el-row :gutter="20" class="content" v-loading="loading" v-if="videoList.length">
            <el-col :span="8" v-for="item in videoList" :key="item.title">
              <template v-if="isEdit">
                <video-list-card
                  class="video-list-card"
                  type="horizontal"
                  :data="item"
                  width="296px"
                  height="81px"
                  coverWidth="112px"
                  coverHeight="62px"
                  textFontSize="14px"
                  :is-edit="isEdit"
                  @handleFavorite="onChangeFavoriteStatus"
                  @onChangeCheck="onChangeItemCheckHandle"
                ></video-list-card>
              </template>
              <template v-else>
                <router-link target="_blank" :to="{name: 'videoDetail', params: {id: item.id}}">
                  <video-list-card
                    class="video-list-card"
                    type="horizontal"
                    :data="item"
                    width="296px"
                    height="81px"
                    coverWidth="112px"
                    coverHeight="62px"
                    textFontSize="14px"
                    :is-edit="isEdit"
                    @handleFavorite="onChangeFavoriteStatus"
                    @onChangeCheck="onChangeItemCheckHandle"
                  ></video-list-card>
                </router-link>
              </template>
            </el-col>
          </el-row>
          <el-row v-else class="empty-content text-center">
            <img src="@/assets/img/icon/empty-content.svg" />
            <p>{{ $t("commons.noRelateContent") }}</p>
          </el-row>
        </template>
        <el-row class="pagination-layer">
          <el-col :span="24" v-show="!isEdit">
            <pagination
              :page-total="pagination.total"
              :page-index="pagination.index"
              :page-size="pagination.size"
              @onCurrentChange="paginationChangeHandle"
            ></pagination>
          </el-col>
          <el-col :span="24" class="text-center footer-button">
            <template v-if="isEdit && (articleList.length || videoList.length)">
              <el-button @click="onAllItemCheckedHandle" class="edit-hover">{{ isAllCheckedText }}</el-button>
              <el-button
                type="warning"
                @click="cancelFavorite()"
                :disabled="checkCount === 0"
                class="cancel-collection el-button-left"
              >
                {{ $t("myCollection.cancelFavor") }} ({{ checkCount }})
              </el-button>
            </template>
            <default-confirm
              class="cancel-favorite-dialog"
              :title="$t('myCollection.confirmCancelFavor')"
              :dialogVisible="cancleFavoriteDialog"
              @confirm="handleClose"
              :closeModal="false"
            >
              <span class="center text-center">
                {{ $t("myCollection.sureToCancelFavor") }}{{ checkCount }}{{ $t("myCollection.conentcoubnt") }}
              </span>
            </default-confirm>
          </el-col>
        </el-row>
      </el-row>
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
import * as apiCom from "@/api/common";
import defaultConfirm from "@/components/dialog/defaultConfirm";
import {setStore, getStore} from "@/utils/mUtils";
import {mapGetters, mapMutations} from "vuex";
import * as types from "@/store/types";

export default {
  name: "myCollection",
  components: {
    userPanel,
    defaultTabs,
    articleListCard,
    videoListCard,
    pagination,
    defaultConfirm
  },
  data() {
    return {
      menuList: this.$t("commons.menuList"),
      articleList: [],
      videoList: [],
      searchText: "",
      pagination: {
        index: 1,
        size: 18,
        total: 0
      },
      loading: false,
      isEdit: false,
      cancleFavoriteDialog: false,
      articleFavoriteList: null,
      templateCancleIds: []
    };
  },
  watch: {
    activeIndex(value) {
      this.searchText = "";
      this.pagination.index = 1;
      this.isEdit = false;
      this.getContentList(this.pagination.index, this.pagination.size); //tabs切换更新列表
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
      return this.isAllChecked ? "全不选" : "全选";
    },
    isAllCollection() {
      return this.isAllCheckedText == "全选" ? true : false;
    },
    currentItem() {
      if (this.isArticle) {
        return this.articleList;
      }
      return this.videoList;
    },
    checkCount() {
      let count = 0;
      this.currentItem.forEach(item => {
        if (item.isChecked === true) {
          count++;
        }
      });
      return count;
    },
    currentCancelItem() {
      return this.currentItem.filter(item => {
        if (item.isChecked) {
          return true;
        }
      });
    },
    activeIndex: {
      get() {
        return Number(this.$route.query.type) || 0;
      },
      set(val) {
        this.$router.push({name: "myCollection", query: {type: val}});
      }
    }
  },
  methods: {
    ...mapMutations([types.SET_FAVORITE_LIST]),
    getContentList(pageIndex = 1) {
      this.loading = true;
      if (this.isArticle) {
        api
          .getMyCollection({
            objType: 1,
            pageIndex,
            pageSize: this.pagination.size
          })
          .then(res => {
            this.articleList = res.pageDatas.map(item => {
              item.isEdit = true;
              item.isChecked = false;
              item.collected = true;
              return item;
            });
            this.pagination.total = res.rowCount;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        api
          .getMyCollection({
            objType: 2,
            pageIndex,
            pageSize: this.pagination.size
          })
          .then(res => {
            this.videoList = res.pageDatas.map(item => {
              item.isEdit = false;
              item.isChecked = false;
              item.collected = true;
              return item;
            });
            this.pagination.total = res.rowCount;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    // 刷新收藏列表
    handleClose(param) {
      if (param) {
        let collectionIds = this.currentCancelItem.map(item => {
          return item.collectionId;
        });
        apiCom.delBatchFavorite({collectionIds: collectionIds.join(",")}).then(res => {
          this.getContentList();
          this.$message({
            message: "取消收藏成功",
            type: "success"
          });
          this.isEdit = !this.isEdit;
          this.cancleFavoriteDialog = false;
        });
      }
      this.cancleFavoriteDialog = false;
    },
    handleEdit() {
      if (this.isEdit) {
        this.searchText = "";
        apiCom.delBatchFavorite({collectionIds: this.templateCancleIds.join(",")}).then(res => {
          this.getContentList();
        });
      }
      this.isEdit = !this.isEdit;
    },
    cancelFavorite() {
      this.isEdit = true;
      this.cancleFavoriteDialog = true;
    },
    onChangeTypeHandle(val) {
      this.activeIndex = val;
    },
    paginationChangeHandle(page) {
      this.pagination.index = page;
      if (this.searchText === "") {
        this.getContentList(this.pagination.index);
      } else {
        this.onSearchEnterHandle(this.pagination.index);
      }
    },
    onChangeItemCheckHandle(item) {
      item.isChecked = !item.isChecked;
    },
    onAllItemCheckedHandle() {
      let isAllChecked = this.isAllChecked; //判断是否全部选择来取消选择
      this.currentItem.forEach(item => {
        item.isChecked = !isAllChecked;
      });
    },
    onClickDelCollectionHandle() {
      let delId;
      if (this.isArticle) {
        delId = this.articleList.filter(item => item.isChecked).map(item => item.id); //筛选出勾选的收藏
      } else {
        delId = this.videoList.filter(item => item.isChecked).map(item => item.id);
      }
    },
    onChangeFavoriteStatus(params) {
      //改版收藏状态和编辑状态
      if (params.status === "success") {
        params.item.collected = true;
        this.templateCancleIds.splice(this.templateCancleIds.indexOf(params.item.collectionId), 1);
      } else {
        params.item.collected = false;
        params.item.isChecked = false; //取消收藏则取消选中状态
        this.templateCancleIds.push(params.item.collectionId);
      }
      params.item.isEdit = params.status === "success" ? true : false;
    },
    onSearchEnterHandle(pageIndex = 1) {
      if (this.isArticle) {
        apiCom
          .getSearchCollectionList({
            keyword: this.searchText,
            objType: 1,
            pageIndex,
            pageSize: this.pagination.pageSize
          })
          .then(res => {
            this.articleList = res.pageDatas.map(item => {
              item.isEdit = true;
              item.isChecked = false;
              item.collected = true;
              return item;
            });
            this.pagination.total = res.rowCount;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        apiCom
          .getSearchCollectionList({
            keyword: this.searchText,
            objType: 2,
            pageIndex,
            pageSize: this.pagination.pageSize
          })
          .then(res => {
            this.videoList = res.pageDatas.map(item => {
              item.isEdit = true;
              item.isChecked = false;
              item.collected = true;
              return item;
            });
            this.pagination.total = res.rowCount;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.my-collection-layer {
  ::v-deep.search-input-collection {
    width: 168px;
    height: 65px;
    line-height: 65px;
    margin-right: 32px;
    .el-input__prefix,
    .el-input__suffix {
      height: 65px;
      line-height: 65px;
    }
    .el-input__inner {
      border-radius: 18px;
      height: 36px;
      border: none;
      padding-left: 35px;
      background-color: @gray-bg-color;
    }
    .svg-icon {
      margin: 5px 0 0;
    }
  }

  ::v-deep .my-collection-content {
    .is-edit {
      position: relative;
      margin-top: 20px;
      margin-right: 32px;
      margin-left: auto;
      cursor: pointer;
    }

    .content {
      padding: 13px;

      .article-list-card,
      .video-list-card {
        margin: 0 0 20px;
      }
    }

    .empty-content {
      color: @global-muted2;
      margin: 30px 0;
    }

    .el-button {
      width: 164px;
      height: 40px;
      border-radius: 20px;
      margin-bottom: 25px;
    }

    .el-button-left {
      margin-left: 24px;
    }

    .edit-hover {
      &:hover {
        border-color: @global-primary2;
        background-color: @white;
      }
    }
  }
}
</style>
