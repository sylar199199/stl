<template>
  <div class="pay-mode-radio-layer">
    <el-row>
      <el-col :span="8">
        <div
          class="pay-radio-list text-center"
          @click="onChangeRadioHandle(4, disabledHuidou)"
          :class="{active: radioValue === 4}"
        >
          <el-radio class="pay-radio" :disabled="disabledHuidou" :value="radioValue" :label="4" border>
            <img class="vertical-align-middle" src="@/assets/img/icon/huidou.svg" />
            <span class="vertical-align-middle">
              {{ $t("myOrder.huidouPayment") }}
            </span>
          </el-radio>
        </div>
      </el-col>
      <template v-if="currentLanguage === 1">
        <el-col :span="8">
          <div
            class="pay-radio-list text-center"
            @click="onChangeRadioHandle(2, disabledWX)"
            :class="{active: radioValue === 2}"
          >
            <el-radio
              :value="radioValue"
              class="pay-radio"
              :disabled="disabledWX"
              :class="{gray: disabledWX}"
              :label="2"
              border
            >
              <img class="vertical-align-middle" src="@/assets/img/icon/weixin_pay.svg" />
              <span class="vertical-align-middle" :class="{'text-muted3': disabledWX}">
                微信支付
              </span>
            </el-radio>
          </div>
        </el-col>
        <el-col :span="8">
          <div
            class="pay-radio-list text-center"
            @click="onChangeRadioHandle(1, disabledZFB)"
            :class="{active: radioValue === 1}"
          >
            <el-radio
              :disabled="disabledZFB"
              :value="radioValue"
              class="pay-radio"
              :class="{gray: disabledZFB}"
              :label="1"
              border
            >
              <img class="vertical-align-middle" src="@/assets/img/icon/zhifubao.svg" />
              <span class="vertical-align-middle" :class="{'text-muted3': disabledZFB}">
                {{ $t("myOrder.zhifubaoPayment") }}
              </span>
            </el-radio>
          </div>
        </el-col>
      </template>
      <template v-else>
        <el-col :span="8">
          <div
            class="pay-radio-list text-center"
            @click="onChangeRadioHandle(3, disabledPaypal)"
            :class="{active: radioValue === 3}"
          >
            <el-radio
              :disabled="disabledZFB"
              :value="radioValue"
              class="pay-radio"
              :class="{gray: disabledZFB}"
              :label="3"
              border
            >
              <img class="vertical-align-middle" src="@/assets/img/icon/pay-pal.svg" />
            </el-radio>
          </div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  props: {
    radioValue: {
      default: -1,
      type: Number
    },
    disabledHuidou: {
      default: false,
      type: Boolean
    },
    disabledWX: {
      default: false,
      type: Boolean
    },
    disabledZFB: {
      default: false,
      type: Boolean
    },
    disabledPaypal: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(["currentLanguage"])
  },
  methods: {
    //切换radio
    onChangeRadioHandle(val, isDisable) {
      if (!isDisable) {
        this.$emit("change", val);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.pay-mode-radio-layer {
  .pay-radio-list {
    ::v-deep .pay-radio {
      padding: 50px 0;
      width: 350px;
      height: auto;
      border-radius: 8px;
      border: 2px solid @gray-bg-color;

      .el-radio__inner {
        border-color: @gray-bg-color;
        background-color: @gray-bg-color;
        width: 20px;
        height: 20px;

        &:after {
          height: 8px;
          width: 8px;
        }
      }

      &.is-checked {
        border-color: @global-success;
        background-color: #f4fcf7;

        .el-radio__inner {
          border-color: @global-success;
          background-color: @global-success;
        }
      }

      .el-radio__label {
        color: @global-default3;
        font-size: 18px;

        img {
          margin: 0 5px 0 0;
        }
      }
    }
  }
}
</style>
