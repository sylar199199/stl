<template>
  <container class="article-introduce-layer">
    <div class="container">
      <div v-show="pageShow" class="content">
        <el-row class="article-info-layer">
          <el-col :span="6">
            <div class="article-card-layer">
              <article-card-cover :data="article" text-box-font-size="30px" letter-spacing="8px"></article-card-cover>
            </div>
          </el-col>
          <el-col :span="18">
            <h2 class="title">{{ article.title }}</h2>
            <el-row class="article-info">
              <el-col :span="3">
                <img class="vertical-align-middle eye-icon" src="@/assets/img/icon/eye.svg" />
                <span class="vertical-align-middle">{{ article.readingCount | formatNumToThousand }}</span>
              </el-col>
              <el-col :span="21">
                <key-word-tag :list="article.tags"></key-word-tag>
              </el-col>
              <el-col class="introduce text-muted" :span="24">
                <content-abstract
                  :content="article.summary"
                  :count="article.chapterCount"
                  :name="$t('article.chapter')"
                ></content-abstract>
              </el-col>
              <el-col :span="8">
                <favorite
                  name="articleFavoriteList"
                  :id="article.id"
                  :is-favorite="article.collected"
                  @handleFavorite="onChangeFavoriteStatus"
                ></favorite>
                <shareIcon
                  class="share-icon"
                  :shareUrl="webShareUrl"
                  :shareWeiXinUrl="shareWeiXinUrl"
                  :dialogVisible="shareDialogVisible"
                  :shareTitle="shareTitle"
                  :shareType="shareType"
                  :isFree="article.free"
                  :pic-url="article.imageUrl"
                  :isBought="!article.free && article.bought"
                  @changeDialogVisible="onChangeShareDialogVisibleHandle"
                ></shareIcon>
              </el-col>
              <el-col :span="10">
                <huidou-layer
                  v-if="!article.free && !article.bought"
                  :price="article.realBeanAmount"
                  :discount="article.virtualBeanAmount"
                ></huidou-layer>
              </el-col>
              <el-col :span="6" class="text-right">
                <el-button
                  v-if="!article.free && !article.bought"
                  @click="onClickBuyHandle"
                  class="btn-block text-lg"
                  type="primary"
                  round
                >
                  {{ $t("article.purchase") }}
                </el-button>
                <el-button v-else @click="onClickStartReadding" class="btn-block text-lg" type="primary" round>
                  {{ $t("commons.startReadding") }}
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div class="article-chapter-layer">
          <h2>{{ $t("article.articleDirectory") }}</h2>
          <ul :style="{height: chapterMoreShow ? 'auto' : '730px'}">
            <router-link
              v-for="(item, index) in article.chapterList"
              :key="item.id"
              target="_blank"
              :to="{name: 'chapterDetails', params: {chapterId: item.id, articleId: item.courseId}}"
            >
              <li @click="gotoChapterDetails()">
                {{ $t("article.chapter") }} {{ index + 1 }}&nbsp;{{ item.chapterName }}
                <icon-svg
                  class="favorite-icon fr"
                  icon-class="icon-suo"
                  v-show="!item.free && !article.bought"
                ></icon-svg>
                <icon-svg
                  class="favorite-icon fr"
                  icon-class="icon-tag"
                  v-show="(article.bought || item.free) && item.addedBookmark"
                ></icon-svg>
              </li>
            </router-link>
          </ul>
          <div
            v-if="this.chapterList.length > 12 && !chapterMoreShow"
            class="more-btn text-center text-lg"
            @click="chapterMoreShow = true"
          >
            {{ $t("article.moreChapter") }}
          </div>
        </div>
      </div>
    </div>
    <product-channel-dialog
      class="product-channel"
      :objId="Number(articleId)"
      :dialogVisible="productChannelDialogVisible"
      :visible.sync="productChannelDialogVisible"
      @changeDialogVisible="onChangeShareChannelDialogVisibleHandle"
    ></product-channel-dialog>
  </container>
</template>

<script>
import articleCardCover from "@/components/articleCard/cover";
import favorite from "@/components/favorite";
import shareIcon from "@/components/share/icon";
import huidouLayer from "@/components/huidou/layer";
import keyWordTag from "@/components/share/keyWordTag";
import contentAbstract from "@/components/contentAbstract";
import * as api from "@/api/article";
import * as types from "@/store/types";
import {setStore, getStore, formatNumToThousand} from "@/utils/mUtils";
import {mapGetters, mapMutations} from "vuex";
import {setLabelTitle, setShareMeta} from "@/utils/mUtils";
import productChannelDialog from "@/components/productChannelDialog";
import {webSharePage, H5bSharePage, H5bArticleInfoPage} from "@/utils/env";
import * as commonAPI from "@/api/common";

let favoriteList = getStore("articleFavoriteList") || [];
export default {
  name: "info",
  components: {
    favorite,
    shareIcon,
    articleCardCover,
    huidouLayer,
    keyWordTag,
    contentAbstract,
    productChannelDialog
  },
  data() {
    return {
      pageShow: false,
      article: {},
      chapterList: [],
      articleMoreShow: false,
      chapterMoreShow: false,
      shareDialogVisible: false,
      productChannelDialogVisible: false,
      shareType: ""
    };
  },
  computed: {
    ...mapGetters(["userAvatar", "userName", "userUid", "currentLanguage"]),
    articleId() {
      return this.$route.params.articleId;
    },
    shareTitle() {
      return this.article.title;
    },
    webShareUrl() {
      return this.shareType === 2
        ? `${webSharePage}?fromUid=${this.userUid}&objId=${this.articleId}&type=1&langId=${this.currentLanguage}` //web端分享活动地址
        : `${window.location.href}?langId=${this.currentLanguage}`; //web端文章详情地址
    },
    shareWeiXinUrl() {
      return this.shareType === 2
        ? `${H5bSharePage}?objId=${this.articleId}&fromUid=${this.userUid}&type=1&langId=${this.currentLanguage}` //h5分享活动地址
        : `${H5bArticleInfoPage}?langId=${this.currentLanguage}&id=${this.articleId}`; //h5文章详情地址
    }
  },
  filters: {
    formatNumToThousand
  },
  mounted() {
    this.getArticleInfo();
  },
  methods: {
    ...mapMutations([types.SET_ARTICLE_CHAPTERLIST, types.SET_LOGIN_DIALOG_VISIBLE]),
    // 查询章节详情
    getArticleInfo() {
      let favoriteObj = {};
      favoriteList.forEach(item => {
        //取到所有标记收藏的id，判断是否被收藏
        favoriteObj[item.id] = true;
      });
      api
        .getArticleInfo({id: this.articleId})
        .then(res => {
          setLabelTitle(res.title); //设置标签页title
          this.article = res;
          this.chapterList = res.chapterList;
          this.article.chapterList = res.chapterList.map(item => {
            item.isFavorite = favoriteObj[item.id] ? true : false; //判断localStorage是否收藏id
            return item;
          });
          setShareMeta(this.webShareUrl, this.article.title, this.article.summary, this.article.imageUrl); //设置分享meta
          this.pageShow = true;
          this.addReadingCount();
        })
        .catch(res => {
          if (res.subCode === "320B202") {
            this.$router.push({name: "offLevel"});
          } else {
            this.pageShow = true;
            this.$dialog.alert(res.message, () => {
              this.$router.push({name: "home"});
            });
          }
        });
    },

    onClickFavoriteHandle(item) {
      if (item.isFavorite) {
        //取消收藏
        let index = favoriteList.findIndex(list => {
          return item.id === list.id;
        });
        favoriteList.splice(index, 1);
      } else {
        favoriteList.push({id: item.id});
      }
      item.isFavorite = !item.isFavorite;
      setStore("articleFavoriteList", favoriteList); //更新本地存储
    },
    onChangeShareDialogVisibleHandle(visible) {
      this.shareType = 1;
      this.shareDialogVisible = visible;
    },
    onChangeShareChannelDialogVisibleHandle(visible) {
      this.shareType = 2;
      this.shareDialogVisible = visible;
    },
    gotoChapterDetails() {
      this[types.SET_ARTICLE_CHAPTERLIST](this.chapterList);
    },
    onChangeFavoriteStatus(status) {
      this.article.collected = status === "success" ? true : false;
    },
    onClickBuyHandle() {
      //点击购买
      if (this.userUid > 0) {
        this.productChannelDialogVisible = true;
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true); //显示登录框
      }
    },
    onClickStartReadding() {
      //开始阅读
      this.$router.push({
        name: "chapterDetails",
        params: {chapterId: this.chapterList[0].id, articleId: this.article.id}
      });
    },
    addReadingCount() {
      //添加播放记录
      commonAPI
        .addReadingCount({
          courseType: 1,
          id: this.articleId
        })
        .then(res => {})
        .catch(res => {});
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/view/article/info.less";
</style>
