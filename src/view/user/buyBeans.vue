<template>
  <container class="buy-beans-layer gray-bg">
    <user-panel activeIndex="2">
      <div class="my-beans-content">
        <el-row class="title-layer">
          <el-col>
            <default-tabs :list="menuList" :active-index="activeIndex" @change="onChangeTypeHandle"></default-tabs>
          </el-col>
        </el-row>
        <div class="buy-beans">
          <template v-if="activeIndex == 0">
            <el-row>
              <el-col :span="4">
                <span>{{ $t("buyBeans.rechargeBeans") }}</span>
              </el-col>
              <el-col :span="20" class="text-right">
                <span class="text-muted2 text-sm">{{ $t("buyBeans.description") }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8" v-for="item in amountList" :key="item.id">
                <div
                  class="buy-items pointer"
                  @click="changeCheckedIndex(item.id)"
                  :style="{borderColor: checkedIndex === item.id ? borderColor : ''}"
                >
                  <img v-show="checkedIndex === item.id" class="checked-style" src="@/assets/img/icon/checked.svg" />
                  <span v-show="item.overbalance" class="discount-items fl text-center">超值</span>
                  <el-row class="content text-center">
                    <img class="huidou vertical-align-middle" src="@/assets/img/icon/huidou.png" />
                    <span class="text-ll dollor vertical-align-middle">{{ item.foreignExchangeBean }}</span>
                    <span class="text-sm text-default2 vertical-align-middle">{{ $t("buyBeans.huidou") }}</span>
                  </el-row>
                  <el-row class="footer">
                    <el-col :span="24" class="text-center text-default4">
                      <span>{{ item.realAmountCurrencyCode | currencyCode }} {{ item.realAmount }}</span>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
            <div class="buy-beans-footer text-right">
              <el-button
                @click="$router.push({name: 'payOrder', query: {productType: 2, productId: currentRechargeItem.id}})"
                :type="checkedIndex !== -1 ? 'primary' : 'disabled'"
                class="btn-buyBeans"
                :disabled="checkedIndex === -1"
              >
                {{ $t("buyBeans.buyNow") }}
              </el-button>
              <p class="text-muted2 text-sm">{{ $t("commons.tips") }}</p>
            </div>
          </template>
          <template v-else>
            <el-row>
              <el-col :span="12">
                <span class="text-default3 text-default">{{ $t("buyBeans.huidouBill") }}</span>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-select class="order-select" v-model="duration" size="small" @change="onChangeDurationHandle">
                  <el-option
                    v-for="item in durationOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="business-table">
                  <table>
                    <thead>
                      <tr>
                        <th>{{ $t("buyBeans.transactionType") }}</th>
                        <th>{{ $t("buyBeans.transactionHour") }}</th>
                        <th>{{ $t("buyBeans.revenueandExpenditure") }}</th>
                        <th>{{ $t("buyBeans.orderNumber") }}</th>
                      </tr>
                    </thead>
                    <tbody v-for="item in tableList" :key="item.name">
                      <tr class="text-center">
                        <td>{{ item.title }}</td>
                        <td>{{ item.createTime }}</td>
                        <td>{{ item.foreignExchangeBean | judgeValue }}</td>
                        <td>{{ item.orderNo }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </el-col>
            </el-row>
            <el-row class="pagination-layer">
              <el-col :span="24">
                <pagination
                  :page-total="pagination.total"
                  :pageSizes="[10, 15, 20, 30]"
                  @onCurrentChange="paginationChangeHandle"
                  @onSizeChange="paginationChangeSizeHandle"
                ></pagination>
              </el-col>
            </el-row>
            <template v-if="tableList.length === 0">
              <img class="center" src="@/assets/img/icon/empty-content.svg" />
              <div class="center text-center text-muted2">{{ $t("commons.noRelateContent") }}</div>
            </template>
          </template>
        </div>
      </div>
    </user-panel>
  </container>
</template>
<script>
import userPanel from "@/layout/user/panel";
import defaultTabs from "@/components/defaultTabs";
import * as api from "@/api/order";
import * as userApi from "@/api/user";
import pagination from "@/components/pagination";
import {formatDate} from "@/utils/mUtils";
import {currencyCode} from "@/utils/env";

export default {
  components: {
    userPanel,
    defaultTabs,
    pagination
  },
  data() {
    return {
      menuList: this.$t("buyBeans.menuList"),
      borderColor: "#3bcc6d",
      activeIndex: 0,
      checkedIndex: -1,
      loading: false,
      duration: 1,
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      durationOpt: this.$t("buyBeans.durationOpt"),
      amountList: [],
      tableList: []
    };
  },
  filters: {
    currencyCode(str) {
      return currencyCode[str];
    },
    judgeValue(value) {
      if (value <= 0) {
        return value;
      } else {
        return "+" + value;
      }
    }
  },
  created() {
    this.getHuidouContentList();
  },
  computed: {
    currentRechargeItem() {
      let item = this.amountList.filter(item => {
        if (this.checkedIndex === item.id) {
          return true;
        }
      });
      if (item.length) {
        return item[0];
      }
      return {};
    }
  },
  methods: {
    paginationChangeHandle(page) {
      this.pagination.index = page;
      this.getContentList(this.pagination.index, this.pagination.size);
    },
    paginationChangeSizeHandle(size) {
      this.pagination.size = size;
      this.getContentList(pagination.index, this.pagination.size);
    },
    changeCheckedIndex(id) {
      this.checkedIndex = id;
    },
    onChangeTypeHandle(index) {
      this.activeIndex = index;
      this.activeIndex === 0 ? this.getHuidouContentList() : this.getForeignExchangeBeanList();
    },
    onChangeDurationHandle(value) {
      this.getForeignExchangeBeanList();
    },
    getHuidouContentList() {
      api.getBuyHuidouList().then(res => {
        this.amountList = res;
      });
    },
    getForeignExchangeBeanList(pageIndex = 1, pageSize = 16) {
      userApi
        .foreignExchangeBeanList({
          pageIndex,
          pageSize,
          queryDateType: this.duration
        })
        .then(res => {
          if (res.pageDatas != []) {
            this.tableList = res.pageDatas.map(item => {
              item.createTime = formatDate(item.createTime, "YYYY-MM-DD hh:mm:ss");
              return item;
            });
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/view/user/order/buyBeans.less";
</style>
