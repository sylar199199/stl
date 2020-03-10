<template>
  <el-dialog
    custom-class="default-dialog"
    class="share-dialog"
    :title="dialogTitle"
    :show-close="false"
    :visible="$attrs.dialogVisible"
    :append-to-body="true"
    @open="onShowDialogHandle"
    @close="onCloseDialogHandle"
    width="440px"
  >
    <icon-svg class="close-btn" icon-class="icon-close" @click.native="onCloseDialogHandle"></icon-svg>
    <div class="share-layer text-center">
      <p class="text-secondary" @click="ruleDialog = true" v-if="$attrs.shareType === 2">{{ $t("share.rule") }}</p>
      <p v-show="!isLogin" class="fr is-login text-sm text-primary2">{{ $t("share.getHuidou") }}</p>
      <div v-if="currentLanguage === 1" class="qr-layer">
        <div class="qrcode" ref="qrCodeUrl"></div>
        <p class="weixin-title">{{ $t("share.QRCode") }}</p>
      </div>
      <el-row class="share-social">
        <template v-if="currentLanguage === 1">
          <el-col class="weibo" :span="8" @click.native="onClickShareWeiBoHandle">
            <icon-svg icon-class="icon-weibo" />
            <p class="text-muted">微博</p>
          </el-col>
          <el-col class="weixin" :span="8">
            <icon-svg icon-class="icon-weixin" />
            <p class="text-muted">微信</p>
          </el-col>
          <el-col class="qq" :span="8" @click.native="onClickShareQQHandle">
            <icon-svg icon-class="icon-qq" />
            <p class="text-muted">QQ</p>
          </el-col>
        </template>
        <template v-else>
          <div class="social-sharing">
            <social-sharing
              class="social-sharing-layer"
              :url="$attrs.shareUrl"
              :title="huidouTitle"
              :description="$attrs.shareTitle"
              :quote="huidouTitle"
              hashtags="匯課堂,外匯"
              inline-template
            >
              <div>
                <el-col class="facebook" :span="6">
                  <network network="facebook">
                    <icon-svg icon-class="icon-facebook" />
                    <p class="text-muted">facebook</p>
                  </network>
                </el-col>
                <el-col class="line" :span="6">
                  <network network="line">
                    <icon-svg icon-class="icon-line" />
                    <p class="text-muted">line</p>
                  </network>
                </el-col>
                <el-col class="linkedin" :span="6">
                  <network network="linkedin">
                    <icon-svg icon-class="icon-linkedin" />
                    <p class="text-muted">領英</p>
                  </network>
                </el-col>
                <el-col class="twitter" :span="6">
                  <network network="twitter">
                    <icon-svg icon-class="icon-twitter" />
                    <p class="text-muted">twitter</p>
                  </network>
                </el-col>
              </div>
            </social-sharing>
          </div>
        </template>
      </el-row>
    </div>
    <div class="copy-layer">
      <el-input class="copy-text" readonly :value="$attrs.shareUrl">
        <span slot="suffix" class="el-input__icon pointer" @click="onClickCopyUrlHandle">{{ $t("share.copy") }}</span>
      </el-input>
    </div>
    <el-dialog
      custom-class="default-dialog"
      class="share-dialog rule-dialog"
      :visible="ruleDialog"
      :show-close="false"
      width="440px"
      :title="$t('share.rule')"
      :center="false"
      append-to-body
    >
      <icon-svg class="close-btn" icon-class="icon-close" @click.native="ruleDialog = false"></icon-svg>
      <div class="rule-content scroll-bar">
        <p class="text-lg text-default2">{{ $t("share.ruleDescription") }}</p>
        <p class="text-default4">{{ $t("share.firstRule") }}</p>
        <p class="text-default4">{{ $t("share.secondRule") }}</p>
        <p class="text-default4">{{ $t("share.thirdRule") }}</p>
        <p class="text-default4">{{ $t("share.fourthRule") }}</p>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import Vue from "vue";
import QRCode from "qrcodejs2";
import VueClipboard from "vue-clipboard2";
// 分享功能集合
import {shareConfig} from "@/utils/share";
import {mapGetters} from "vuex";
// 分享组件
import SocialSharing from "vue-social-sharing";
import * as api from "@/api/share";
import {webSharePage} from "@/utils/env";
Vue.use(VueClipboard);
let qrCode = null;

export default {
  name: "shareLayer",
  data() {
    return {
      isFirstOpen: true,
      ruleDialog: false,
      isLogin: false,
      huidouTitle: this.$t("account.huiketang") + " | " + this.$t("share.huiketangTitle")
    };
  },
  created() {
    if (this.userUid > 0) {
      this.isLogin = true;
    }
  },
  computed: {
    ...mapGetters(["userUid", "currentLanguage"]),
    shareWeiXinUrl() {
      return this.$attrs.shareWeiXinUrl;
    },
    dialogTitle() {
      return this.$attrs.shareType === 2 ? this.$t("share.invite") : "分享给好友";
    }
  },
  components: {
    SocialSharing
  },
  methods: {
    creatQrCode() {
      if (this.currentLanguage === 1) {
        //生成微信二维码
        this.$nextTick(() => {
          if (qrCode) {
            qrCode.clear(); //清除当前二维码
            qrCode.makeCode(this.shareWeiXinUrl);
          } else {
            qrCode = new QRCode(this.$refs["qrCodeUrl"], {
              text: this.shareWeiXinUrl, // 要分享的网页路径
              width: 220,
              height: 220,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H
            });
          }
        });
      }
    },
    onClickShareQQHandle() {
      shareConfig("qq", {
        shareTitle: this.huidouTitle,
        url: this.$attrs.shareUrl,
        pic: this.$attrs.picUrl,
        summary: this.$attrs.shareTitle
      });
    },
    onClickShareWeiBoHandle() {
      shareConfig("weibo", {
        shareTitle: this.huidouTitle,
        url: this.$attrs.shareUrl,
        pic: this.$attrs.picUrl,
        summary: this.$attrs.shareTitle
      });
    },
    onClickCopyUrlHandle() {
      this.$copyText(this.$attrs.shareUrl).then(
        e => {
          this.$message({
            message: "已复制链接,分享给您的好友吧~",
            type: "success",
            duration: 5 * 1000
          });
        },
        e => {
          this.$message({
            message: e.message,
            type: "error",
            duration: 5 * 1000
          });
        }
      );
    },
    onShowDialogHandle() {
      this.creatQrCode();
    },
    onCloseDialogHandle() {
      this.$emit("changeDialogVisible", false);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";
.share-layer {
  width: 240px;
  margin: 0 auto;
  .is-login {
    position: absolute;
    right: 35px;
    top: 60px;
    width: 128px;
    height: 23px;
    line-height: 23px;
    border-radius: 4px;
    border: solid 1px rgba(254, 116, 61, 0.24);
    background-color: rgba(254, 116, 61, 0.06);
  }
  .qr-layer {
    position: relative;
    margin: 15px 0 20px;
    padding: 10px;
    border: 1px solid #06d96a;
    border-radius: 4px;

    &:after,
    &:before {
      border: solid transparent;
      content: " ";
      height: 0;
      bottom: -20px;
      left: 50%;
      margin-left: -10px;
      position: absolute;
      width: 0;
    }

    &:after {
      bottom: -16px;
      margin-left: -8px;
      border-width: 8px;
      border-top-color: #fff;
    }

    &:before {
      border-width: 10px;
      border-top-color: #06d96a;
    }

    p {
      margin: 10px 0 0;
      font-size: 16px;
    }
  }

  .share-social {
    margin: 0 0 20px;

    .weibo {
      color: #fb3f3f;
    }

    .weixin {
      color: #06d96a;
    }

    .qq {
      color: #4a90e2;
    }
    .social-sharing {
      margin: 20px 0 0 0;
      ::v-deep.social-sharing-layer {
        .svg-icon {
          font-size: 36px;
        }
        .facebook {
          color: #3c599b;
        }
        .line {
          color: #00ba00;
        }
        .linkedin {
          color: #4a90e2;
        }
        .twitter {
          color: #3caae1;
        }
      }
    }
    .svg-icon {
      font-size: 36px;
      margin: 0px 0 5px;
    }

    .qrcode {
      margin: 15px auto;

      ::v-deep img {
        margin: 0 auto;
      }
    }
  }
}

.copy-layer {
  padding-bottom: 50px;
  width: 280px;
  margin: 0 auto;

  ::v-deep .copy-text {
    .el-input__inner {
      background-color: @gray-bg-color;
      padding-right: 50px;

      &:focus {
        border-color: #dcdfe6;
      }
    }
    .el-input__suffix {
      pointer-events: auto;
    }
    .el-input__icon {
      color: #555;
      margin: 0 5px 0 0;
    }
  }
}

.share-dialog {
  ::v-deep .el-dialog__header {
    padding: 30px 0;
  }
}
::v-deep.rule-dialog {
  .el-dialog {
    height: 599px;
    padding: 0px 32px;
    .el-dialog__header {
      text-align: left;
    }
    .rule-content {
      p {
        margin-top: 20px;
      }
    }
  }
}
</style>
