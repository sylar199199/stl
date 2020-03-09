<template>
  <container class="achievement-layer">
    <div class="container">
      <div class="login-title">
        <p class="login-claim">{{ $t("account.loginObtain") }}</p>
        <p class="login-verify text-ll ">{{ $t("account.verifyObtain") }}</p>
      </div>
      <div class="content">
        <phone-verification
          class="phone-verification-component"
          ref="phoneVerficationRef"
          :codeParam="codeParam"
          :form="loginForm"
          :code.sync="loginForm.code"
          :mobile.sync="loginForm.mobile"
          :region.sync="loginForm.region"
        ></phone-verification>
        <el-button class="btn-block obtain-btn" :disabled="formIsEmpty" type="primary" @click="loginHandle">
          {{ $t("account.obtainBean") }}
        </el-button>
      </div>
      <div class="rule-tips">
        <span>{{ $t("share.ruleDescription") }}</span>
        <div class="detail">
          <p class="text-sm">1.{{ $t("account.ruleOne") }}</p>
          <p class="text-sm">2.{{ $t("account.ruleTwo") }}</p>
          <p class="text-sm">3.{{ $t("account.ruleThree") }}</p>
        </div>
      </div>
    </div>
  </container>
</template>

<script>
import * as api from "@/api/user";
import {setToken} from "@/utils/auth";
import {setStore} from "@/utils/mUtils";
import * as types from "@/store/types";
import {mapMutations} from "vuex";
import phoneVerification from "@/components/phoneVerification";
export default {
  components: {
    phoneVerification
  },
  data() {
    return {
      loginForm: {
        region: 6541, //当前区域
        mobile: "",
        code: ""
      },
      submitBtn: {
        loading: false
      },
      codeParam: {
        platformType: 4,
        sendType: 15
      }
    };
  },
  computed: {
    formIsEmpty() {
      if (this.loginForm.region && this.loginForm.mobile && this.loginForm.code) {
        return false;
      }
      return true;
    }
  },
  methods: {
    ...mapMutations([types.SET_LOGIN_DIALOG_VISIBLE, types.SET_LOGIN_INFO]),
    loginHandle() {
      //提交表单
      if (this.$refs.phoneVerficationRef.validator()) {
        this.submitBtn.loading = true;
        let userInfo = this.loginForm;
        api
          .SMSLogin({
            telephone: this.loginForm.mobile,
            countryCode: this.loginForm.region,
            clientType: 4,
            platformType: 4,
            code: this.loginForm.code
          })
          .then(
            res => {
              setToken("token", res.token); //保存token密钥
              setStore("uid", res.uid); //保存uid
              this[types.SET_LOGIN_INFO](res); //保存用户信息
              this[types.SET_LOGIN_DIALOG_VISIBLE](false);
              this.$router.push({name: "achievement", query: {params: this.$route.query.params}});
            },
            res => {
              this.$message.error(res.messages);
            }
          )
          .finally(() => {
            this.submitBtn.loading = false;
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.achievement-layer {
  height: 745px;
  background-color: @global-default;

  .container {
    height: 720px;
    margin: 24px auto 0;
    border-radius: 8px;
    background-color: #27201e;

    .login-title {
      padding: 48px 0 24px 160px;

      .login-claim {
        font-size: 30px;
        color: #ef275e;
      }

      .login-verify {
        padding-top: 24px;
        color: @white;
      }
    }

    .content {
      width: 304px;
      height: 400px;
      margin: 0 auto;

      .obtain-btn {
        margin: 46px 0;
        width: 304px;
        height: 40px;
      }
    }

    .rule-tips {
      color: @white;
      padding-left: 160px;

      .detail {
        color: #868281;
        line-height: 23px;
        margin-top: 12px;
      }
    }
  }
}
</style>
