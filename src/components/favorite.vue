<template>
  <div class="favorite-layer text-center vertical-align-middle" @click.stop="onChangeStatusHandle">
    <el-popover
      popper-class="popover-tips-default"
      :visible-arrow="false"
      placement="bottom"
      trigger="hover"
      :content="tipsText"
    >
      <div slot="reference" class="share-layer text-center">
        <icon-svg
          icon-class="icon-favorite"
          class="icon-favorite inline-block"
          :class="{active: isFavorite}"
        ></icon-svg>
      </div>
    </el-popover>
  </div>
</template>

<script>
import * as commonAPI from "@/api/common";
import {mapGetters, mapMutations} from "vuex";
import * as types from "@/store/types";

const favoriteType = {
  articleFavoriteList: 1,
  videoFavoriteList: 2
};
export default {
  name: "favorite",
  props: {
    name: {
      type: String,
      default: ""
    },
    id: {
      type: Number,
      default: 0
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    collectionStatus: {
      type: Boolean,
      default: false
    },
    OffStatus: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ...mapGetters(["userUid"]),
    tipsText() {
      return this.isFavorite ? "取消收藏" : "收藏";
    }
  },
  methods: {
    ...mapMutations([types.SET_LOGIN_DIALOG_VISIBLE]),
    onChangeStatusHandle() {
      if (this.userUid > 0) {
        if (this.isFavorite) {
          //取消收藏
          if (this.collectionStatus) {
            this.$emit("handleFavorite", "cancel");
          } else {
            commonAPI
              .delFavorite({
                objId: this.id,
                objType: favoriteType[this.name]
              })
              .then(res => {
                this.$emit("handleFavorite", "cancel");
                this.$message.success("取消收藏成功~");
              })
              .catch(res => {});
          }
        } else {
          if (this.collectionStatus) {
            if (this.OffStatus === 2) {
              //判断是否下架
              this.$message.error("课程已下架~");
            } else {
              this.$emit("handleFavorite", "success");
            }
          } else {
            commonAPI
              .addFavorite({
                objId: this.id,
                objType: favoriteType[this.name]
              })
              .then(res => {
                this.$emit("handleFavorite", "success");
                this.$message.success("收藏成功~");
              })
              .catch(res => {
                this.$message.error(res.message);
              });
          }
        }
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.favorite-layer {
  cursor: pointer;
  width: 40px;
  height: 34px;
  padding-top: 6px;
  background-color: #f6f7f9;
  border-radius: 50%;
  display: inline-block;

  .share-layer {
    .icon-favorite {
      font-size: 26px;
      color: @global-muted;

      &.active {
        color: @global-danger!important;
      }
    }
  }
}
</style>
