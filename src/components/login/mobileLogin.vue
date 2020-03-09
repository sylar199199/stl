<template>
  <el-form :model="loginForm" status-icon ref="loginForm" class="mobile-login-form">
    <template v-if="!isWxLogin">
      <p class="mobile-code-tips">{{ $t("account.code") }}</p>
      <phone-verification
        class="phone-verification-component"
        ref="phoneVerficationRef"
        :codeParam="codeParam"
        :form="loginForm"
        :code.sync="loginForm.code"
        :mobile.sync="loginForm.mobile"
        :region.sync="loginForm.region"
        @handleKeyUpEnter="onSubmitFormHandle"
      ></phone-verification>
      <p class="text-muted">{{ $t("account.createAccount") }}</p>
      <p>
        <el-button
          class="submit-btn btn-block"
          :loading="submitBtn.loading"
          :disabled="formIsEmpty"
          type="primary"
          @click="onSubmitFormHandle"
        >
          {{ $t("account.loginRegister") }}
        </el-button>
      </p>
      <p class="text-sm">
        {{ $t("account.agree") }}
        <router-link
          target="_blank"
          @click.native="onClickLinkHandle"
          :to="{name: 'loginAgreement', query: {agreementType: 1}}"
          class="text-secondary"
        >
          {{ $t("account.userProtocol") }}
        </router-link>
        和
        <router-link
          target="_blank"
          @click.native="onClickLinkHandle"
          :to="{name: 'loginAgreement', query: {agreementType: 2}}"
          class="text-secondary"
        >
          {{ $t("account.privacyProtocol") }}
        </router-link>
      </p>
      <other-login @weixinLogin="val => (isWxLogin = val)"></other-login>
    </template>
    <wxLogin v-else></wxLogin>
  </el-form>
</template>
<script>
import {mapMutations} from "vuex";
import * as types from "@/store/types";
import * as api from "@/api/user";
import {setToken} from "@/utils/auth";
import otherLogin from "./components/otherLogin";
import phoneVerification from "@/components/phoneVerification";
import {setStore} from "@/utils/mUtils";

export default {
  name: "mobileLogin",
  components: {
    phoneVerification,
    otherLogin,
    wxLogin: () => import("@/components/wxLogin")
  },
  data() {
    return {
      loginForm: {
        region: 6541,
        mobile: "",
        code: ""
      },
      submitBtn: {
        loading: false
      },
      codeParam: {
        platformType: 4,
        sendType: 15
      },
      isWxLogin: false
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
    ...mapMutations([
      types.USER_SET_UID,
      types.USER_SET_NAME,
      types.SET_AVATAR,
      types.SET_INTRODUCE,
      types.SET_LOGIN_DIALOG_VISIBLE,
      types.SET_LOGIN_INFO,
      types.SET_LOGIN_DIALOG_VISIBLE
    ]),
    onSubmitFormHandle() {
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
          .then(res => {
            setToken("token", res.token); //保存token密钥
            setStore("uid", res.uid); //保存uid
            this[types.SET_LOGIN_INFO](res); //保存用户信息
            this[types.SET_LOGIN_DIALOG_VISIBLE](false);
            this.$router.go(0);
          })
          .catch(err => {
            this.$message.error(err.message);
          })
          .finally(() => {
            this.submitBtn.loading = false;
          });
      }
    },
    onClickLinkHandle() {
      this[types.SET_LOGIN_DIALOG_VISIBLE](false);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables";
.mobile-login-form {
  h1,
  h2 {
    margin: 0 0 20px;
  }

  p {
    margin: 0 0 15px;
    &.mobile-code-tips {
      margin-bottom: 20px;
      color: @global-primary2;
    }
  }

  .mobile-txt {
    padding: 0 0 0 8px;
  }

  .code-txt {
    ::v-deep .el-input__inner {
      border-radius: 4px 0 0 4px;
    }
  }

  ::v-deep .count-down-btn {
    border-radius: 0 4px 4px 0;
  }
}
</style>
<style lang="less">
.region-select {
  width: 304px;
}
</style>
