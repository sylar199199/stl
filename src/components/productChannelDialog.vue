<template>
  <el-dialog
    :title="$t('share.getMethod')"
    :visible="dialogVisible"
    width="400px"
    center
    :show-close="false"
    custom-class="default-dialog product-channel-dialog"
  >
    <icon-svg class="close-btn" icon-class="icon-close" @click.native="onClickCancelHandle"></icon-svg>
    <p>
      <el-button class="btn-block" round type="success" @click="onClickShareHandle">
        {{ $t("myOrder.shareForFree") }}
      </el-button>
    </p>
    <p>
      <el-button class="btn-block" round type="primary" @click="onClickBuyHandle">
        {{ $t("share.originalPriceBuy") }}
      </el-button>
    </p>
  </el-dialog>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import * as types from "@/store/types";

export default {
  name: "productChannelDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    objId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters(["userUid"])
  },
  methods: {
    ...mapMutations([types.SET_LOGIN_DIALOG_VISIBLE]),
    onClickCancelHandle() {
      this.$emit("update:visible", false);
    },
    onClickShareHandle() {
      this.$emit("changeDialogVisible", true);
    },
    onClickBuyHandle() {
      if (this.userUid > 0) {
        this.$router.push({name: "payOrder", query: {productId: this.objId, productType: 1}});
      } else {
        this.$emit("update:visible", false);
        this[types.SET_LOGIN_DIALOG_VISIBLE](true);
      }
    }
  }
};
</script>

<style lang="less">
@import "~@/style/variables";

.product-channel-dialog {
  padding: 30px 100px;

  .el-dialog__header {
    margin: 0 0 50px;
  }

  p {
    margin: 0 0 15px;
  }
}
</style>
