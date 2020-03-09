<template>
  <container class="pay-status-layout">
    <div class="pay-item" v-loading="loading">
      <el-row>
        <el-col :span="3">
          <img class="icon" src="@/assets/img/icon/pay-success.svg" v-if="payForm.payStatus === 1" />
          <img class="icon" src="@/assets/img/icon/pay-failure.svg" v-else-if="payForm.payStatus === 2" />
          <img class="icon" src="@/assets/img/icon/pay-already.svg" v-else />
        </el-col>
        <el-col :span="21">
          <p class="pay-status bold">{{ payStatusText }}</p>
          <p class="order-doubt">{{ payStatusTipText }}</p>
          <p class="order-decript" v-if="payForm.payStatus === 1">
            <span>{{ $t("myOrder.orderPayTime") }}: {{ payForm.payTime }}</span>
            <span>{{ $t("myOrder.orderNumber") }}: {{ payForm.orderNo }}</span>
            <span>{{ $t("myOrder.actuallyPay") }}: {{ payForm.actualPay }}</span>
            <span>{{ $t("myOrder.payWay") }}: {{ payForm.payWay }}</span>
          </p>
        </el-col>
      </el-row>
      <el-row class="btn-group">
        <template v-if="payForm.payStatus === 1">
          <el-button
            v-if="payForm.productType === 1"
            @click="onClickLookCourseHandle"
            type="primary"
            class="look-course common-btn text-center"
          >
            {{ $t("myOrder.lookCourse") }}
          </el-button>
          <el-button
            v-else
            @click="$router.push({name: 'buyBeans'})"
            type="primary"
            class="look-course common-btn text-center"
          >
            {{ $t("commons.huidou") }}{{ $t("commons.balance") }}
          </el-button>
          <el-button @click="$router.push({name: 'myOrder'})" class="order-detail common-btn text-center">
            {{ $t("myOrder.orderDetail") }}
          </el-button>
        </template>
        <template v-else-if="payForm.payStatus === 2">
          <el-button
            class="common-btn"
            @click="
              $router.push({
                name: 'payOrder',
                query: {productId: payForm.productId, productType: payForm.productType, orderNo: payForm.orderNo}
              })
            "
            type="primary"
          >
            {{ $t("myOrder.repay") }}
          </el-button>
        </template>
        <template v-else>
          <el-button class="common-btn" @click="$router.push({name: 'home'})" type="primary">
            {{ $t("myOrder.goHome") }}
          </el-button>
        </template>
        <span @click="$router.push({name: 'feedback'})" class="fr pointer">{{ $t("myOrder.feedback") }}</span>
      </el-row>
    </div>
  </container>
</template>

<script>
import * as api from "@/api/order";
import {payWay, payStatus, currencyText} from "@/utils/env";
import {formatDate, formatMoney} from "@/utils/mUtils";

export default {
  data() {
    return {
      payForm: {
        payStatus: -1,
        payTime: "",
        orderNo: "",
        orderAmount: "",
        actualPay: "",
        payWay: "",
        payChannel: -1,
        productType: 1,
        courseType: 1
      },
      loading: true,
      isRepeatOrder: false //是否重复订单
    };
  },
  created() {
    this.loading = true;
    api
      .getPayResult({
        orderNo: this.$route.query.orderNo,
        payChannel: this.$route.query.payChannel
      })
      .then(res => {
        this.doSetPayModel(res);
      })
      .catch(res => {
        if (res.subCode === "322830A ") {
          this.isRepeatOrder = true;
          this.this.doSetPayModel(res.bodyMessage);
        }
        this.$message(res.message);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  computed: {
    payStatusTipText() {
      if (this.payForm.payStatus === -1) {
        return this.$t("myOrder.loadingTips");
      } else {
        if (this.payForm.productType === 1) {
          return `${this.$t("myOrder.tipsPrev")} ${this.$t("myOrder.tips")}`;
        } else {
          return `${this.$t("myOrder.tipsHuidou")} ${this.$t("myOrder.tips")}`;
        }
      }
    },
    payStatusText() {
      if (this.isRepeatOrder) {
        return "重复支付订单";
      } else {
        if (this.payForm.payStatus > 0) {
          return `订单${payStatus[this.payForm.payStatus]}`;
        }
        return "订单处理中";
      }
    }
  },
  methods: {
    doSetPayModel(res) {
      this.payForm.payStatus = res.orderStatus;
      this.payForm.payWay = payWay[res.payChannel];
      this.payForm.payTime = formatDate(res.orderCreateTime);
      this.payForm.actualPay = formatMoney(res.orderAmount, 2, currencyText[res.orderAmountCurrencyCode]);
      this.payForm.orderNo = res.orderNo;
      this.payForm.payChannel = res.payChannel;
      this.payForm.productType = res.productType;
      this.payForm.productId = res.productId;
      this.payForm.courseType = res.courseType;
    },
    onClickLookCourseHandle() {
      if (this.payForm.courseType === 1) {
        this.$router.push({name: "articleInfo", params: {articleId: this.payForm.productId}});
      } else {
        this.$router.push({name: "videoDetail", params: {id: this.payForm.productId}});
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.pay-status-layout {
  background-color: @gray-bg-color;
  height: 680px;

  .pay-item {
    height: 246px;
    width: 1200px;
    margin: 20px auto;
    background-color: @white;

    .icon {
      margin: 48px 0 0 48px;
    }

    .pay-status {
      font-size: @font-size-ll;
      margin: 46px 0 12px 0px;
      color: @global-default2;
    }

    .order-doubt {
      color: @global-muted;
    }

    .order-decript {
      color: @global-muted;

      span {
        margin-right: 30px;
      }
    }

    .btn-group {
      width: 1104px;
      margin: 0 auto;
      margin-top: 26px;
      border-top: 1px solid @gray-bg-color;

      .common-btn {
        border-radius: 30px;
        width: 144px;
        height: 40px;
        margin: 20px 0 0;
      }

      .look-course {
        margin: 21px 24px 21px 110px;
      }

      .order-detail {
      }

      span {
        margin-top: 33px;
        color: @global-secondary;
      }
    }
  }
}
</style>
