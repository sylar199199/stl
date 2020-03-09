<template>
  <div class="bookmark-layer inline-block" @click="onChangeStatusHandle">
    <el-popover
      slot="reference"
      popper-class="popover-tips-default"
      :visible-arrow="false"
      placement="bottom"
      trigger="hover"
      :content="tipsText"
    >
      <div slot="reference" class="share-icon-img-layer text-center">
        <img class="vertical-align-middle" :src="iconUrl" />
      </div>
    </el-popover>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from "vuex";
import * as api from "@/api/article";
import * as types from "@/store/types";
export default {
  name: "bookmark",
  props: {
    chapterId: {
      type: Number,
      default: 0
    },
    courseId: {
      type: Number,
      default: 0
    },
    addedBookmark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userUid"]),
    iconUrl() {
      return this.addedBookmark ? require("@/assets/icon/label-hover.svg") : require("@/assets/icon/label-normal.svg");
    },
    tipsText() {
      return this.addedBookmark ? "取消书签" : "添加书签";
    }
  },
  methods: {
    ...mapMutations([types.SET_LOGIN_DIALOG_VISIBLE]),
    onChangeStatusHandle() {
      if (this.userUid > 0) {
        if (this.addedBookmark) {
          //取消书签
          api.deleteBookmark({chapterId: this.chapterId}).then(res => {
            this.$emit("handleBookmark", "cancel");
            this.$message.success("取消书签成功~");
          });
        } else {
          api
            .addBookmark({chapterId: this.chapterId, courseId: this.courseId})
            .then(res => {
              this.$emit("handleBookmark", "success");
              this.$message.success("添加书签成功~");
            })
            .catch(res => {
              this.$message.error(res.message);
            });
        }
      } else {
        this[types.SET_LOGIN_DIALOG_VISIBLE](true);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.bookmark-layer {
  cursor: pointer;
  height: 44px;
  line-height: 1;

  img {
    margin-right: 20px;
  }
}
</style>
