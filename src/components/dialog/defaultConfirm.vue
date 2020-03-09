<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="400px"
    center
    :show-close="false"
    custom-class="default-dialog default-confirm-dialog"
    :close-on-click-modal="closeModal"
  >
    <icon-svg class="close-btn" icon-class="icon-close" @click.native="onClickConfirmHandle(false)"></icon-svg>
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClickConfirmHandle(false)">{{ $t("commons.cancelBtn") }}</el-button>
      <el-button type="warning" @click="onClickConfirmHandle(true)">{{ $t("commons.determineBtn") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "defaultConfirm",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      default: "确认框",
      type: String
    },
    closeModal: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClickConfirmHandle(flag) {
      this.$emit("confirm", flag);
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .default-confirm-dialog {
  .el-dialog__header {
    padding-top: 30px;
  }

  .el-dialog__body {
    margin: 30px auto;
  }

  .el-button {
    width: 144px;
    height: 40px;
    border-radius: 20px;
  }
}
</style>
