<template>
  <container class="article-chapter-details-layer">
    <head-nav slot="headNav">
      <top-menu slot="toolsMenu">
        <book-mark
          slot="rightMenu"
          :chapterId="parseInt(chapterId)"
          :courseId="bookMarkId"
          :addedBookmark="chapterInfo.addedBookmark"
          @handleBookmark="onChangeBookmarkStatus"
        ></book-mark>
      </top-menu>
    </head-nav>
    <div class="article-content-layer">
      <div class="container">
        <div class="content">
          <h2 class="chapter-title">章节{{ chapterIndex + 1 }} &nbsp;{{ chapterInfo.chapterName }}</h2>
          <p v-if="isFree" v-html="chapterInfo.content"></p>
          <p v-else v-html="chapterInfo.content" :style="{height: `${windowHeight - 400}px`, overflow: 'hidden'}"></p>
          <div class="gradient-layer" v-show="!isFree"></div>
        </div>
        <div class="text-center footer-button" :style="{marginTop: '35px'}">
          <el-row v-show="!isFree">
            <el-button type="primary" class="buy-course-btn" @click="onClickBuyHandle()">
              <span>{{ $t("article.purchaseAll") }}</span>
            </el-button>
          </el-row>
          <el-row>
            <el-button class="next-button" @click="nextChapter()" :disabled="nextDisabled">
              <span v-if="nextDisabled" :style="{color: '#e0e1e2'}">已是最后一章</span>
              <span v-else>{{ $t("article.nextPage") }}</span>
            </el-button>
            <shareIcon
              class="share-icon"
              :shareUrl="webShareUrl"
              :shareTitle="shareTitle"
              :shareType="shareType"
              :shareWeiXinUrl="shareWeiXinUrl"
              :dialogVisible="shareDialogVisible"
              :pic-url="article.imageUrl"
              right="-30px"
              @changeDialogVisible="onChangeShareDialogVisibleHandle"
            >
              <span
                slot="freeGet"
                v-if="!isFree"
                class="free-get-icon text-xs text-center fr"
                :style="{right: '-30px'}"
              >
                {{ $t("share.freeGet") }}
              </span>
            </shareIcon>
          </el-row>
        </div>
      </div>
    </div>
    <template v-slot:rightMenu>
      <right-menu
        v-show="rightMenuVisible"
        ref="rightMenuLayer"
        class="right-menu-layer"
        :style="{left: rightMenuPosition.left, bottom: rightMenuPosition.bottom}"
      >
        <div class="right-menu-class">
          <el-popover
            slot="reference"
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="上一章"
          >
            <i
              slot="reference"
              class="el-icon-arrow-left vertical-align-middle center img-margin"
              :class="{'disabled-color': backDisabled}"
              @click="backChapter()"
            ></i>
          </el-popover>
          <el-popover
            slot="reference"
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            :content="$t('article.tableContent')"
          >
            <img
              slot="reference"
              class="vertical-align-middle center img-margin"
              src="@/assets/icon/directory-normal.svg"
              @click="showDirectory = true"
            />
          </el-popover>
          <el-popover
            slot="reference"
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="下一章"
          >
            <i
              slot="reference"
              class="el-icon-arrow-right vertical-align-middle center"
              :class="{'disabled-color': nextDisabled}"
              @click="nextChapter()"
            ></i>
          </el-popover>
        </div>
      </right-menu>
    </template>
    <el-dialog
      class="chapter-directory-dialog"
      :show-close="false"
      :append-to-body="true"
      :visible.sync="showDirectory"
      width="560px"
      :style="{height: `${windowHeight}px`}"
    >
      <article-list-card
        class="article-list-card"
        :data="article"
        width="480px"
        height="144px"
        coverWidth="100px"
        coverHeight="120px"
        rightBoxTextWidth="240px"
      ></article-list-card>
      <ul class="scroll-bar" :style="{height: `${windowHeight - 232}px`}">
        <li
          v-for="(item, index) in chapterList"
          :key="item.id"
          @click="changeDirectory(item)"
          :class="{'active-color': chapterId == item.id}"
        >
          {{ $t("article.chapter") }} {{ index + 1 }}&nbsp;{{ item.chapterName }}
          <icon-svg class="favorite-icon fr" icon-class="icon-suo" v-if="item.isFavorite"></icon-svg>
        </li>
      </ul>
    </el-dialog>
    <product-channel-dialog
      class="product-channel"
      :objId="articleId"
      :dialogVisible="productChannelDialogVisible"
      :visible.sync="productChannelDialogVisible"
      @changeDialogVisible="onChangeShareChannelDialogVisibleHandle"
    ></product-channel-dialog>
  </container>
</template>
<script>
import * as api from "@/api/article";
import * as apiHistory from "@/api/user";
import shareIcon from "@/components/share/icon";
import rightMenu from "@/layout/rightMenu";
import headNav from "@/layout/headNav";
import bookMark from "@/components/bookmark";
import topMenu from "@/layout/topMenu";
import {mapGetters, mapMutations} from "vuex";
import * as types from "@/store/types";
import articleListCard from "@/components/articleCard/list";
import {setLabelTitle} from "@/utils/mUtils";
import productChannelDialog from "@/components/productChannelDialog";
import {webSharePage, H5bSharePage, H5bArticleDetailPage} from "@/utils/env";

export default {
  components: {
    headNav,
    shareIcon,
    rightMenu,
    bookMark,
    topMenu,
    articleListCard,
    productChannelDialog
  },
  data() {
    return {
      shareTitle: "",
      shareDialogVisible: false,
      windowHeight: 0,
      article: {},
      chapterInfo: {},
      chapterList: [],
      rightMenuVisible: false,
      showDirectory: false,
      rightMenuPosition: {
        left: 0,
        bottom: "80px"
      },
      bookMarkId: 0,
      productChannelDialogVisible: false,
      shareType: ""
    };
  },
  async created() {
    await this.getArticleInfo();
    this.getArticleChapterDetails();
  },
  computed: {
    ...mapGetters(["userUid", "currentLanguage"]),
    articleId() {
      return Number(this.$route.params.articleId);
    },
    chapterId() {
      return Number(this.$route.params.chapterId);
    },
    chapterIndex() {
      let chapterIndex = -1;
      if (this.chapterList.length) {
        this.chapterList.find((item, index) => {
          if (item.id == this.chapterId) {
            chapterIndex = index;
          }
        });
      }
      return chapterIndex;
    },
    nextChapterIndex() {
      let nextChapterIndex = -1;
      if (this.nextDisabled) {
        return -1;
      } else {
        return (nextChapterIndex = this.chapterIndex + 1);
      }
    },
    backChapterIndex() {
      let backChapterIndex = -1;
      if (this.backDisabled) {
        return -1;
      } else {
        return (backChapterIndex = this.chapterIndex - 1);
      }
    },
    nextDisabled() {
      return this.chapterIndex === this.chapterList.length - 1;
    },
    backDisabled() {
      return this.chapterIndex === 0;
    },
    isFree() {
      return this.chapterInfo.free || this.article.bought;
    },
    webShareUrl() {
      return this.shareType === 2
        ? `${webSharePage}?fromUid=${this.userUid}&objId=${this.articleId}&type=1&langId=${this.currentLanguage}` //web端分享活动地址
        : `${window.location.href}?langId=${this.currentLanguage}`; //web端文章详情地址
    },
    shareWeiXinUrl() {
      return this.shareType === 2
        ? `${H5bSharePage}?objId=${this.articleId}&fromUid=${this.userUid}&type=1&langId=${this.currentLanguage}` //h5分享活动地址
        : `${H5bArticleDetailPage}?langId=${this.currentLanguage}&id=${this.chapterId}`; //h5文章详情地址
    }
  },
  watch: {
    chapterId(id) {
      if (id != -1 && !isNaN(id)) {
        this.getArticleChapterDetails(id);
      }
    }
  },
  mounted() {
    let documentWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let marginWidth = (documentWidth - 1200) / 2;
    this.rightMenuPosition.left = `${1200 + marginWidth + 40}px`;
    this.rightMenuVisible = true;
    this.windowHeight = this.getWindowHeight();
    console.log(this.windowHeight);
    //监听滚动
    window.addEventListener(
      "scroll",
      () => {
        if (this.getScrollTop() + this.getWindowHeight() + 80 >= this.getScrollHeight()) {
          this.rightMenuPosition.bottom = "180px";
        } else {
          this.rightMenuPosition.bottom = "60px";
        }
      },
      true
    );
  },
  methods: {
    ...mapMutations([types.SET_LOGIN_DIALOG_VISIBLE]),
    onClickBuyHandle() {
      //点击购买
      if (this.userUid > 0) {
        this.productChannelDialogVisible = true;
        // this.$router.push({name: "payOrder", query: {productId: this.article.id, productType: 1}});
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true); //显示登录框
      }
    },
    nextChapter() {
      if (!this.nextDisabled) {
        let chapterId = this.chapterList[this.nextChapterIndex].id;
        this.$router.push({name: "chapterDetails", params: {chapterId: chapterId}});
      }
    },
    backChapter() {
      if (!this.backDisabled) {
        let chapterId = this.chapterList[this.backChapterIndex].id;
        this.$router.push({name: "chapterDetails", params: {chapterId: chapterId}});
      }
    },
    getArticleInfo() {
      return api
        .getArticleInfo({id: this.articleId})
        .then(res => {
          this.article = res;
          this.shareTitle = res.title;
          this.bookMarkId = res.id;
          this.chapterList = res.chapterList;
        })
        .catch(res => {
          if (res.subCode === "320B202") {
            this.$router.push({name: "offLevel"});
          } else {
            this.$dialog.alert(res.message, () => {
              this.$router.push({name: "home"});
            });
          }
        });
    },
    getArticleChapterDetails(chapterId = this.chapterId) {
      return api
        .getArticleChapterDetails({chapterId: chapterId})
        .then(res => {
          this.chapterInfo = res;
          this.addHistory({chapterId: res.id, chapterName: res.chapterName, courseId: res.courseId, idx: res.idx});
        })
        .catch(res => {
          this.$message.error(res.message);
        })
        .finally(() => {
          setLabelTitle(`章节${this.chapterIndex + 1}-${this.chapterInfo.chapterName}`); //设置标签页title
        });
    },
    addHistory(params) {
      if (this.userUid > 0) {
        //登录后才保存
        apiHistory.addHistoryChapter(params);
      }
    },
    changeDirectory(chapter) {
      this.$router.push({name: "chapterDetails", params: {chapterId: chapter.id}});
      this.showDirectory = false;
    },
    onChangeShareDialogVisibleHandle(visible) {
      if (this.isFree) {
        this.shareType = 1; //免费
      } else {
        this.shareType = 2; //分享得汇豆
      }
      this.shareDialogVisible = visible;
    },
    onChangeShareChannelDialogVisibleHandle(visible) {
      this.shareType = 2;
      this.shareDialogVisible = visible;
    },
    onChangeBookmarkStatus(status) {
      this.chapterInfo.addedBookmark = status === "success" ? true : false;
    },
    getScrollTop() {
      //滚动条在Y轴上的滚动距离
      let scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
      if (document.body) {
        bodyScrollTop = document.body.scrollTop;
      }
      if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
      }
      scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
      return scrollTop;
    },
    getScrollHeight() {
      //文档的总高度
      let scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;
      if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
      }
      if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
      }
      scrollHeight = bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight;
      return scrollHeight;
    },
    getWindowHeight() {
      //浏览器视口的高度
      let windowHeight = 0;
      if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
      } else {
        windowHeight = document.body.clientHeight;
      }
      return windowHeight;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/view/article/chapterDetails.less";
</style>
