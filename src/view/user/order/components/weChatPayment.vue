<template>
  <el-dialog
    custom-class="default-dialog"
    class="weChat-payment-dialog"
    :show-close="false"
    :visible="visible"
    @open="createWechatPayCode"
    width="400px"
  >
    <icon-svg class="close-btn" icon-class="icon-close" @click.native="onCloseDialogHandle"></icon-svg>
    <div class="wechat-payment-layer text-center">
      <h2>提示</h2>
      <p class="text-lg">
        {{ $t("myOrder.actualPay") }}：
        <span class="pay-money">￥{{ this.payMoney | formatMoney }}</span>
      </p>
      <p class="text-lg tip">{{ $t("myOrder.payTip") }}</p>
      <div class="qr-layer">
        <div class="qrcode" ref="qrCodeUrl"></div>
      </div>
      <p class="text-lg scan-pay">{{ $t("myOrder.payByWeixin") }}</p>
    </div>
  </el-dialog>
</template>

<script>
import QRCode from "qrcodejs2";
import {formatMoney} from "@/utils/mUtils";
export default {
  props: {
    weChatPayUrl: String,
    payMoney: Number,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFirstOpen: true
    };
  },
  filters: {
    formatMoney
  },
  methods: {
    //生成微信支付二维码
    createWechatPayCode() {
      this.$nextTick(() => {
        if (this.isFirstOpen) {
          this.isFirstOpen = false;
          new QRCode(this.$refs["qrCodeUrl"], {
            text: this.weChatPayUrl, //设置二维码内容
            width: 220,
            height: 220,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        }
      });
    },
    onCloseDialogHandle() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.wechat-payment-layer {
  margin: 0 auto;

  h2 {
    padding: 30px 0;
  }

  .pay-money {
    color: @global-danger;
  }

  .tip {
    color: @global-muted2;
    padding-bottom: 12px;
  }

  .qr-layer {
    width: 220px;
    height: 220px;
    margin: 0 auto;
  }

  .scan-pay {
    padding: 12px 0 48px;
  }
}
</style>
