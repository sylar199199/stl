<template>
  <container class="video-detail-layer">
    <div v-show="pageShow" class="container content">
      <el-row
        v-loading="videoComloading"
        element-loading-text="加载视频组件中..."
        element-loading-background="rgba(0, 0, 0, 0.7)"
        class="video-play-layer"
      >
        <el-col :span="isShowChapterList ? 19 : 24">
          <video-player
            :class="{full: !isShowChapterList}"
            :is-can-play="true"
            :is-play-end="isPlayEnd"
            @click-player="onClickPlayerHandle"
            @play="onPlayerPlay"
            @ended="onPlayerEnded"
            @pause="onPlayerPause"
            @error="onPlayerError"
            ref="videoPlayer"
          >
            <div class="video-player-right-menu text-right" slot="right-menu">
              <favorite
                class="favorite-icon"
                name="videoFavoriteList"
                :id="this.videoId"
                :is-favorite="videoInfo.collected"
                @handleFavorite="onChangeFavoriteStatus"
              ></favorite>
              <shareIcon
                class="share-icon"
                :shareUrl="webShareUrl"
                :shareWeiXinUrl="shareWeiXinUrl"
                :dialogVisible="shareDialogVisible2"
                @changeDialogVisible="onChangeShareDialogVisibleHandle2"
              >
                <icon-svg slot="icon" icon-class="icon-share" />
              </shareIcon>
            </div>
            <el-row slot="content" class="player-recommend-layer">
              <el-col :span="isShowChapterList ? 12 : 8" v-for="item in playerRecommendList" :key="item.index">
                <video-list-card
                  class="video-list"
                  :data="item"
                  @click.native="$router.push({name: 'videoDetail', params: {id: item.id}})"
                  type="player"
                  width="282px"
                  height="158px"
                ></video-list-card>
              </el-col>
            </el-row>
          </video-player>
        </el-col>
        <el-col
          v-if="videoInfo.playInfoCount > 1"
          v-loading="chapter.loading"
          element-loading-background="rgba(255,255,255,0)"
          :span="5"
        >
          <div class="infinite fr">
            <h3>{{ $t("video.tableContent") }}</h3>
            <ul
              class="infinite-list scroll-bar"
              v-infinite-scroll="onChapterScrollHandle"
              infinite-scroll-disabled="chapterDisabled"
            >
              <li
                :key="index"
                v-for="(item, index) in chapter.list"
                @click="onClickChapterHandle(index)"
                :class="{active: chapter.currentIndex === index}"
                class="infinite-list-item text-truncate"
              >
                <span class="inline-block text-truncate vertical-align-middle">{{ item.episodeName }}</span>
                <icon-svg
                  v-if="!videoInfo.bought && !item.free"
                  class="inline-block vertical-align-middle"
                  icon-class="icon-suo"
                ></icon-svg>
              </li>
            </ul>
            <!--            <p class="text-center" v-if="chapter.loading">加载中...</p>-->
            <!--            <p class="text-center" v-if="chapterNoMore">没有更多了</p>-->
          </div>
        </el-col>
      </el-row>
      <el-row class="video-info">
        <el-col :span="12">
          <h2 class="title text-default2">{{ videoInfo.title }}</h2>
        </el-col>
        <el-col :span="12" class="opt-layer text-right">
          <huidou-layer
            v-if="!videoInfo.bought && !videoInfo.free"
            class="huidou-icon"
            :price="videoInfo.realBeanAmount"
            :discount="videoInfo.virtualBeanAmount"
          ></huidou-layer>
          <favorite
            class="favorite-icon"
            name="videoFavoriteList"
            :id="this.videoId"
            :is-favorite="videoInfo.collected"
            @handleFavorite="onChangeFavoriteStatus"
          ></favorite>
          <shareIcon
            class="share-icon"
            :shareUrl="webShareUrl"
            :shareWeiXinUrl="shareWeiXinUrl"
            :shareTitle="shareTitle"
            :shareType="shareType"
            :isFree="videoInfo.free"
            :isBought="videoInfo.bought"
            :picUrl="videoInfo.imageUrl"
            :dialogVisible="shareDialogVisible"
            @changeDialogVisible="onChangeShareDialogVisibleHandle"
          ></shareIcon>
          <el-button
            v-if="!videoInfo.bought && !videoInfo.free"
            class="pay-btn"
            round
            type="primary"
            @click="onClickBuyHandle"
          >
            {{ $t("video.purchase") }}
          </el-button>
        </el-col>
        <el-col :span="24">
          <icon-svg class="play-icon vertical-align-middle text-muted2" icon-class="icon-eye"></icon-svg>
          <span class="vertical-align-middle text-default4">{{ videoInfo.readingCount | formatNumToThousand }}</span>
          <div class="inline-block vertical-align-middle key-word">
            <key-word-tag :list="videoInfo.tags"></key-word-tag>
          </div>
        </el-col>
        <el-col class="introduce text-muted" :span="24">
          <content-abstract
            limit-height="39px"
            :content="videoInfo.summary"
            :count="videoInfo.playInfoCount"
            name="分集"
            unit="集"
          ></content-abstract>
        </el-col>
      </el-row>
      <h2 class="text-default3 recommend-title">{{ $t("video.relatedSuggestion") }}</h2>
      <el-row class="recommend-layer" v-loading="recommendLoading">
        <el-col :span="6" v-for="item in recommendList" :key="item.index">
          <router-link target="_blank" :to="{name: 'videoDetail', params: {id: item.id}}">
            <video-list-card class="video-list-card" :data="item"></video-list-card>
          </router-link>
        </el-col>
      </el-row>
      <h2 class="comment-title text-default3">{{ $t("video.courseComment") }}</h2>
      <el-row class="comment-layer">
        <el-col :span="24">
          <comment
            ref="commentDOM"
            v-loading="commentLoading"
            :comments="commentList"
            :commentType="this.commentType"
            @onSendComment="onSendCommentHandle"
            @onSendRepay="onSendRepayHandle"
            @changeOrder="onChangeCommentOrderHandle"
            @delComment="onDelCommentHandle"
          ></comment>
        </el-col>
      </el-row>
      <pagination
        :page-total="pagination.total"
        :page-index="pagination.index"
        :page-size="pagination.size"
        @onCurrentChange="onChangeCommentPageHandle"
      ></pagination>
    </div>
    <!--付费弹窗-->
    <product-channel-dialog
      class="product-channel"
      :objId="videoId"
      :dialogVisible="productChannelDialogVisible"
      :visible.sync="productChannelDialogVisible"
      @changeDialogVisible="onChangeShareChannelDialogVisibleHandle"
    ></product-channel-dialog>
  </container>
</template>

<script>
import videoPlayer from "@/components/videoPlayer";
import favorite from "@/components/favorite";
import shareIcon from "@/components/share/icon";
import comment from "@/components/comment/comment";
import huidouLayer from "@/components/huidou/layer";
import keyWordTag from "@/components/share/keyWordTag";
import videoListCard from "@/components/videoListCard";
import contentAbstract from "@/components/contentAbstract";
import pagination from "@/components/pagination/index.vue";
import productChannelDialog from "@/components/productChannelDialog";
import * as api from "@/api/video";
import * as commentAPI from "@/api/comment";
import * as commonAPI from "@/api/common";
import {formatNumToThousand} from "@/utils/mUtils";
import {mapGetters, mapMutations} from "vuex";
import * as types from "@/store/types";
import {setLabelTitle} from "@/utils/mUtils";
import {webSharePage, H5bSharePage, H5bVideoDetailPage} from "@/utils/env";

let playerPlugins = null; //视频播放组件
let historyTimeId = null; //播放记录
export default {
  name: "detail",
  components: {
    videoPlayer,
    favorite,
    shareIcon,
    comment,
    huidouLayer,
    keyWordTag,
    videoListCard,
    contentAbstract,
    productChannelDialog,
    pagination
  },
  data() {
    return {
      pageShow: false,
      video: [
        {
          content: ""
        }
      ],
      videoInfo: {
        title: "",
        imageUrl: "",
        summary: "",
        playInfoCount: 0,
        tagCount: 0,
        tags: [],
        free: false,
        realBeanAmount: 0,
        virtualBeanAmount: 0,
        readingCount: 0,
        collected: false, //是否收藏
        bought: true
      },
      chapter: {
        currentCount: 1,
        currentIndex: 0,
        totalCount: 6,
        loading: false,
        noMore: false,
        list: []
      },
      pagination: {
        index: 1,
        size: 20,
        total: 0
      },
      commentList: [],
      commentTotal: 0,
      commentType: 1, //热门评论
      shareDialogVisible: false,
      shareDialogVisible2: false,
      recommendList: [],
      commentLoading: true,
      recommendLoading: true,
      isPlayEnd: false,
      isPlay: false,
      firstPlayer: true, //第一次播放，判断加载或者切换章节
      productChannelDialogVisible: false,
      shareType: "",
      videoComloading: false //加密视频模块
    };
  },
  computed: {
    ...mapGetters(["userAvatar", "userName", "userUid", "currentLanguage"]),
    videoId() {
      return Number(this.$route.params.id);
    },
    chapterNoMore() {
      return this.chapter.currentCount >= 3;
    },
    chapterDisabled() {
      return this.chapter.loading || this.chapterNoMore;
    },
    isShowChapterList() {
      return this.videoInfo.playInfoCount > 1;
    },
    playerRecommendList() {
      if (this.isShowChapterList) {
        return this.recommendList.slice(0, 4);
      }
      return this.recommendList.slice(0, 6);
    },
    currentChapter() {
      if (this.chapter.list.length) {
        return this.chapter.list[this.chapter.currentIndex];
      }
      return {};
    },
    isPlayPower() {
      //是否播放权限
      return this.videoInfo.bought || this.currentChapter.free;
    },
    shareTitle() {
      return this.videoInfo.title;
    },
    webShareUrl() {
      return this.shareType === 2
        ? `${webSharePage}?fromUid=${this.userUid}&objId=${this.videoId}&type=2&langId=${this.currentLanguage}` //web端分享活动地址
        : `${window.location.href}?langId=${this.currentLanguage}`; //web端视频详情地址
    },
    shareWeiXinUrl() {
      return this.shareType === 2
        ? `${H5bSharePage}?objId=${this.videoId}&fromUid=${this.userUid}&type=2&langId=${this.currentLanguage}` //h5分享活动地址
        : `${H5bVideoDetailPage}?langId=${this.currentLanguage}&id=${this.videoId}`; //h5视频详情地址
    }
  },
  watch: {
    videoId(val) {
      //跳转的时候会变成NaN
      if (!isNaN(val)) {
        this.resetPlayer(); //重置播放器属性
        this.getVideoDetail();
      }
    }
  },
  filters: {
    formatNumToThousand
  },
  mounted() {
    this.getVideoDetail();
    if (this.userUid > 0) {
      historyTimeId = setInterval(() => {
        if (playerPlugins && this.isPlay) {
          this.addPlayHistory(Math.floor(playerPlugins.currentTime() * 1000)); //每隔60秒保存播放记录
        }
      }, 30000);
    }
  },
  beforeDestroy() {
    if (this.$refs["videoPlayer"]) {
      //销毁videoPlayer组件
      this.$refs["videoPlayer"].dispose();
      playerPlugins = null;
    }
  },
  destroyed() {
    clearInterval(historyTimeId); //清除历史记录定时器
  },
  methods: {
    ...mapMutations([types.SET_LOGIN_DIALOG_VISIBLE]),
    getVideoDetail() {
      this.chapter.loading = true;
      this.isPlayEnd = false;
      api
        .getVideoDetailChapterList({
          id: this.videoId
        })
        .then(res => {
          setLabelTitle(res.title); //设置标签页title
          this.chapter.list = res.playInfoList;
          this.videoInfo.title = res.title;
          this.videoInfo.imageUrl = res.imageUrl;
          this.videoInfo.summary = res.summary;
          this.videoInfo.playInfoCount = res.playInfoCount;
          this.videoInfo.tagCount = res.tagCount;
          this.videoInfo.tags = res.tags;
          this.videoInfo.free = res.free;
          this.videoInfo.realBeanAmount = res.realBeanAmount;
          this.videoInfo.virtualBeanAmount = res.virtualBeanAmount;
          this.videoInfo.readingCount = res.readingCount;
          this.videoInfo.collected = res.collected;
          this.videoInfo.bought = res.bought;
          this.pageShow = true; //显示页面
          if (!this.currentChapter.episodeUrl) {
            this.$dialog.alert("视频已删除！", () => {
              this.$router.push("home");
            });
          }
          playerPlugins = this.$refs["videoPlayer"].getPlayerPlugins();
          if (playerPlugins) {
            this.videoComloading = true;
            //如有已经初始化完成
            this.doPlayerVideoHandle()
              .then(res => {
                playerPlugins.play();
                this.addPlayHistory(); //添加历史记录
                this.addReadingCount(); //新增播放数
              })
              .catch(() => {
                this.$message("加载视频失败");
              })
              .finally(() => {
                this.videoComloading = false;
              });
          } else {
            if (res.lastLearnEpisodeModel) {
              //如果有播放记录
              let playHistoryIndex = this.chapter.list.findIndex(item => {
                return item.id === res.lastLearnEpisodeModel.episodeId;
              });
              if (playHistoryIndex) {
                this.chapter.currentIndex = playHistoryIndex;
              }
            }
            playerPlugins = this.$refs["videoPlayer"].init({
              width: this.isShowChapterList ? 950 : 1200,
              poster: this.videoInfo.imageUrl
            });
            playerPlugins.on("ready", event => {
              this.videoComloading = true;
              this.doPlayerVideoHandle().finally(() => {
                this.videoComloading = false;
              });
            });
            //添加视频准备完成后的回调函数
            playerPlugins.on("loadedmetadata", () => {
              if (this.firstPlayer) {
                //切换章节不赋值历史记录
                this.firstPlayer = false;
                playerPlugins.currentTime(res.lastLearnEpisodeModel ? res.lastLearnEpisodeModel.playedTime / 1000 : 0); //设置历史记录的播放时间
              }
            });
            ///免费一分钟
            playerPlugins.on("timeupdate", event => {
              this.doValidFreePlay(event);
            });
            playerPlugins.on("seeking", event => {
              //时间跳转前
              this.doValidFreePlay(event);
            });

            playerPlugins.on("play", () => {
              //console.log("play");
            });
            playerPlugins.on("firstplay", () => {
              //console.log("play");
              this.addPlayHistory(); //添加历史记录
              this.addReadingCount(); //新增播放数
            });
          }
          if (this.$route.params.commentId) {
            this.getCommentPageIndex(); //加载评论
          } else {
            this.getCommentList(); //加载评论
          }
          this.getRecommendList(); //加载推荐视频
        })
        .catch(res => {
          if (res.subCode === "320B302") {
            //已下架
            this.$router.push({name: "offLevel"});
          } else {
            this.pageShow = true; //显示页面
            this.$dialog.alert(res.message, () => {
              this.$router.push({name: "home"});
            });
          }
        })
        .finally(res => {
          this.chapter.loading = false;
        });
    },
    doPlayerVideoHandle() {
      return this.$refs["videoPlayer"].player({
        free: this.currentChapter.free,
        bought: this.videoInfo.bought,
        encryptedUrl: this.currentChapter.encryptedUrl,
        episodeUrl: this.currentChapter.episodeUrl
      });
    },
    doValidFreePlay(event) {
      if (!this.isPlayPower && playerPlugins.currentTime() > 60) {
        //显示播放途径
        this.productChannelDialogVisible = true;
        playerPlugins.pause();
        playerPlugins.currentTime(60);
      }
    },
    resetPlayer() {
      this.firstPlayer = true;
      this.isPlay = false;
      this.isPlayEnd = false;
    },
    getRecommendList() {
      //获取推荐视频
      this.recommendLoading = true;
      api
        .getRecommendVideoList({
          courseId: this.videoId,
          pageSize: 8,
          pageIndex: 1
        })
        .then(
          res => {
            this.recommendList = res.map(item => {
              item.isEdit = false;
              item.isChecked = false;
              return item;
            });
          },
          res => {}
        )
        .finally(() => {
          this.recommendLoading = false;
        });
    },
    getCommentList(val) {
      //获取评论
      this.commentLoading = true;
      if (this.commentType === 0 || this.$route.params.commentId) {
        //最新评论
        commentAPI
          .getCommentList({
            objId: this.videoId,
            objType: 1,
            pageIndex: this.$route.params.commentId ? val : this.pagination.index,
            pageSize: this.pagination.size,
            replyNum: 30
          })
          .then(res => {
            this.commentList = res.pageDatas.map(item => {
              item.inputShow = false;
              item.replyList.forEach(list => {
                list.inputShow = false;
              });
              return item;
            });
            this.pagination.total = res.rowCount;
            // 从消息跳转过来自动打开消息回复框
            if (this.$route.params.commentId) {
              this.pagination.index = val; // 从消息跳转过来自动定位到相应页码;
              this.commentList.forEach(item => {
                if (this.$route.params.commentId === item.id) {
                  if (this.$route.params.replyType) {
                    item.inputShow = true;
                    this.$refs["commentDOM"].doFocusCommentRepayHand(item.id); //打开一级评论
                  } else {
                    item.replyList.forEach(n => {
                      if (n.id === this.$route.params.replyId) {
                        n.inputShow = true;
                        this.$refs["commentDOM"].doFocusCommentRepayHand(n.id); //打开二级评论
                      }
                    });
                  }
                }
              });
            }
          })
          .finally(res => {
            this.commentLoading = false;
          });
      } else {
        //热门评论
        commentAPI
          .getHotCommentList({
            objId: this.videoId,
            objType: 1,
            replyNum: 30,
            pageIndex: this.pagination.index,
            pageSize: this.pagination.size
          })
          .then(res => {
            this.commentList = res.map(item => {
              item.inputShow = false;
              item.replyList.forEach(list => {
                list.inputShow = false;
              });
              return item;
            });
            this.pagination.total = res.rowCount;
          })
          .finally(res => {
            this.commentLoading = false;
          });
      }
    },
    addReadingCount() {
      //添加播放记录
      commonAPI
        .addReadingCount({
          courseType: 2,
          id: this.videoId
        })
        .then(res => {})
        .catch(res => {});
    },
    addPlayHistory(time = 0) {
      //添加历史记录
      api
        .addVideoHistory({
          courseId: this.videoId,
          episodeId: this.currentChapter.id,
          episodeName: this.currentChapter.episodeName,
          idx: this.currentChapter.idx,
          playedTime: time
        })
        .then(res => {})
        .catch(res => {});
    },
    onPlayerEnded() {
      //播放完成
      if (this.videoInfo.playInfoCount === this.chapter.currentIndex + 1) {
        //播放到最后一集
        this.isPlayEnd = true;
      } else {
        //播放下一集
        this.chapter.currentIndex = this.chapter.currentIndex + 1;
        playerPlugins.src({src: this.currentChapter.episodeUrl, type: "video/mp4"}); //改变播放内容
        playerPlugins.play();
      }
    },
    onClickPlayerHandle(event) {
      //捕获点击播放器事件
      this.productChannelDialogVisible = true;
    },
    onPlayerPlay() {
      //播放开始
      this.isPlayEnd = false;
      this.isPlay = true;
    },
    onPlayerPause() {
      //播放停止
      this.isPlay = false;
    },
    onPlayerError() {
      //播放错误事件
      this.doPlayerVideoHandle();
    },
    onClickBuyHandle() {
      //点击购买
      if (this.userUid > 0) {
        this.productChannelDialogVisible = true;
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true); //显示登录框
      }
    },
    onDelCommentHandle(params) {
      this.$dialog
        .confirm({
          title: "删除评论",
          msg: "是否要删除此评论"
        })
        .then(res => {
          commentAPI
            .delCommentReply({
              id: params.id,
              type: params.type === "comment" ? 1 : 2,
              uid: this.userUid
            })
            .then(res => {
              if (params.type === "comment") {
                let index = this.commentList.findIndex(item => {
                  if (item.id === params.id) {
                    return true;
                  }
                });
                this.commentList.splice(index, 1);
              } else {
                this.commentList.forEach((item, index) => {
                  item.replyList.forEach((list, replyIndex) => {
                    if (list.id === params.id) {
                      this.commentList[index].replyList.splice(replyIndex, 1);
                    }
                  });
                });
              }
              this.$message({
                message: "删除成功",
                type: "success"
              });
            })
            .catch(res => {
              this.$message(res.message);
            });
        });
    },
    onChapterScrollHandle() {
      this.chapter.currentCount += 1;
    },
    async onClickChapterHandle(index) {
      this.videoComloading = true;
      this.chapter.currentIndex = index;
      await this.doPlayerVideoHandle();
      this.videoComloading = false;
      playerPlugins.play();
      this.addPlayHistory(); //添加不同章节记录
    },
    onSendCommentHandle(opt) {
      commentAPI
        .addComment({
          content: opt.comment,
          objId: this.videoId,
          objType: 1
        })
        .then(res => {
          this.commentList.unshift({
            id: res.id,
            uid: res.uid,
            nickname: this.userName,
            avatar: this.userAvatar,
            createTime: res.createTime,
            content: opt.comment,
            replyList: [],
            inputShow: false
          });
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    onSendRepayHandle(opt) {
      commentAPI
        .addCommentReply({
          commentId: opt.commentId,
          content: opt.comment,
          fromUid: this.userUid,
          toReplyId: opt.toReplyId,
          toUid: opt.toUid,
          type: opt.type
        })
        .then(res => {
          let currentCommentIndex = this.commentList.findIndex(item => {
            if (item.id === opt.commentId) {
              return true;
            }
          });
          this.commentList[currentCommentIndex].replyList.push({
            id: res.id,
            fromUid: this.userUid,
            toUid: res.toUid,
            fromUserAvatar: this.userAvatar,
            fromNickName: res.fromNickName,
            toNickName: res.toNickName,
            toReplyId: res.toReplyId,
            type: res.type,
            content: opt.comment,
            creatTime: res.createTime
          });
        })
        .catch(res => {
          this.$message.error(res.message);
        });
    },
    onChangeCommentPageHandle(page) {
      this.pagination.index = page;
      this.getCommentList();
    },
    onChangeShareDialogVisibleHandle(visible) {
      //视频外的分享弹窗
      this.shareType = 1;
      //操作分享灯箱
      this.shareDialogVisible = visible;
    },
    onChangeShareDialogVisibleHandle2(visible) {
      //视频内的分享弹窗
      this.shareType = 1;
      //操作分享灯箱
      this.shareDialogVisible2 = visible;
    },
    onChangeShareChannelDialogVisibleHandle(visible) {
      this.shareType = 2;
      this.shareDialogVisible = visible;
    },
    onChangeCommentOrderHandle(type) {
      this.commentType = type;
      this.getCommentList(); //切换最新最热评论
    },
    onChangeFavoriteStatus(status) {
      //改版收藏状态
      this.videoInfo.collected = status === "success" ? true : false;
    },
    //查询评论所处页码
    getCommentPageIndex() {
      commentAPI
        .getCommentPageIndex({
          commentId: this.$route.params.commentId,
          pageSize: this.pagination.size,
          objType: 1,
          objId: this.$route.params.id
        })
        .then(res => {
          this.getCommentList(res.pageIndex);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/view/video/detail.less";
</style>
