<template>
  <div>
    <div
      v-html="linkHtml"
      class="content-abstract-layer"
      ref="contentAbstractDom"
      :style="{
        height,
        overflow: isShowMoreBtn ? 'hidden' : 'visible'
      }"
    >
      <div v-if="isShowMoreBtn" class="more text-right text-primary2" @click="onClickAutoHeightHandle">
        {{ moreText }}
      </div>
    </div>
  </div>
</template>

<script>
import linkifyHtml from "linkifyjs/html";

export default {
  name: "contentAbstract",
  props: {
    limitHeight: {
      default: 39,
      type: Number
    },
    content: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isOpen: true,
      isShowMoreBtn: false
    };
  },
  mounted() {
    this.doCountHeightLimit();
  },
  computed: {
    linkHtml() {
      return linkifyHtml(this.content, {
        target: "_blank"
      });
    },
    height() {
      return this.isOpen ? "auto" : this.limitHeight + "px";
    },
    moreText() {
      return this.isOpen ? "收起" : this.$t("video.expand");
    }
  },
  methods: {
    onClickAutoHeightHandle() {
      this.isOpen = !this.isOpen;
    },
    doCountHeightLimit() {
      if (this.content && this.content.length > 160) {
        this.isOpen = false;
        this.isShowMoreBtn = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.content-abstract-layer {
  position: relative;
  text-align: justify;

  ::v-deep a {
    color: @global-secondary;
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
</style>
