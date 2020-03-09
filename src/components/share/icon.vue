<template>
  <div class="share-icon-layer inline-block vertical-align-middle">
    <share-layer v-bind="$attrs" v-on="$listeners"></share-layer>
    <el-popover
      popper-class="popover-tips-default"
      :visible-arrow="false"
      placement="bottom"
      trigger="hover"
      content="分享"
    >
      <div slot="reference" class="share-icon-img-layer text-center" @click="onClickShareIconHandle">
        <slot name="icon">
          <icon-svg class="icon-share" icon-class="icon-share"></icon-svg>
        </slot>
      </div>
    </el-popover>
    <template v-if="!isBought">
      <slot name="freeGet">
        <span v-if="isFree" class="free-icon text-xs text-center">免费</span>
      </slot>
    </template>
  </div>
</template>

<script>
import shareLayer from "./share";

export default {
  name: "shareIcon",
  props: {
    tips: {
      type: String,
      default: "free"
    },
    isFree: {
      type: Boolean,
      default: false
    },
    isBought: {
      type: Boolean,
      default: false
    }
  },
  components: {
    shareLayer
  },
  methods: {
    onClickShareIconHandle() {
      this.$emit("changeDialogVisible", true);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.share-icon-layer {
  position: relative;
  cursor: pointer;
  width: 100px;

  .share-icon-img-layer {
    width: 40px;
    height: 26px;
    padding: 7px 0;
    background-color: @gray-bg-color;
    border-radius: 50%;

    .icon-share {
      font-size: 26px;
      color: @global-muted;
    }
  }

  .share-icon-img {
    width: 24px;
    height: 24px;
  }

  .free-get-icon {
    position: absolute;
    right: 10px;
    top: -5px;
    width: 52px;
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    background-color: rgba(59, 204, 109, 0.12);
    color: #3bcc6d;
  }
  .free-icon {
    position: absolute;
    left: 64px;
    top: 10px;
    width: 32px;
    border: solid 1px #3bcc6d;
    color: #3bcc6d;
  }
}
</style>
