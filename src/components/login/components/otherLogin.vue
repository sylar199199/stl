<template>
  <div class="other-login-layer">
    <p class="order-login-title text-center">
      <span class="text-muted2 text-sm text-center">{{ $t("account.thirdLogin") }}</span>
    </p>
    <el-row class="text-center">
      <!--简体版第三方登录-->
      <template v-if="currentLanguage === 1">
        <el-col :span="6">
          <el-popover
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="汇聊"
          >
            <img slot="reference" src="@/assets/img/icon/huiliao.png" class="login-icon huiliao" />
          </el-popover>
        </el-col>
        <el-col :span="6">
          <el-popover
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="微信"
          >
            <icon-svg
              @click.native="onClickWeixinLoginHandle"
              slot="reference"
              icon-class="icon-weixin"
              class="login-icon weixin"
            />
          </el-popover>
        </el-col>
        <el-col :span="6">
          <el-popover
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="QQ"
          >
            <a slot="reference" :href="QQUri" target="_blank">
              <icon-svg icon-class="icon-qq" class="login-icon qq" />
            </a>
          </el-popover>
        </el-col>
        <el-col :span="6">
          <el-popover
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="微博"
          >
            <a slot="reference" :href="weiboUri" target="_blank">
              <icon-svg slot="reference" icon-class="icon-weibo" class="login-icon weibo" />
            </a>
          </el-popover>
        </el-col>
      </template>
      <!--繁体版第三方登录-->
      <template v-if="currentLanguage === 2">
        <el-col :span="6">
          <el-popover
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="google"
          >
            <a slot="reference" :href="googleUri" target="_blank">
              <icon-svg slot="reference" icon-class="icon-google" class="login-icon google" />
            </a>
          </el-popover>
        </el-col>
        <el-col :span="6">
          <el-popover
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="facebook"
          >
            <a slot="reference" :href="facebookUri" target="_blank">
              <icon-svg slot="reference" icon-class="icon-facebook" class="login-icon facebook" />
            </a>
          </el-popover>
        </el-col>
        <el-col :span="6">
          <el-popover
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="twitter"
          >
            <a slot="reference" :href="QQUri" target="_blank">
              <icon-svg icon-class="icon-twitter" class="login-icon twitter" />
            </a>
          </el-popover>
        </el-col>
        <el-col :span="6">
          <el-popover
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            content="领英"
          >
            <a slot="reference" :href="linkedinUri" target="_blank">
              <icon-svg icon-class="icon-linkedin" class="login-icon linkedin" />
            </a>
          </el-popover>
        </el-col>
      </template>
    </el-row>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import {QQUrl, weiboUrl, redirect_uri, facebookLoginUrl, googleLoginUrl, linkedinUri} from "@/utils/env";
export default {
  name: "otherLogin",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["currentLanguage"]),
    QQUri() {
      return `${QQUrl}?response_type=code&client_id=101839221${this.QQRedirectUri}`;
    },
    QQRedirectUri() {
      return `&redirect_uri=${redirect_uri}&state=${this.QQState}`;
    },
    // 参数放在state里(QQ)
    QQState() {
      return encodeURI(`${this.currentLanguage}|1|${location.pathname}|1`);
    },
    weiboUri() {
      return `${weiboUrl}?client_id=133941828&redirect_uri=${redirect_uri}&state=${this.weiboState}`;
    },
    // 参数放在state里(微博)
    weiboState() {
      return encodeURI(`${this.currentLanguage}|3|${location.pathname}|1`);
    },
    facebookUri() {
      return `${facebookLoginUrl}?client_id=1859803817488057&redirect_uri=${redirect_uri}&state=${this.facebookState}`;
    },
    facebookState() {
      return encodeURI(`${this.currentLanguage}|4|${location.pathname}|1`);
    },
    googleUri() {
      return `${googleLoginUrl}?client_id=305471262077-13dv4f4cqnrcda76b7onb6uu8kcg38lp.apps.googleusercontent.com&redirect_uri=${encodeURI(
        redirect_uri
      )}&response_type=code&scope=profile&state=${this.googleState}`;
    },
    googleState() {
      return encodeURIComponent(`${this.currentLanguage}|6|${location.pathname}|1`);
    },
    linkedinUri() {
      return `${linkedinUri}?response_type=code&client_id=78lnt5oncsnmq0&redirect_uri=${encodeURI(
        redirect_uri
      )}&state=${this.linkedinState}`;
    },
    linkedinState() {
      return encodeURIComponent(`${this.currentLanguage}|10|${location.pathname}|1`);
    }
  },
  methods: {
    onClickWeixinLoginHandle() {
      this.$emit("weixinLogin", true);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables";

.other-login-layer {
  .order-login-title {
    position: relative;
    background-color: @gray-bg-color;
    height: 1px;
    margin: 0 0 25px;

    span {
      position: absolute;
      left: 92px;
      top: -8px;
      width: 120px;
      background-color: #fff;
    }
  }

  .login-icon {
    font-size: 32px;
    cursor: pointer;

    &.weixin {
      color: #06d96a;
    }

    &.qq {
      color: #4a90e2;
    }

    &.weibo {
      color: #fb3f3f;
    }

    &.facebook {
      color: #3c599b;
    }

    &.twitter {
      color: #00aced;
    }
    &.linkedin {
      color: #4a90e2;
    }
  }
}
</style>
