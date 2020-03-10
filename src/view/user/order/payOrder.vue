<template>
  <container class="pay-order-layer">
    <div class="container content">
      <div class="pay-order">
        <h2 class="title">{{ $t("myOrder.orderInfo") }}</h2>
        <el-row class="user-info-layer">
          <el-col :span="1">
            <el-avatar class="vertical-align-middle el-avatar-default" :src="userAvatar"></el-avatar>
          </el-col>
          <el-col :span="15">
            <p class="text-default3">{{ userName }}</p>
            <p>
              <span class="text-muted">{{ $t("myOrder.myHuidou") }}：</span>
              <strong class="text-danger">{{ userAmount }}</strong>
            </p>
          </el-col>
          <el-col :span="8" class="text-right">
            <el-button @click="$router.push({name: 'buyBeans'})" round type="primary" class="recharge-btn">
              {{ $t("myOrder.rechargeBeans") }}
            </el-button>
          </el-col>
        </el-row>
        <div class="pay-order-list text-center">
          <h2 class="text-left text-default3">{{ $t("myOrder.purchaseInfo") }}</h2>
          <table class="pay-order-table">
            <thead>
              <tr>
                <th class="info">{{ $t("myOrder.courseInfo") }}</th>
                <th class="price">{{ $t("myOrder.price") }}</th>
                <th>{{ $t("myOrder.actuallyPay") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-loading="loadData">
                  <product-info :data="product" :product-id="productId" :product-type="productType"></product-info>
                </td>
                <td>
                  <span class="vertical-align-middle" v-if="productType === 2">
                    {{ product.priceCurrencyCode | currencyCode }}
                  </span>
                  <img v-else class="huidou-icon vertical-align-middle" src="@/assets/img/icon/huidou.png" />
                  <strong class="vertical-align-middle">{{ product.price }}</strong>
                </td>
                <td>
                  <strong class="vertical-align-middle text-danger">
                    <img
                      v-if="product.actualPriceCurrencyCode === 'BEAN'"
                      class="huidou-icon vertical-align-middle"
                      src="@/assets/img/icon/huidou.png"
                    />
                    <span v-else>{{ product.actualPriceCurrencyCode | currencyCode }}</span>
                    {{ product.actualPrice }}
                  </strong>
                  <p>
                    <el-tag v-if="product.actualPrice !== product.price" class="discount-tag" type="info" size="small">
                      {{ $t("myOrder.limitedTimeOffer") }}
                    </el-tag>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pay-mode-layer">
          <h2 class="text-default3">{{ $t("myOrder.payWay") }}</h2>
          <pay-mode-radio
            :disabled-huidou="productType === 2"
            :disabledWX="amount === 0"
            :disabledZFB="amount === 0"
            :disabledPaypal="amount === 0"
            class="pay-mode-radio"
            :radio-value="payMode"
            @change="onChangePayModeHandle"
          ></pay-mode-radio>
          <div class="opt-layer text-right ">
            <div v-if="payMode === 4" class="text-lg text-default4 need-pay">
              <div class="text-sm text-muted2" style="line-height: 20px">
                <p class="text-danger" v-if="!isCanBalance">{{ $t("myHuidou.payTip") }}</p>
                <p>{{ $t("myOrder.actuallyPay") }}: {{ product.orderAmountTotal }}{{ priceUnit }}</p>
              </div>
              {{ $t("myOrder.payHuidou") }}:
              <strong class="text-danger">{{ product.orderAmountTotal }}个</strong>
            </div>
            <div v-else class="text-lg text-default4 need-pay">
              {{ $t("myOrder.payCash") }}:
              <strong class="text-danger">
                {{ product.orderCurrencyCode | currencyCode }}{{ amount | formatMoney }}
              </strong>
            </div>
            <p class="opt-btn-layer">
              <el-button class="opt-btn vertical-align-middle" round type="success" @click="onClickShareHandle">
                {{ $t("myOrder.shareForFree") }}
              </el-button>
              <template v-if="currentLanguage === 2">
                <payPalCheckout
                  class="pay-pal-btn vertical-align-middle"
                  v-show="payMode === 3"
                  :amount="amountText"
                  :orderId="this.orderNo"
                  currency="TWD"
                  env="sandbox"
                  locale="zh_TW"
                  :clientId="paypalClientId"
                  @payment-create="onPayPalCreateHandle"
                  @payment-authorized="onPayPalAuthHandle"
                  @payment-completed="onPayPalCompleteHandle"
                ></payPalCheckout>
              </template>
              <el-button
                v-show="payMode !== 3"
                @click="onClickPaymentHandle"
                class="opt-btn vertical-align-middle"
                round
                type="primary"
              >
                立即支付
              </el-button>
            </p>
            <p class="text-muted2">{{ $t("commons.tips") }}</p>
          </div>
        </div>
      </div>
    </div>
    <share-layer
      :shareUrl="webShareUrl"
      :shareWeiXinUrl="shareWeiXinUrl"
      :dialogVisible="shareDialogVisible"
      @changeDialogVisible="onChangeShareDialogVisibleHandle"
    ></share-layer>
    <weChat-payment
      :weChatPayUrl="weChatPayUrl"
      :payMoney="amount"
      :visible.sync="weChatPaymentDialog"
    ></weChat-payment>
    <div ref="payGatewayForm" v-html="formHtml"></div>
  </container>
</template>
<script>
import shareLayer from "@/components/share/share";
import payModeRadio from "@/components/payModeRadio";
import {mapGetters, mapMutations} from "vuex";
import * as api from "@/api/order";
import {formatMoney} from "@/utils/mUtils";
import {orderType} from "@/utils/types";
import productInfo from "@/view/user/order/components/productInfo";
import weChatPayment from "./components/weChatPayment";
import * as types from "@/store/types";
import {currencyCode, webSharePage, H5bSharePage} from "@/utils/env";
let Tid = null;
export default {
  components: {
    shareLayer,
    payModeRadio,
    productInfo,
    weChatPayment,
    payPalCheckout: () => import("@/components/payPalCheckout/payPalCheckoutButton")
  },
  data() {
    return {
      product: orderType,
      amount: 0,
      shareDialogVisible: false,
      payMode: Number(this.$route.query.productType) === 1 ? 4 : -1,
      formHtml: "",
      loadData: true,
      weChatPaymentDialog: false, //微信支付弹窗
      weChatPayUrl: "",
      orderNo: this.$route.query.orderNo,
      paypalClientId: "AeSg0IHyJIoHCO5S5BRgOxrH61u0nqJaOr862uf7leEsDodYTpQyufia0iFDtrMAFOIyJNBzJ3Z_DI4V"
    };
  },
  computed: {
    ...mapGetters(["userName", "userAvatar", "userAmount", "currentLanguage", "userUid"]),
    productId() {
      return Number(this.$route.query.productId);
    },
    productType() {
      return Number(this.$route.query.productType);
    },
    priceUnit() {
      return "汇豆";
    },
    isCanBalance() {
      return this.userAmount >= this.product.actualPrice;
    },
    orderNoUnit() {
      return (
        this.orderNo +
        Math.random()
          .toString()
          .substring(3, 9)
      );
    },
    amountText() {
      if (this.amount) {
        return this.amount.toString();
      }
      return "0";
    },
    webShareUrl() {
      return `${webSharePage}?fromUid=${this.userUid}&objId=${this.productId}&type=${this.product.courseType}&langId=${this.currentLanguage}`;
    },
    shareWeiXinUrl() {
      return `${H5bSharePage}?id=${this.productId}&userId=${this.userUid}&type=${this.product.courseType}&langId=${this.currentLanguage}`;
    }
  },
  created() {
    this.loadData = true;
    if (this.orderNo) {
      //判断是有有订单id查询订单模型
      api
        .getOrderType({
          orderNo: this.orderNo
        })
        .then(res => {
          this.doSetProductContent(res);
        })
        .catch(res => {
          this.$dialog.alert(res.message, () => {
            this.$router.push({name: "myOrder", query: {type: 2}});
          });
        });
    } else {
      api
        .getOrderDetail({
          productId: this.productId,
          productType: this.productType
        })
        .then(res => {
          this.orderNo = res.orderNo;
          this.doSetProductContent(res);
        })
        .catch(res => {
          this.$dialog.alert(res.message, () => {
            this.$router.push({name: "myOrder"});
          });
        });
    }
  },
  filters: {
    currencyCode(str) {
      return currencyCode[str];
    },
    formatMoney
  },
  methods: {
    ...mapMutations([types.SET_USERAMOUNT]),

    doSetProductContent(res) {
      this.product.actualPrice = res.actualPrice;
      this.product.courseType = res.courseType;
      this.product.coverText = res.coverText;
      this.product.coverTextColor = res.coverTextColor;
      this.product.coverType = res.coverType;
      this.product.imageUrl = res.imageUrl;
      this.product.orderAmountTotal = res.orderAmountTotal;
      this.product.price = res.price;
      this.product.title = res.productName;
      this.product.subCourseCount = res.subCourseCount;
      this.product.tagCount = res.tagCount;
      this.product.foreignExchangeBean = res.foreignExchangeBean;
      this.product.chapterId = res.chapterId;
      this.product.orderCurrencyCode = res.orderCurrencyCode;
      this.product.priceCurrencyCode = res.priceCurrencyCode;
      this.product.actualPriceCurrencyCode = res.actualPriceCurrencyCode;
      this.amount = res.orderCurrencyAmountTotal;
      this.loadData = false;
    },
    onChangePayModeHandle(val) {
      this.payMode = val;
    },
    onClickShareHandle() {
      this.shareDialogVisible = true;
    },
    onChangeShareDialogVisibleHandle(visible) {
      this.shareDialogVisible = visible;
    },
    getWeixinOrderStatus(orderNo) {
      //轮询微信订单
      api
        .getWeixinOrderStatus({
          orderId: orderNo
        })
        .then(res => {
          if (res.success) {
            clearInterval(Tid); //清除定时器
            this.$router.push({name: "payStatus", query: {orderNo: this.orderNo, payChannel: this.payMode}});
          }
        })
        .catch(res => {});
    },
    onClickPaymentHandle() {
      if (this.payMode === 4 && !this.isCanBalance) {
        this.$message.error(this.$t("myHuidou.payTip"));
        return;
      }
      api
        .getOrderFrom({
          orderAmountTotal: this.payMode === 4 ? this.product.orderAmountTotal : this.amount,
          orderNo: this.orderNo,
          payChannel: this.payMode,
          productName: this.product.title
        })
        .then(res => {
          //汇豆支付成功
          this.$dialog.alert("汇豆支付成功~", () => {
            let currentAmount = this.userAmount - this.product.orderAmountTotal;
            this[types.SET_USERAMOUNT](currentAmount);
            this.$router.push({name: "myOrder"});
          });
        })
        .catch(res => {
          if (res.subCode === "3228206") {
            //支付宝
            this.formHtml = res.bodyMessage.returnString;
            this.$nextTick(() => {
              let $form = this.$refs["payGatewayForm"].childNodes[0];
              let ua = navigator.userAgent.toLocaleLowerCase();
              if (ua.match(/tencenttraveler/) === null && ua.match(/qqbrowse/) === null) {
                $form.setAttribute("target", "_blank");
                this.$dialog
                  .confirm({
                    title: "充值",
                    msg: "您已经跳转至支付宝收银台,是否已完成充值?",
                    confirmText: "已完成充值",
                    confirmType: "primary",
                    cancelType: "default"
                  })
                  .then(result => {
                    this.$router.push({
                      name: "payStatus",
                      query: {orderNo: this.orderNo, payChannel: this.payMode}
                    });
                  });
              }
              $form.submit();
            });
          } else if (res.subCode === "322820E") {
            this.weChatPayUrl = res.bodyMessage.returnString;
            this.weChatPaymentDialog = true;
            Tid = setInterval(() => {
              this.getWeixinOrderStatus(res.bodyMessage.orderNo);
            }, 2000);
          } else {
            this.$message.error(res.message);
          }
        });
    },
    onPayPalCreateHandle(res) {
      api
        .getOrderFrom({})
        .then(function(res) {
          return res.json();
        })
        .then(function(data) {
          return data.orderID; // Use the same key name for order ID on the client and server
        });
    },
    onPayPalAuthHandle(res) {
      //订单验证
      console.log(res);
    },
    onPayPalCompleteHandle(res) {
      console.log(res);
      //paypal支付完成
      api
        .getPaypalOrderStatus({
          orderId: res.id
        })
        .then(status => {
          api
            .verifyOrderStatus({
              orderId: res.id,
              orderNo: this.orderNo
            })
            .then(res => {
              this.$router.push({name: "payStatus", query: {orderNo: this.orderNo, payChannel: this.payMode}});
            })
            .catch(res => {
              this.$message(res.message);
            });
        })
        .catch(res => {
          this.$message(res.message);
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/view/user/order/payOrder.less";
</style>
