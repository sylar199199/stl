<template>
  <container class="my-order-layer gray-bg">
    <user-panel activeIndex="3">
      <div class="my-order-content">
        <el-row class="title-layer">
          <el-col :span="12">
            <default-tabs class="order-tabs">
              <template slot="tabs">
                <li
                  v-for="item in menuList"
                  :key="item.value"
                  :class="{active: currentOrderStatus === item.value}"
                  @click="onChangeTypeHandle(item.value)"
                >
                  <el-badge v-if="item.label === '待支付' && unpayCount" :value="unpayCount" class="item">
                    {{ item.label }}
                  </el-badge>
                  <template v-else>
                    {{ item.label }}
                  </template>
                  <p class="split"></p>
                </li>
              </template>
            </default-tabs>
          </el-col>
          <el-col :span="12">
            <el-select class="order-select fr" size="small" v-model="duration" @change="onChangeDurationHandle">
              <el-option
                v-for="item in durationOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <div class="content" v-loading="loading">
          <table class="order-table" v-for="item in orderList" :key="item.name">
            <thead>
              <tr>
                <th class="text-left" colspan="2">
                  <span>{{ $t("myOrder.orderPayTime") }}：{{ item.createTime | formatDate }}</span>
                  <span>{{ $t("myOrder.orderNumber") }}：{{ item.orderNo }}</span>
                </th>
                <th class="text-right pointer" @click="lookOrderDetail(item.orderNo)">
                  {{ $t("myOrder.orderDetail") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="info" :class="{'huidou-info': item.productType === 2}">
                  <el-row>
                    <el-col :span="18">
                      <productInfo
                        :data="item"
                        :product-id="item.productId"
                        :product-type="item.productType"
                      ></productInfo>
                    </el-col>
                    <el-col v-if="item.productType === 1" class="origin-price" :span="6">
                      <img class="huidou-icon vertical-align-middle" src="@/assets/img/icon/huidou.png" />
                      <span class="text-default2 text-lg vertical-align-middle">{{ item.price }}</span>
                    </el-col>
                  </el-row>
                </td>
                <td class="price text-center">
                  <p class="text-lg">
                    <span class="text-default2 text-lg">
                      <span class="text-muted2">{{ $t("myOrder.totalPrice") }}：</span>
                      <span class="text-danger text-lg">
                        <span v-if="item.productType === 2">
                          {{ item.actualPriceCurrencyCode | currencyCode }}
                        </span>
                        <img v-else class="huidou-icon" src="@/assets/img/icon/huidou.png" />
                        <span>{{ item.price }}</span>
                      </span>
                    </span>
                  </p>
                  <p class="text-lg">
                    <span class="text-muted2">{{ $t("myOrder.needPay") }}：</span>
                    <span class="text-danger text-lg">
                      <span
                        v-if="
                          item.productType === 2 ||
                            (item.payChannel !== -1 && item.payChannel !== 4) ||
                            item.orderStatus === 5 ||
                            item.orderStatus === 6
                        "
                      >
                        {{ item.actualPriceCurrencyCode | currencyCode }}
                      </span>
                      <img v-else class="huidou-icon" src="@/assets/img/icon/huidou.png" />
                      <span>{{ item.actualPrice }}</span>
                    </span>
                  </p>
                </td>
                <td class="opt text-center">
                  <el-button
                    round
                    class="pay-btn"
                    v-if="item.orderStatus === 2"
                    type="primary"
                    @click="
                      $router.push({
                        name: 'payOrder',
                        query: {productId: item.productId, productType: item.productType, orderNo: item.orderNo}
                      })
                    "
                  >
                    {{ $t("myOrder.toPay") }}
                  </el-button>
                  <p class="text-muted2 text-lg" v-else>{{ item.orderStatus | statusText }}</p>
                  <p class="pointer" v-if="item.orderStatus !== 1" @click="onClickOptOrderHandle(item)">
                    {{ item.orderStatus | optOderText }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <el-row v-if="orderList.length === 0" class="empty-content text-center">
            <img src="@/assets/img/icon/empty-content.svg" />
            <p>{{ $t("commons.noRelateContent") }}</p>
          </el-row>
        </div>
        <el-row class="pagination-layer">
          <el-col :span="16">
            <pagination
              :page-index="pagination.index"
              :page-total="pagination.total"
              :page-size="pagination.size"
              @onCurrentChange="paginationChangeHandle"
            ></pagination>
          </el-col>
        </el-row>
      </div>
    </user-panel>
    <!--订单详情灯箱-->
    <el-dialog
      custom-class="default-dialog dialog-pay-layer"
      :show-close="false"
      width="440px"
      :visible.sync="dialogPayVisible"
    >
      <icon-svg class="close-btn" icon-class="icon-close" @click.native="dialogPayVisible = false"></icon-svg>
      <h2>订单详情</h2>
      <ul class="order-detail-list scroll-bar">
        <li>
          <span>{{ $t("myOrder.orderNumber") }}</span>
          <span>{{ orderDetail.orderNo }}</span>
        </li>
        <li>
          <span>{{ $t("myOrder.goodsName") }}</span>
          <span>{{ orderDetail.productName }}</span>
        </li>
        <li>
          <span>{{ $t("myOrder.orderState") }}</span>
          <span>
            {{ orderDetail.status | statusText }}
          </span>
        </li>
        <li>
          <span>{{ $t("myOrder.buyer") }}</span>
          <span>{{ orderDetail.userName }}</span>
        </li>
        <li>
          <span>{{ $t("myOrder.buyerPhone") }}</span>
          <span>{{ orderDetail.phone }}</span>
        </li>
        <li>
          <span>{{ $t("myOrder.buyerEmail") }}</span>
          <span>{{ orderDetail.email }}</span>
        </li>
        <li>
          <span>{{ $t("myOrder.goodsPrice") }}</span>
          <span>{{ orderDetail.productAmount }} {{ $t("buyBeans.huidou") }}</span>
        </li>
        <li>
          <span>{{ $t("myOrder.cashPayment") }}</span>
          <span>{{ orderDetail.payAmount }} {{ orderDetail.currencyCode | currencyText }}</span>
        </li>
        <li>
          <span>{{ $t("myOrder.payWay") }}</span>
          <span>
            {{ payType }}
          </span>
        </li>
        <li>
          <span>{{ $t("myOrder.createTime") }}</span>
          <span>{{ orderDetail.createTime | formatDate }}</span>
        </li>
      </ul>
      <p class="text-center">
        <el-button class="btn-block" round type="primary" @click="dialogPayVisible = false">保存</el-button>
      </p>
    </el-dialog>
    <!--购买提示灯箱-->
    <el-dialog class="dialog-paid-layer text-center" width="500px" :visible.sync="dialogPaidVisible">
      <h3>
        {{ $t("myOrder.bugCourseStudy") }}
      </h3>
      <p>
        <el-button slot="reference" type="primary" @click="shareDialogVisible = true">
          {{ $t("myOrder.shareForFree") }}
        </el-button>
      </p>
      <p>
        <el-button @click="payOrder()">{{ $t("myOrder.bugOriginPrice") }}</el-button>
      </p>
    </el-dialog>
    <!--分享灯箱-->
    <share-layer
      :shareUrl="shareUrl"
      :shareWeiXinUrl="shareWeiXinUrl"
      :dialogVisible="shareDialogVisible"
      @changeDialogVisible="onChangeShareDialogVisibleHandle"
    ></share-layer>
  </container>
</template>

<script>
import userPanel from "@/layout/user/panel";
import defaultTabs from "@/components/defaultTabs";
import pagination from "@/components/pagination";
import shareLayer from "@/components/share/share";
import productInfo from "@/view/user/order/components/productInfo";
import {payStatus, currencyCode, currencyText} from "@/utils/env";
import * as api from "@/api/order";
import {formatDate} from "@/utils/mUtils";

export default {
  name: "myOrder",
  components: {
    userPanel,
    defaultTabs,
    pagination,
    shareLayer,
    productInfo
  },
  data() {
    return {
      menuList: this.$t("myOrder.menuList"),
      duration: 1,
      durationOpt: this.$t("myOrder.durationOpt"),
      orderList: [],
      rechargeList: [],
      dialogPaidVisible: false,
      dialogPayVisible: false,
      shareUrl: window.location.href,
      shareWeiXinUrl: window.location.href,
      shareDialogVisible: false,
      pagination: {
        index: 1,
        size: 20,
        total: 0
      },
      loading: false,
      orderDetail: {},
      unpayCount: 0
    };
  },
  watch: {
    currentOrderStatus(value) {
      this.pagination.index = 1;
      this.getContentList(); //切换更新列表
    }
  },
  created() {
    this.getContentList();
  },
  mounted() {},
  filters: {
    statusText(status) {
      return payStatus[status];
    },
    currencyCode(str) {
      return currencyCode[str];
    },
    currencyText(str) {
      return currencyText[str];
    },
    optOderText(status) {
      if (status === 2) {
        return "取消订单";
      } else if (status === 3 || status === 4) {
        return "删除订单";
      }
      return "";
    },
    formatDate
  },

  computed: {
    currentOrderStatus() {
      return Number(this.$route.query.type) || 1;
    },
    payType() {
      let type = "";
      switch (this.orderDetail.payChannel) {
        case 1:
          type = "支付宝";
          break;
        case 2:
          type = "微信";
          break;
        case 3:
          type = "Paypal";
          break;
        case 4:
          type = "汇豆支付";
          break;
        case 6:
          type = "苹果支付";
          break;
        case "null":
          type = "—";
          break;
        default:
          break;
      }
      return type;
    }
  },
  methods: {
    getContentList() {
      api
        .getOrderList({
          pageIndex: this.pagination.index,
          pageSize: this.pagination.size,
          queryDateType: this.duration,
          queryStatusType: this.currentOrderStatus
        })
        .then(res => {
          this.orderList = res.pageDatas;
          this.pagination.total = res.rowCount;
          api.getUnPayCount().then(res => {
            this.unpayCount = res.count;
          });
        });
    },
    onChangeTypeHandle(index) {
      this.$router.push({name: "myOrder", query: {type: index}});
      this.duration = 1;
    },
    onChangeDurationHandle(value) {
      this.duration = value;
      this.pagination.index = 1;
      this.getContentList();
    },
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getContentList(this.pagination.index, this.pagination.size);
    },
    onChangeShareDialogVisibleHandle(visible) {
      this.shareDialogVisible = visible;
    },
    onClickOptOrderHandle(item) {
      if (item.orderStatus === 2) {
        ///未支付取消订单
        this.$dialog
          .confirm({
            title: "取消订单",
            msg: "是否取消此订单"
          })
          .then(res => {
            api
              .cancelOrder({
                orderNo: item.orderNo
              })
              .then(res => {
                this.$message.success("取消订单成功~");
                this.getContentList(this.pagination.index, this.pagination.size);
              });
          })
          .catch(res => {
            this.$message.error(res.message);
          });
      } else if (item.orderStatus === 4 || item.orderStatus === 3) {
        this.$dialog
          .confirm({
            title: "删除订单",
            msg: "是否删除此订单"
          })
          .then(res => {
            api
              .deleteOrder({
                orderNo: item.orderNo
              })
              .then(res => {
                this.$message.success("删除订单成功~");
                this.getContentList(this.pagination.index, this.pagination.size);
              });
          })
          .catch(res => {
            this.$message.error(res.message);
          });
      }
    },
    payOrder() {
      this.$router.push({name: "payOrder"});
    },
    //点击查看详情
    lookOrderDetail(val) {
      this.getOrderDetail(val);
    },
    //获取订单详情
    getOrderDetail(val) {
      api
        .getDetail({
          orderNo: val
        })
        .then(res => {
          this.orderDetail = res;
          this.dialogPayVisible = true;
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/view/user/order/myOrder.less";
</style>
