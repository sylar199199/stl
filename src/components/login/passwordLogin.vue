<template>
  <el-form :model="loginForm" :rules="rules" status-icon ref="loginForm" class="password-login-form">
    <el-form-item prop="mobile">
      <el-input
        v-model="loginForm.mobile"
        :placeholder="$t('account.phone')"
        @keyup.enter.native="onSubmitFormHandle()"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        autocomplete="off"
        :placeholder="$t('account.password')"
        show-password
        maxlength="20"
        minlength="6"
        @keyup.enter.native="onSubmitFormHandle()"
      ></el-input>
    </el-form-item>
    <el-popover
      popper-class="popover-tips-default"
      :offset="100"
      :visible-arrow="false"
      placement="bottom"
      trigger="hover"
      :content="$t('account.goHuiliao')"
    >
      <p slot="reference" class="text-right">
        <a href="https://dl.fxchat.cn/login/forgetpassword" class="text-secondary">
          {{ $t("account.forgetPassqord") }}
        </a>
      </p>
    </el-popover>

    <p>
      <el-button
        class="submit-btn btn-block"
        :loading="submitBtn.loading"
        :disabled="formIsEmpty"
        type="primary"
        @click="onSubmitFormHandle"
      >
        {{ $t("account.login") }}
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
    <other-login></other-login>
  </el-form>
</template>
<script>
import * as validator from "@/utils/validator";
import * as api from "@/api/user";
import {setToken} from "@/utils/auth";
import otherLogin from "./components/otherLogin";
import md5 from "blueimp-md5";
import * as types from "@/store/types";

export default {
  name: "passwordLogin",
  components: {
    otherLogin
  },
  data() {
    return {
      loginForm: {
        mobile: "",
        password: ""
      },
      submitBtn: {
        loading: false
      },
      rules: {
        mobile: [{validator: validator.mobile, trigger: "burl"}],
        password: [{validator: validator.password, trigger: "burl"}]
      }
    };
  },
  computed: {
    formIsEmpty() {
      if (this.loginForm.mobile && this.loginForm.password) {
        return false;
      }
      return true;
    }
  },
  methods: {
    onSubmitFormHandle() {
      //提交表单
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          this.submitBtn.loading = true;
          api
            .accountLogin({
              account: this.loginForm.mobile,
              clientType: 4,
              loginType: 1,
              password: md5(this.loginForm.password)
            })
            .then(
              res => {
                let userList = res.data.userList;
                setToken("token", userList.token);
                this.$router.push({path: "/"});
              },
              res => {
                this.$message.error(res.message);
              }
            )
            .finally(() => {
              this.submitBtn.loading = false;
            });
        }
      });
    },
    onClickLinkHandle() {
      this[types.SET_LOGIN_DIALOG_VISIBLE](false);
    }
  }
};
</script>
<style lang="less" scoped>
.password-login-form {
  margin: 30px 0 0;

  h1,
  h2 {
    margin: 0 0 20px;
  }

  p {
    margin: 0 0 15px;
  }

  .submit-btn {
  }
}
</style>
