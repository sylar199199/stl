<template>
  <el-dialog
    :title="opt.title"
    :visible="dialogVisible"
    width="400px"
    center
    :show-close="false"
    :lock-scroll="false"
    custom-class="default-dialog default-confirm-dialog"
  >
    <icon-svg
      v-if="isCancel"
      class="close-btn"
      icon-class="icon-close"
      @click.native="dialogVisible = false"
    ></icon-svg>
    <p class="text-center">{{ opt.msg }}</p>
    <span slot="footer" class="dialog-footer">
      <template v-if="!isCancel">
        <el-button type="primary" @click="confirm">{{ opt.confirmText }}</el-button>
      </template>
      <template v-else>
        <el-button :type="opt.cancelType" @click="dialogVisible = false">{{ opt.cancelText }}</el-button>
        <el-button :type="opt.confirmType" @click="confirm">{{ opt.confirmText }}</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "defaultConfirm",
  data() {
    return {
      dialogVisible: false,
      isCancel: true,
      opt: {
        title: "确认框",
        msg: "",
        confirmText: "确认",
        confirmType: "default",
        cancelText: "取消",
        cancelType: "primary"
      }
    };
  },
  methods: {
    show(opt) {
      if (Object.prototype.toString.call(opt) === "[object String]") {
        this.opt.msg = opt;
        this.opt.title = "";
      } else {
        for (let key in this.$data.opt) {
          if (opt[key]) {
            this.$data.opt[key] = opt[key];
          }
        }
      }
      this.dialogVisible = true;
    },
    confirm() {
      this.dialogVisible = false;
    },
    cancel() {
      this.dialogVisible = false;
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
