<template>
  <container class="my-information-layer gray-bg">
    <user-panel activeIndex="4">
      <div class="my-information-content">
        <default-tabs :list="menuList" :active-index="activeIndex" @change="onChangeTypeHandle"></default-tabs>
        <div class="content">
          <template v-if="activeIndex === 0">
            <div v-if="systemList.length">
              <el-row class="content-wrap" v-for="(item, index) in systemList" :key="index">
                <el-col :span="1">
                  <img class="text-center vertical-align-middle" src="@/assets/img/icon/huiketang-logo.svg" />
                </el-col>
                <el-col :span="23" style="">
                  <div class="item-content">
                    <p class="bold">{{ item.title }}</p>
                    <p class="text-xs item-time">{{ item.sendTime | formatDateDay }}</p>
                    <p class="item-detail">
                      {{ item.content }}
                      <template v-if="item.contentType === 1">
                        <a target="_blank" :href="item.contentData.link" class="text-sm item-link fr">
                          {{ $t("myInformation.lookLink") }}
                        </a>
                      </template>
                      <template v-else-if="item.contentType === 2">
                        <router-link
                          target="_blank"
                          class="text-sm item-link fr"
                          :to="{name: 'articleInfo', params: {articleId: item.contentData.id}}"
                        >
                          {{ $t("myInformation.lookLink") }}
                        </router-link>
                      </template>
                      <template v-else-if="item.contentType === 3">
                        <router-link
                          target="_blank"
                          class="text-sm item-link fr"
                          :to="{name: 'videoDetail', params: {id: item.contentData.id}}"
                        >
                          {{ $t("myInformation.lookLink") }}
                        </router-link>
                      </template>
                      <template v-else-if="item.contentType === 4">
                        <router-link target="_blank" class="text-sm item-link fr" :to="{name: 'testDownload'}">
                          {{ $t("myInformation.lookLink") }}
                        </router-link>
                      </template>
                    </p>
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-row v-else class="empty-content text-center">
              <img src="@/assets/img/icon/empty-content.svg" />
              <p>{{ $t("commons.noRelateContent") }}</p>
            </el-row>
          </template>
          <template v-else>
            <div v-if="replyList.length">
              <el-row class="content-wrap" v-for="(item, index) in replyList" :key="index">
                <el-col :span="1">
                  <img
                    class="text-center vertical-align-middle user-img"
                    :src="item.fromUserAvatar || require('@/assets/img/default_avatar.jpg')"
                  />
                </el-col>
                <el-col :span="23" style="">
                  <div class="item-content">
                    <p class="bold">{{ item.fromNickName }}</p>
                    <p class="text-xs item-time">{{ item.createTime | formatDateDay }}</p>
                    <p class="item-detail pointer">
                      <template v-if="item.type === 2 || item.type === 3">回复 @{{ item.toNickName }}:</template>
                      <span
                        @click="
                          $router.push({
                            name: 'videoDetail',
                            params: {
                              id: item.commentObjId,
                              commentId: item.commentId,
                              replyId: item.replyId
                            }
                          })
                        "
                      >
                        {{ item.content }}
                      </span>
                    </p>
                    <p class="item-replay pointer" @click="item.inputShow = false" v-if="item.inputShow">
                      {{ $t("myInformation.cancelReply") }}
                    </p>
                    <p class="item-replay pointer" @click="item.inputShow = true" v-else>
                      {{ $t("myInformation.reply") }}
                    </p>
                    <div class="item-replay-content replay-box" v-if="item.inputShow">
                      <div class="input-content">
                        <div
                          tabindex="0"
                          ref="replyInput"
                          spellcheck="false"
                          class="input-box scroll-bar"
                          contenteditable="true"
                          @input="onDivInput($event)"
                        ></div>
                      </div>
                      <div class="replay-btn">
                        <div class="btn text-center pointer fr" @click="onSendRepayHandle(item)">
                          {{ $t("myInformation.reply") }}
                        </div>
                      </div>
                    </div>
                    <div class="item-replay-content pointer" v-else>
                      <div class="content-detail">
                        {{ item.subjectFromNickName }}
                        <template v-if="item.type === 3">回复 @{{ item.subjectToNickName }}</template>
                        ：
                        <span
                          @click="
                            $router.push({
                              name: 'videoDetail',
                              params: {
                                id: item.commentObjId,
                                commentId: item.commentId,
                                replyId: item.replyId,
                                replyType: 1
                              }
                            })
                          "
                        >
                          {{ item.subjectContent }}
                        </span>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-row v-else class="empty-content text-center">
              <img src="@/assets/img/icon/empty-content.svg" />
              <p>{{ $t("commons.noRelateContent") }}</p>
            </el-row>
          </template>
          <el-row class="pagination-layer">
            <el-col :span="16">
              <pagination
                :page-total="pagination.total"
                :page-index="pagination.index"
                :page-size="pagination.size"
                @onCurrentChange="paginationChangeHandle"
              ></pagination>
            </el-col>
          </el-row>
        </div>
      </div>
    </user-panel>
  </container>
</template>

<script>
import userPanel from "@/layout/user/panel";
import defaultTabs from "@/components/defaultTabs";
import pagination from "@/components/pagination";
import * as user from "@/api/user";
import {formatDateDay, toJson} from "@/utils/mUtils";
import {mapGetters, mapMutations} from "vuex";
import * as commentAPI from "@/api/comment";
import * as types from "@/store/types";

export default {
  name: "myInformation",
  components: {
    userPanel,
    defaultTabs,
    pagination
  },
  data() {
    return {
      menuList: this.$t("myInformation.menuList"),
      systemList: [],
      replyList: [],
      pagination: {
        index: 1,
        size: 20,
        total: 0
      },
      loading: false,
      activeName: "system",
      replyComment: ""
    };
  },
  watch: {
    activeIndex(value) {
      this.pagination.index = 1;
      this.getContentList(this.pagination.index); //tabs切换更新列表
    }
  },
  created() {
    this.getContentList();
  },
  filters: {
    formatDateDay
  },
  computed: {
    ...mapGetters(["userUid", "userInformationCount"]),
    isSystem() {
      return this.activeIndex === 0;
    },
    activeIndex: {
      get() {
        return Number(this.$route.query.type) || 0;
      },
      set(val) {
        this.$router.push({name: "myInformation", query: {type: val}});
      }
    }
  },
  methods: {
    ...mapMutations([types.SET_UNREADMESSAGECOUNT]),
    getContentList(page = 1) {
      this.loading = true;
      if (this.isSystem) {
        user
          .getSystemInformation({
            pageIndex: page,
            pageSize: this.pagination.size,
            uid: this.userUid
          })
          .then(res => {
            this.systemList = res.pageDatas.map(item => {
              item.inputShow = false;
              item.contentData = toJson(item.contentData);
              return item;
            });
            this.pagination.total = res.rowCount;
            this.notificationRead();
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        user
          .getMessageInfo({
            pageSize: this.pagination.size,
            pageIndex: page,
            uid: this.userUid
          })
          .then(res => {
            this.replyList = res.pageDatas.map(item => {
              item.inputShow = false;
              return item;
            });
            this.pagination.total = res.rowCount;
            this.notificationRead();
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    onChangeTypeHandle(val) {
      this.activeIndex = val;
    },
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getContentList(this.pagination.index);
    },
    onSendRepayHandle(opt) {
      commentAPI
        .addCommentReply({
          commentId: opt.commentId,
          content: this.replyComment,
          fromUid: this.userUid,
          toReplyId: opt.replyId,
          toUid: opt.fromUid,
          type: opt.type > 2 ? 3 : ++opt.type
        })
        .then(res => {
          this.replyComment = "";
          this.replyList.forEach(item => {
            item.inputShow = false;
          });
          this.$message.success("回复成功");
        });
    },
    onDivInput: function(e) {
      this.replyComment = e.target.innerHTML;
    },
    //通知已读
    notificationRead() {
      user
        .readNotice({
          // type=0：全部消息  type=1: 回复消息  type=2: 系统消息
          type: this.activeIndex === 0 ? 2 : 1
        })
        .then(res => {
          this[types.SET_UNREADMESSAGECOUNT](res.unreadCount);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.my-information-layer {
  .my-information-content {
    .content {
      padding: 20px;
    }

    .content-wrap {
      padding-top: 20px;
      border-bottom: 1px solid @gray-bg-color;

      .user-img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }

      .item-content {
        padding: 0 0 24px 20px;

        .item-time {
          padding: 4px 0 8px;
          color: @global-muted2;
        }

        .item-detail {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          position: relative;
          text-align: justify;
        }

        .item-link {
          text-align: right;
          color: @global-secondary;
          position: absolute;
          background: linear-gradient(to left, #ffffff, #ffffff 36%, rgba(255, 255, 255, 0.9));
          width: 60px;
          height: 20px;
          bottom: 0px;
          right: 1px;
          cursor: pointer;
        }

        .item-replay {
          margin: 10px 0 8px;
          color: @global-muted;
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

          .input-content {
            height: 111px;
            padding: 8px 0px 10px 0px;
            box-sizing: border-box;
            border-bottom: 1px solid #eff0f2;

            .input-box {
              height: 94px;
              overflow-y: scroll;
              padding-right: 20px;
              padding: 0 20px;
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
      }
    }

    .empty-content {
      color: @global-muted2;
      margin: 30px 0;
    }
  }
}
</style>
