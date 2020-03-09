<template>
  <container class="bind-mobile-layer">
    <el-row class="bind-mobile">
      <h2 class="bold">{{ $t("account.accountSafety") }}</h2>
      <div class="bind-mobile-container">
        <el-row class="bind-mobile-title text-center text-lg">{{ $t("account.bindMibile") }}</el-row>
        <el-row class="bind-mobile-box">
          <p class="bind-mobile-tip">{{ $t("account.bindMibileTip") }}</p>
          <phone-verification
            class="phone-verification-component"
            ref="phoneVerficationRef"
            :codeParam="codeParam"
            :form="loginForm"
            :code.sync="loginForm.code"
            :mobile.sync="loginForm.mobile"
            :region.sync="loginForm.region"
          ></phone-verification>
          <el-button class="btn-block register-btn" :disabled="formIsEmpty" type="primary" @click="registerHandle">
            {{ $t("account.finishRegister") }}
          </el-button>
        </el-row>
      </div>
    </el-row>
  </container>
</template>
<script>
import * as api from "@/api/user";
import {setToken} from "@/utils/auth";
import {setStore} from "@/utils/mUtils";
import * as types from "@/store/types";
import phoneVerification from "@/components/phoneVerification";
import {mapMutations} from "vuex";
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
      codeParam: {
        platformType: 4,
        sendType: 1
      },
      submitBtn: {
        loading: false
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
    ...mapMutations([types.SET_LOGIN_INFO]),
    registerHandle() {
      if (this.$refs.phoneVerficationRef.validator()) {
        this.submitBtn.loading = true;
      }
      // 截取url的uuid
      let params = window.location.search;
      let arr = params.slice(1, params.length).split("&");
      let uuid = "";
      arr.forEach(item => {
        let split = item.split("=");
        if (split[0] === "uuid") {
          uuid = split[1];
        }
      });
      let param = {
        authCode: this.loginForm.code,
        countryCode: this.loginForm.region,
        phoneNumber: this.loginForm.mobile,
        intro: "",
        uuid: uuid
      };
      api
        .registerByThirdPhone(param)
        .then(
          res => {
            setToken("token", res.token); //保存token密钥
            setStore("uid", res.uid); //保存uid
            this[types.SET_LOGIN_INFO](res); //保存用户信息
            this.$router.push({name: "home"}); //绑定成功后刷新页面
          },
          res => {
            this.$router.push("/errorMsg");
          }
        )
        .finally(() => {
          this.submitBtn.loading = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables";

.bind-mobile-layer {
  min-height: 740px;
  background-color: @gray-bg-color;

  .bind-mobile {
    width: 1200px;
    margin: 0 auto;

    h2 {
      margin: 48px 0 24px;
      font-size: @font-size-ll;
      color: @global-default;
    }

    .bind-mobile-container {
      background-color: @white;

      .bind-mobile-title {
        height: 64px;
        color: @white;
        line-height: 64px;
        background-color: @global-primary;
        border-radius: @border-radius-base @border-radius-base 0 0;
      }

      .bind-mobile-box {
        margin: 48px 448px 20px 448px;
        border-radius: 0 0 @border-radius-base @border-radius-base;

        .bind-mobile-tip {
          color: @global-default4;
        }

        .phone-verification-component {
          margin-top: 20px;
          color: red;
        }

        .register-btn {
          margin: 46px 0 48px;
          width: 304px;
          height: 40px;
        }
      }
    }
  }
}
</style>
