<template>
  <div ref="commentDOM">
    <div v-clickoutside="hideReplyBtn" class="my-reply cf" v-if="isShowComment">
      <!--我要评论-->
      <el-avatar class="header-img fl el-avatar-default" :size="40" :src="userAvatar"></el-avatar>
      <div class="reply-info fl">
        <div
          tabindex="0"
          contenteditable="true"
          ref="replyInput"
          spellcheck="false"
          class="reply-input text-default4 clear-input scroll-bar"
          @focus="showReplyBtn"
          @input="onDivInput($event)"
          @keyup="onDivInput($event)"
        >
          {{ $t("video.saySomeWord") }}
        </div>
      </div>
      <el-button
        round
        class="reply-btn text-lg vertical-align-middle fr"
        size="medium"
        @click="sendComment"
        type="primary"
      >
        {{ $t("video.comments") }}
      </el-button>
    </div>
    <el-row class="all-comment-title">
      <el-col :span="12">
        <h2 class="text-muted">{{ commentType === 1 ? $t("video.hot") : "最新" }}{{ $t("video.comments") }}</h2>
      </el-col>
      <el-col class="text-right" :span="12">
        <span
          class="pointer"
          @click="onChangeOrderHandle(1)"
          :class="commentType === 1 ? 'text-default3' : 'text-muted'"
        >
          {{ $t("video.hot") }}
        </span>
        <span class="split text-muted">/</span>
        <span
          class="pointer"
          @click="onChangeOrderHandle(0)"
          :class="commentType === 0 ? 'text-default3' : 'text-muted'"
        >
          最新
        </span>
      </el-col>
    </el-row>
    <template v-if="comments.length">
      <!--评论列表-->
      <div v-for="(item, i) in comments" :key="i" class="comment-list cf">
        <el-avatar class="header-img fl el-avatar-default" :size="40" :src="item.avatar || defaultAvatar"></el-avatar>
        <div class="content fl">
          <div class="author-info text-muted2">
            <span class="author-name">{{ item.nickname }}</span>
            <span class="author-time">{{ item.createTime | formatDateDay }}</span>
          </div>
          <div class="talk-box">
            <comment-abstract :content="item.content"></comment-abstract>
          </div>
          <div class="reply-btn text-muted" v-show="!item.inputShow">
            <span @click="showReplyParentInput($event, i)">{{ $t("video.reply") }}</span>
            <span v-if="item.uid === userUid" @click="onClickDelReplyHandle({type: 'comment', id: item.id})">
              {{ $t("video.delete") }}
            </span>
          </div>
          <div class="reply-btn text-muted" v-show="item.inputShow">
            <span @click="doHideAllReplyInput">{{ $t("video.cancelReply") }}</span>
          </div>
          <div class="item-replay-content replay-box" v-show="item.inputShow">
            <div class="input-content">
              <div
                :id="'replyTxt' + item.id"
                spellcheck="false"
                class="input-box text-default4 clear-input scroll-bar"
                contenteditable="true"
                @keyup="onDivInput($event)"
                @input="onDivInput($event)"
              ></div>
            </div>
            <div class="replay-btn">
              <div class="btn text-center pointer fr" @click="sendCommentParentReply(i)">{{ $t("video.reply") }}</div>
            </div>
          </div>
          <!--评论回复-->
          <div class="reply-box" v-if="item.replyList.length">
            <div v-for="(reply, j) in item.replyList" :key="j" class="comment-list reply-list cf">
              <el-avatar
                class="header-img fl el-avatar-default"
                :size="40"
                :src="reply.fromUserAvatar || defaultAvatar"
              ></el-avatar>
              <div class="content fl">
                <div class="author-info text-muted2">
                  <span class="author-name">
                    {{ reply.fromNickName }}
                    <span>{{ $t("video.reply") }}</span>
                    {{ reply.toNickName }}
                  </span>
                </div>
                <div class="talk-box">
                  <comment-abstract :content="reply.content"></comment-abstract>
                </div>
                <div class="reply-btn text-muted" v-show="!reply.inputShow">
                  <span @click="showReplyInput(i, j)">{{ $t("video.reply") }}</span>
                  <span v-if="reply.fromUid === userUid" @click="onClickDelReplyHandle({type: 'reply', id: reply.id})">
                    {{ $t("video.delete") }}
                  </span>
                  <span class="author-time text-muted2">{{ reply.createTime | formatDateDay }}</span>
                </div>
                <div class="reply-btn text-muted" v-show="reply.inputShow">
                  <span @click="doHideAllReplyInput">{{ $t("video.cancelReply") }}</span>
                </div>
                <div class="item-replay-content replay-box" v-show="reply.inputShow">
                  <div class="input-content">
                    <div
                      :id="'replyTxt' + reply.id"
                      tabindex="0"
                      spellcheck="false"
                      class="input-box text-default4 clear-input scroll-bar"
                      contenteditable="true"
                      @keyup="onDivInput($event)"
                      @input="onDivInput($event)"
                    ></div>
                  </div>
                  <div class="replay-btn">
                    <div class="btn text-center pointer fr" @click="sendCommentReply(i, j)">
                      {{ $t("video.reply") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="comment-empty-layer text-center">
        <img src="@/assets/img/comment/empty.svg" />
        <p class="text-muted2">{{ $t("video.noComments") }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import commentAbstract from "@/components/commentAbstract";
import {formatDateDay} from "@/utils/mUtils";
import * as types from "@/store/types";
import {mapGetters, mapMutations} from "vuex";

const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }

    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener("click", el.vueClickOutside);
    delete el.vueClickOutside;
  }
};
let $repayInput = null;
export default {
  name: "comment",
  components: {
    commentAbstract
  },
  props: {
    comments: {
      type: Array,
      default() {
        return [];
      }
    },
    isShowComment: {
      type: Boolean,
      default() {
        return true;
      }
    },
    commentType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      btnShow: false,
      index: -1,
      replyComment: "",
      defaultAvatar: require("@/assets/img/default_avatar.jpg")
    };
  },
  computed: {
    ...mapGetters(["userAvatar", "userName", "userUid"]),
    currentComment() {
      if (this.index > -1) {
        return this.comments[this.index];
      }
      return -1;
    }
  },
  filters: {
    formatDateDay
  },
  directives: {clickoutside},
  mounted() {
    $repayInput = this.$refs["replyInput"];
  },
  methods: {
    ...mapMutations([types.SET_LOGIN_DIALOG_VISIBLE]),
    showReplyBtn() {
      if ($repayInput.innerText.indexOf(this.$t("video.saySomeWord")) > -1) {
        $repayInput.innerText = "";
      }
      this.btnShow = true;
    },
    hiddenReplyBtn() {
      if ($repayInput.innerText === "") {
        $repayInput.innerText = this.$t("video.saySomeWord");
      }
    },
    hideReplyBtn() {
      this.btnShow = false;
    },
    doHideAllReplyInput() {
      this.comments.forEach(item => {
        item.inputShow = false;
        item.replyList.forEach(list => {
          list.inputShow = false;
        });
      });
    },
    doShowCurrentReplyInput(index) {
      this.doHideAllReplyInput();
      this.index = index;
      this.comments[index].inputShow = true;
    },
    doFocusCommentRepayHand(id) {
      this.$nextTick(() => {
        let $replyTxt = document.getElementById(`replyTxt${id}`);
        if ($replyTxt) {
          $replyTxt.focus();
        }
      });
    },
    showReplyParentInput(event, index) {
      //回复楼主
      if (this.userUid > 0) {
        this.doShowCurrentReplyInput(index);
        this.$nextTick(() => {
          let $inputBox = event.target.parentNode.parentNode.querySelector(".item-replay-content");
          if ($inputBox) {
            $inputBox.querySelector(".input-box").focus();
          }
        });
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true);
      }
    },
    showReplyInput(index, replyIndex) {
      //回复回复人
      if (this.userUid > 0) {
        this.doHideAllReplyInput();
        this.comments[index].replyList[replyIndex].inputShow = true;
        this.$nextTick(() => {
          event.target.parentNode.parentNode
            .querySelector(".item-replay-content")
            .querySelector(".input-box")
            .focus();
        });
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true);
      }
    },
    hiddenReplyInput(i) {
      this.doHideAllReplyInput();
    },
    doClearReplyInput() {
      //清空评论
      this.replyComment = "";
      this.$refs["commentDOM"].querySelectorAll(".clear-input").forEach(item => {
        item.innerHTML = "";
      });
    },
    sendComment() {
      if (this.userUid > 0) {
        if (!this.replyComment) {
          this.$message({
            showClose: true,
            type: "warning",
            message: "评论不能为空"
          });
        } else {
          this.$emit("onSendComment", {comment: this.replyComment});
          this.doClearReplyInput();
        }
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true);
      }
    },
    sendCommentParentReply(index) {
      if (this.userUid > 0) {
        if (!this.replyComment) {
          this.$message({
            showClose: true,
            type: "warning",
            message: "评论不能为空"
          });
        } else {
          this.$emit("onSendRepay", {
            commentId: this.comments[index].id,
            comment: this.replyComment,
            toUid: this.comments[index].uid,
            toReplyId: 0,
            type: 1
          });
          this.comments[this.index].inputShow = false;
          this.index = -1;
          this.doClearReplyInput();
        }
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true);
      }
    },
    sendCommentReply(index, replyIndex) {
      if (this.userUid > 0) {
        if (!this.replyComment) {
          this.$message({
            showClose: true,
            type: "warning",
            message: "评论不能为空"
          });
        } else {
          let type = this.comments[index].replyList[replyIndex].type;
          type = type > 2 ? 3 : ++type;
          this.$emit("onSendRepay", {
            commentId: this.comments[index].id, //评论id
            comment: this.replyComment,
            toUid: this.comments[index].replyList[replyIndex].fromUid,
            toReplyId: this.comments[index].replyList[replyIndex].id,
            type
          });
          this.comments[index].inputShow = false;
          this.comments[index].replyList[replyIndex].inputShow = false;
          this.index = -1;
          this.doClearReplyInput();
        }
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true);
      }
    },
    onDivInput(e) {
      this.replyComment = e.target.innerHTML;
    },
    onChangeOrderHandle(order) {
      this.commentType = order;
      this.$emit("changeOrder", order);
    },
    onClickDelReplyHandle(params) {
      this.$emit("delComment", params);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables.less";

.my-reply {
  margin: 0 0 60px;

  .header-img {
    display: inline-block;
    margin: 0 15px 0 0;
  }

  .clear-input {
  }

  .reply-info {
    display: inline-block;
    max-height: 140px;
    margin-left: 5px;
    padding: 15px;
    border-radius: 8px;
    background-color: #f6f7f9;
    overflow-y: auto;

    .reply-input {
      width: 962px;

      &:focus {
        outline: none;
        border-radius: 8px;
        &:before {
          content: none;
        }
      }
    }
  }

  .reply-btn {
    width: 120px;
    height: 40px;
    line-height: 20px;
  }
}

.all-comment-title {
  margin: 0 0 25px;
  padding: 0 0 25px;
  border-bottom: 1px solid @gray-bg-color;

  span.split {
    margin: 0 10px;
  }
}

.my-comment-reply {
  margin: 25px 0 0;

  .reply-info {
    .reply-input {
      width: 900px;
    }
  }
}

.comment-list {
  padding: 0 0 30px;
  margin: 0 0 30px;
  border-bottom: 1px solid @gray-bg-color;

  .content {
    width: 1138px;
  }

  .icon-btn {
    cursor: pointer;
  }

  .header-img {
    display: inline-block;
    vertical-align: top;
    margin: 0 15px 0 0;
  }

  .author-info {
    margin: 0 0 10px;

    .author-name {
      margin: 0 15px 0 0;
    }
  }

  .reply-btn {
    span {
      margin: 0 10px 0 0;
      cursor: pointer;
    }
  }

  .item-replay-content {
    padding: 8px 12px 8px 12px;
    border-radius: 8px;
    background-color: @gray-bg-color;

    .content-detail {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
    }
  }

  .replay-box {
    height: 160px;
    padding: 0;
    margin-top: 5px;

    .input-content {
      height: 111px;
      padding: 8px 0px 10px 0px;
      box-sizing: border-box;
      border-bottom: 1px solid #eff0f2;

      .input-box {
        height: 94px;
        overflow-y: scroll;
        padding: 0 15px;
      }
    }

    .replay-btn {
      .btn {
        width: 96px;
        height: 32px;
        color: @white;
        line-height: 32px;
        background-color: @global-primary;
        border-radius: 30px;
        margin: 8px 32px 8px 0;
      }
    }
  }

  .icon-btn {
    text-align: right;
    @media screen and (max-width: 1200px) {
      width: 20%;
      padding: 7px;
    }

    i {
      margin: 0 3px 0 0;
    }
  }

  .talk-box {
    margin: 0 0 10px;
  }

  .reply-box {
    padding: 15px 0 0;

    .reply-list {
      margin: 0;
      border-bottom: none;

      &:last-child {
        padding-bottom: 0;
      }

      .content {
        width: 1078px;
      }

      .author-name {
        span {
          margin: 0 10px;
        }
      }
    }
  }
}

.comment-empty-layer {
  padding: 80px 0 0;

  img {
    margin: 0 0 15px;
  }
}
</style>
