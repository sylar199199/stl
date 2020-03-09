<template>
  <container class="gray-bg">
    <div class="container login-agreement">
      <el-row>
        <el-col :span="5">
          <div class="login-agreement-left">
            <p
              @click="activeIndex = 1"
              class="text-center vertical-align-middle"
              :class="{'text-primary': activeIndex === 1}"
            >
              {{ $t("account.userAgreement") }}
            </p>
            <p
              @click="activeIndex = 2"
              class="text-center vertical-align-middle"
              :class="{'text-primary': activeIndex === 2}"
            >
              {{ $t("account.privacyAgreement") }}
            </p>
          </div>
        </el-col>
        <el-col :span="19" class="login-agreement-right">
          <p class="text-lg text-default3 bold">
            {{ activeIndex === 1 ? $t("account.userAgreement") : $t("account.privacyAgreement") }}
          </p>
          <div class="content text-sm" v-html="content"></div>
        </el-col>
      </el-row>
    </div>
  </container>
</template>
<script>
import * as api from "@/api/user";
export default {
  data() {
    return {
      activeIndex: 1,
      content: ""
    };
  },
  created() {
    this.activeIndex = parseInt(this.$route.query.agreementType);
    this.getContent(this.activeIndex);
  },
  watch: {
    activeIndex(newValue) {
      this.getContent(newValue);
    }
  },
  methods: {
    getContent(params) {
      api.getAgreementContent({agreementType: params}).then(res => {
        this.content = res.content;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables.less";
.login-agreement {
  padding-top: 16px;
  padding-bottom: 151px;
  .login-agreement-left {
    background-color: #fff;
    width: 208px;
    padding: 16px;
    border-radius: 4px;
    p {
      margin-right: 16px;
      height: 48px;
      line-height: 48px;
    }
  }
  .login-agreement-right {
    background-color: #fff;
    min-height: 720px;
    border-radius: 4px;
    p {
      height: 60px;
      line-height: 60px;
      padding-left: 32px;
      border-bottom: 1px solid @gray-bg-color;
    }
    div {
      padding: 32px;
    }
  }
}
</style>
