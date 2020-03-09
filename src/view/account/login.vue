<template>
  <container class="login-layer">
    <div class="container">
      <div class="content">
        <el-row :gutter="200">
          <el-col :span="12">需插画组出汇课堂的插画</el-col>
          <el-col class="form-layer" :span="12">
            <h1>{{ $t("account.huiketang") }}</h1>
            <h2>{{ $t("account.goHuiketang") }}</h2>
            <div v-if="loginWay == '0'">
              <p class="text-right" @click="loginWay = '1'">{{ $t("account.accountSecret") }}</p>
              <mobile-login></mobile-login>
            </div>
            <div v-else>
              <p class="text-right" @click="loginWay = '0'">{{ $t("account.loginAndRegister") }}</p>
              <password-login></password-login>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </container>
</template>

<script>
import * as api from "@/api/user";
import {setToken} from "@/utils/auth";
import * as validator from "@/utils/validator";
import {mapMutations} from "vuex";
import * as types from "@/store/types";
import mobileLogin from "@/components/login/mobileLogin";
import passwordLogin from "@/components/login/passwordLogin";

export default {
  components: {
    mobileLogin,
    passwordLogin
  },
  data() {
    return {
      loginWay: "0"
    };
  },
  created() {
    this[types.USER_SET_NAME](""); //清除vuex的用户名，方便看退出后效果
  },
  mounted() {},
  methods: {
    ...mapMutations([types.USER_SET_NAME]),
    onClickSendSMSHandle() {
      //点击获取验证码
      this.$refs["loginForm"].validateField("mobile", error => {
        //验证手机号码输入框
        if (!error) {
          api
            .getUserMobileCode()
            .then(res => {})
            .finally(this.$refs["sendSMSBtn"].startCount());
        }
      });
    },
    onSubmitFormHandle() {
      //提交表单
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          this.submitBtn.loading = true;
          let userInfo = this.loginForm;
          api
            .SMSLogin(userInfo)
            .then(res => {
              let userList = res.data.userList;
              setToken("token", userList.token);
              this.$router.push({path: "/"});
            })
            .finally(() => {
              this.submitBtn.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/view/account/login.less";
</style>
