<template>
  <div>
    <div
      class="content-abstract-layer"
      :style="{height: limitHeight}"
      @click="articleIntroduceDialogVisible = true"
      v-html="content"
    >
      <div v-if="isShowMoreBtn" class="more text-right">更多</div>
    </div>
    <el-dialog
      class="article-introduce-dialog"
      custom-class="default-dialog"
      :show-close="false"
      :visible.sync="articleIntroduceDialogVisible"
      width="440px"
    >
      <icon-svg
        class="close-btn"
        icon-class="icon-close"
        @click.native="articleIntroduceDialogVisible = false"
      ></icon-svg>
      <div class="detail-content">
        <h2>{{ $t("article.introduction") }}</h2>
        <div class="text scroll-bar" v-html="content"></div>
        <el-row class="bottom">
          <el-col class="text-muted2" :span="12">
            {{ name }}
          </el-col>
          <el-col class="text-muted text-right" :span="12">共{{ count }}{{ unit }}</el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "contentAbstract",
  props: {
    content: {
      default: "",
      type: String
    },
    count: {
      default: 0,
      type: Number
    },
    limitHeight: {
      default: "60px",
      type: String
    },
    name: {
      default: "",
      type: String
    },
    unit: {
      default: "章",
      type: String
    }
  },
  watch: {
    content(val) {
      this.isShowMoreBtn = val.length > 180 ? true : false;
    }
  },
  data() {
    return {
      articleIntroduceDialogVisible: false,
      isShowMoreBtn: true
    };
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.content-abstract-layer {
  position: relative;
  margin: 20px 0 25px;
  overflow: hidden;
  text-align: justify;
  cursor: pointer;

  &:hover {
    color: @global-default4;
  }

  .more {
    position: absolute;
    background: linear-gradient(to left, #ffffff, #ffffff 36%, rgba(255, 255, 255, 0));
    width: 60px;
    height: 16px;
    bottom: 1px;
    right: 1px;
    cursor: pointer;
  }
}

.article-introduce-dialog {
  .detail-content {
    padding: 32px 20px 32px 32px;

    h2 {
      margin: 0 0 40px;
    }

    .text {
      width: 380px;
      padding: 0 20px 0 0;
      height: 236px;
      overflow-y: auto;
      color: #5f666f;
    }

    .bottom {
      margin: 100px 0 0;
    }
  }
}
</style>
