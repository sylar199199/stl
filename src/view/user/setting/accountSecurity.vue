<template>
  <container class="setting-user-accountSecurity-layer">
    <user-panel active-index="4">
      <div class="setting-user-accountSecurity-content">
        <top-menu :active-index="1"></top-menu>
        <div class="content">
          <p :span="2" class="bold bind-phone">{{ $t("setting.phoneNumberBind") }}</p>
          <el-row class="bind-item bind-phone">
            <el-col :span="3" class="bind-account">{{ $t("setting.phoneBind") }}</el-col>
            <el-col :span="4" class="ml-mr">
              <span>{{ phoneNumber.slice(0, 3) + "****" + phoneNumber.slice(-4) }}</span>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" class="text-center btn unbind-btn btn-block" @click="changePhoneNumberHandle">
                {{ $t("setting.replaceBtn") }}
              </el-button>
            </el-col>
          </el-row>
          <p :span="2" class="bold third-part">{{ $t("setting.thirdAccountBind") }}</p>
          <div v-if="currentLanguage === 1">
            <el-row class="bind-item">
              <el-col :span="1">
                <img src="@/assets/img/icon/weixin-bind.svg" />
              </el-col>
              <el-col :span="2" class="bind-account">微信</el-col>
              <el-col :span="4" class="ml-mr text-truncate" v-if="accountForm.weixinUniqueId">
                <p :class="accountForm.weixin ? '' : 'hidden'">{{ accountForm.weixin }}</p>
              </el-col>
              <el-col :span="4" class="ml-mr" v-else>{{ $t("setting.unBindBtn") }}</el-col>
              <el-col :span="4">
                <el-button
                  class="text-center btn pointer bind-btn"
                  v-if="accountForm.weixinUniqueId"
                  @click="confirm(2, accountForm.weixinUniqueId)"
                >
                  {{ $t("setting.untie") }}
                </el-button>
                <el-button class="text-center btn btn-bg pointer unbind-btn" v-else @click="wxLoginDialog = true">
                  {{ $t("setting.bindBtn") }}
                </el-button>
              </el-col>
            </el-row>
            <el-row class="bind-item">
              <el-col :span="1">
                <img src="@/assets/img/icon/QQ.svg" />
              </el-col>
              <el-col :span="2" class="bind-account">QQ</el-col>
              <el-col :span="4" class="ml-mr text-truncate" v-if="accountForm.QQUniqueId">
                <p :class="accountForm.QQ ? '' : 'hidden'">{{ accountForm.QQ }}</p>
              </el-col>
              <el-col :span="4" class="ml-mr" v-else>{{ $t("setting.unBindBtn") }}</el-col>
              <el-col :span="4">
                <el-button
                  class="text-center btn pointer bind-btn"
                  v-if="accountForm.QQUniqueId"
                  @click="confirm(1, accountForm.QQUniqueId)"
                >
                  {{ $t("setting.untie") }}
                </el-button>
                <a :href="QQUri" v-else>
                  <el-button class="text-center btn btn-bg pointer unbind-btn">
                    {{ $t("setting.bindBtn") }}
                  </el-button>
                </a>
              </el-col>
            </el-row>
            <el-row class="bind-item">
              <el-col :span="1">
                <img src="@/assets/img/icon/weibo.svg" />
              </el-col>
              <el-col :span="2" class="bind-account">微博</el-col>
              <el-col :span="4" class="ml-mr text-truncate" v-if="accountForm.weiboUniqueId">
                <p :class="accountForm.weibo ? '' : 'hidden'">{{ accountForm.weibo }}</p>
              </el-col>
              <el-col :span="4" class="ml-mr" v-else>{{ $t("setting.unBindBtn") }}</el-col>
              <el-col :span="4">
                <el-button
                  class="text-center btn pointer bind-btn"
                  v-if="accountForm.weiboUniqueId"
                  @click="confirm(3, accountForm.weiboUniqueId)"
                >
                  {{ $t("setting.untie") }}
                </el-button>
                <a :href="weiboUri" v-else>
                  <el-button class="text-center btn btn-bg pointer unbind-btn">
                    {{ $t("setting.bindBtn") }}
                  </el-button>
                </a>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row class="bind-item">
              <el-col :span="1">
                <icon-svg icon-class="icon-facebook" class="login-icon facebook" />
              </el-col>
              <el-col :span="2" class="bind-account">Facebook</el-col>
              <el-col :span="4" class="ml-mr text-truncate" v-if="accountForm.facebookUniqueId">
                <p :class="accountForm.facebook ? '' : 'hidden'">{{ accountForm.facebook }}</p>
              </el-col>
              <el-col :span="4" class="ml-mr" v-else>{{ $t("setting.unBindBtn") }}</el-col>
              <el-col :span="4">
                <el-button
                  class="text-center btn pointer bind-btn"
                  v-if="accountForm.facebookUniqueId"
                  @click="confirm(6, accountForm.facebookUniqueId)"
                >
                  {{ $t("setting.untie") }}
                </el-button>
                <a :href="googleUri" v-else>
                  <el-button class="text-center btn btn-bg pointer unbind-btn">
                    {{ $t("setting.bindBtn") }}
                  </el-button>
                </a>
              </el-col>
            </el-row>
            <el-row class="bind-item">
              <el-col :span="1">
                <icon-svg icon-class="icon-google" class="login-icon google" />
              </el-col>
              <el-col :span="2" class="bind-account">google</el-col>
              <el-col :span="4" class="ml-mr text-truncate" v-if="accountForm.googleUniqueId">
                <p :class="accountForm.google ? '' : 'hidden'">{{ accountForm.google }}</p>
              </el-col>
              <el-col :span="4" class="ml-mr" v-else>{{ $t("setting.unBindBtn") }}</el-col>
              <el-col :span="4">
                <el-button
                  class="text-center btn pointer bind-btn"
                  v-if="accountForm.googleUniqueId"
                  @click="confirm(6, accountForm.googleUniqueId)"
                >
                  {{ $t("setting.untie") }}
                </el-button>
                <a :href="googleUri" v-else>
                  <el-button class="text-center btn btn-bg pointer unbind-btn">
                    {{ $t("setting.bindBtn") }}
                  </el-button>
                </a>
              </el-col>
            </el-row>
            <el-row class="bind-item">
              <el-col :span="1">
                <icon-svg icon-class="icon-twitter" class="login-icon twitter" />
              </el-col>
              <el-col :span="2" class="bind-account">twitter</el-col>
              <el-col :span="4" class="ml-mr text-truncate" v-if="accountForm.twitterUniqueId">
                <p :class="accountForm.twitter ? '' : 'hidden'">{{ accountForm.twitter }}</p>
              </el-col>
              <el-col :span="4" class="ml-mr" v-else>{{ $t("setting.unBindBtn") }}</el-col>
              <el-col :span="4">
                <el-button
                  class="text-center btn pointer bind-btn"
                  v-if="accountForm.twitterUniqueId"
                  @click="confirm(9, accountForm.twitterUniqueId)"
                >
                  {{ $t("setting.untie") }}
                </el-button>
                <a :href="weiboUri" v-else>
                  <el-button class="text-center btn btn-bg pointer unbind-btn">
                    {{ $t("setting.bindBtn") }}
                  </el-button>
                </a>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </user-panel>
    <!-- 第三方验证 -->
    <el-dialog
      class="third-account-verification"
      custom-class="default-dialog"
      :show-close="false"
      :visible="accountVerificationDialog"
      width="400px"
    >
      <icon-svg class="close-btn" icon-class="icon-close" @click.native="accountVerificationDialog = false"></icon-svg>
      <div class="title text-center text-lg bold">{{ $t("setting.verifyByThirdAccount") }}</div>
      <el-row :gutter="20" class="account-wrap text-center" type="flex" justify="center" v-if="currentLanguage === 1">
        <!-- 暂时隐藏汇聊，待汇聊登录稳定后展示 -->
        <el-col :span="6" class="pointer" style="display: none">
          <img src="@/assets/img/icon/huiliao.svg" width="32px" height="32px" />
          <p>{{ $t("setting.huiliao") }}</p>
        </el-col>
        <el-col :span="6" class="pointer" @click.native="wxLoginDialog = true" v-show="accountForm.weixinUniqueId">
          <img src="@/assets/img/icon/weixin-bind.svg" />
          <p>{{ $t("setting.weixin") }}</p>
        </el-col>
        <el-col :span="6" class="pointer" @click.native="bindQQ" v-show="accountForm.QQUniqueId">
          <a :href="QQUri">
            <img src="@/assets/img/icon/QQ.svg" />
            <p class="icon-name">{{ $t("setting.QQ") }}</p>
          </a>
        </el-col>
        <el-col :span="6" class="pointer" v-show="accountForm.weiboUniqueId">
          <a :href="weiboUri" target="_blank">
            <img src="@/assets/img/icon/weibo.svg" />
            <p class="icon-name">{{ $t("setting.weibo") }}</p>
          </a>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="account-wrap text-center" type="flex" justify="center" v-else>
        <el-col :span="7" class="pointer" v-show="accountForm.facebookUniqueId">
          <a :href="facebookUri" target="_blank">
            <icon-svg slot="reference" icon-class="icon-facebook" class="login-icon facebook" />
            <p class="icon-name">facebook</p>
          </a>
        </el-col>
        <el-col :span="6" class="pointer" v-show="accountForm.googleUniqueId">
          <a :href="googleUri" target="_blank">
            <icon-svg icon-class="icon-google" class="login-icon google" />
            <p class="icon-name">google</p>
          </a>
        </el-col>
        <el-col :span="6" class="pointer" v-show="accountForm.twitterUniqueId">
          <a :href="weiboUri" target="_blank">
            <icon-svg icon-class="icon-twitter" class="login-icon twitter" />
            <p class="icon-name">twitter</p>
          </a>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 更换手机号 -->
    <el-dialog
      class="phone-verification"
      custom-class="default-dialog"
      ref="changePhoneRef"
      :show-close="false"
      :visible="phoneVerificationDialog"
      width="400px"
    >
      <icon-svg class="close-btn" icon-class="icon-close" @click.native="clearData"></icon-svg>
      <div class="title text-center text-lg bold">{{ $t("account.phone") }}</div>
      <phone-verification
        class="phone-verification-component"
        ref="phoneVerficationRef"
        :codeParam="codeParam"
        :form="loginForm"
        :code.sync="loginForm.code"
        :mobile.sync="loginForm.mobile"
        :region.sync="loginForm.region"
      ></phone-verification>
      <el-button type="primary" class="confirm-btn text-center block-btn" @click="changePhoneNumber">
        {{ $t("commons.determineBtn") }}
      </el-button>
    </el-dialog>
    <!-- 解绑提示 -->
    <el-dialog
      class="untie-account"
      custom-class="default-dialog"
      :show-close="false"
      :visible="untieDialog"
      width="400px"
    >
      <icon-svg class="close-btn" icon-class="icon-close" @click.native="untieDialog = false"></icon-svg>
      <p class="title text-center bold">{{ $t("commons.confirmBtn") }}</p>
      <p class="confirm text-center">{{ $t("setting.sureToUntie") }}</p>
      <el-button class="cancel-btn text-center pointer btn-common inline-block btn-cancel" @click="untieDialog = false">
        {{ $t("commons.cancelBtn") }}
      </el-button>
      <el-button type="primary" class="confirm-btn text-center btn-common inline-block btn-confirm" @click="untied">
        {{ $t("commons.determineBtn") }}
      </el-button>
    </el-dialog>
    <!-- 绑定微信 -->
    <el-dialog
      class="weixin-login text-center"
      custom-class="default-dialog"
      :show-close="false"
      :visible="wxLoginDialog"
      width="400px"
    >
      <icon-svg class="close-btn" icon-class="icon-close" @click.native="wxLoginDialog = false"></icon-svg>
      <wxLogin class="wxLogin" :type="weixinUrlType" :uid="userUid"></wxLogin>
    </el-dialog>
  </container>
</template>

<script>
import userPanel from "@/layout/user/panel";
import topMenu from "@/view/user/setting/components/topMenu";
import * as api from "@/api/user";
import phoneVerification from "@/components/phoneVerification";
import {mapGetters} from "vuex";
import wxLogin from "@/components/wxLogin";
import {QQUrl, weiboUrl, redirect_uri, facebookLoginUrl, googleLoginUrl} from "@/utils/env";
import {getStore} from "@/utils/mUtils";

export default {
  name: "accountSecurity",
  components: {
    userPanel,
    topMenu,
    phoneVerification,
    wxLogin
  },
  data() {
    return {
      phoneNumber: "",
      accountVerificationDialog: false,
      phoneVerificationDialog: false,
      untieDialog: false,
      codeBtn: {
        text: this.btnText
      },
      loginForm: {
        region: 6541, //当前区域
        mobile: "",
        code: ""
      },
      accountForm: {
        weixin: "",
        QQ: "",
        weibo: "",
        facebook: "",
        google: "",
        twitter: "",
        QQUniqueId: "",
        weixinUniqueId: "",
        weiboUniqueId: "",
        facebookUniqueId: "",
        googleUniqueId: "",
        twitterUniqueId: ""
      },
      type: "", //解绑类型
      account: "", //唯一标识符
      codeParam: {
        platformType: 4,
        sendType: 3
      },
      wxLoginDialog: false //微信登录弹窗
    };
  },
  computed: {
    ...mapGetters(["prevRouter", "userUid", "currentLanguage"]),
    formIsEmpty() {
      if (this.loginForm.region && this.loginForm.mobile && this.loginForm.code) {
        return false;
      }
      return true;
    },
    //QQ
    QQUri() {
      return `${QQUrl}?response_type=code&client_id=101839221${this.QQRedirectUri}`;
    },
    QQRedirectUri() {
      return `&redirect_uri=${redirect_uri}&state=${this.QQState}`;
    },
    //State
    QQState() {
      return encodeURI(`${this.currentLanguage}|1|${location.pathname}|${this.QQUrlType}|${this.userUid}`);
    },
    QQUrlType() {
      return this.accountVerificationDialog ? 3 : 2;
    },
    //微博
    weiboUri() {
      return `${weiboUrl}?client_id=133941828&redirect_uri=${redirect_uri}&state=${this.weiboState}`;
    },
    // State
    weiboState() {
      return encodeURI(`${this.currentLanguage}|3|${location.pathname}|${this.weiboUrlType}|${this.userUid}`);
    },
    weiboUrlType() {
      // 若弹出第三方验证的弹窗type=3,否则type=2
      return this.accountVerificationDialog ? 3 : 2;
    },
    weixinUrlType() {
      return this.accountVerificationDialog ? 3 : 2;
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
    }
  },
  created() {
    this.queryBindThirdInfo();
    // 截取url的uuid
    if (this.$route.query.bindKey) {
      this.$router.push({name: "accountSecurity"});
      this.phoneVerificationDialog = true;
    } else if (this.$route.query.redirectMsg) {
      this.$router.push({name: "accountSecurity"});
      this.$dialog.alert("该账号已绑定其他用户");
    }
  },
  methods: {
    //查询用户相关绑定信息
    queryBindThirdInfo() {
      this.doClearBindForm();
      api
        .queryBindThirdInfo({
          r: Math.random()
        })
        .then(res => {
          this.phoneNumber = res.phone;
          res.userThirdModelList.forEach(item => {
            if (item.platType === "1") {
              this.accountForm.QQ = item.thirdPartNickname;
              this.accountForm.QQUniqueId = item.uniqueId;
            } else if (item.platType === "2") {
              this.accountForm.weixin = item.thirdPartNickname;
              this.accountForm.weixinUniqueId = item.uniqueId;
            } else if (item.platType === "3") {
              this.accountForm.weibo = item.thirdPartNickname;
              this.accountForm.weiboUniqueId = item.uniqueId;
            } else if (item.platType === "4") {
              this.accountForm.facebook = item.thirdPartNickname;
              this.accountForm.facebookUniqueId = item.uniqueId;
            } else if (item.platType === "6") {
              this.accountForm.google = item.thirdPartNickname;
              this.accountForm.googleUniqueId = item.uniqueId;
            } else {
              this.accountForm.twitter = item.thirdPartNickname;
              this.accountForm.twitterUniqueId = item.uniqueId;
            }
          });
        });
    },
    //清空绑定初始值
    doClearBindForm() {
      for (let key in this.accountForm) {
        this.accountForm[key] = "";
      }
    },
    //更改用户手机号
    changePhoneNumber() {
      let param = {
        authCode: this.loginForm.code,
        countryCode: this.loginForm.region,
        newPhone: this.loginForm.mobile
      };
      if (this.$refs.phoneVerficationRef.validator()) {
        api
          .updatePhone(param)
          .then(res => {
            this.$message({
              message: "更换成功",
              type: "success"
            });
            this.phoneVerificationDialog = false;
            this.queryBindThirdInfo();
          })
          .catch(err => {
            this.$message({
              message: err.message,
              type: "error"
            });
          });
      }
    },

    //解绑提示
    confirm(val, account) {
      this.type = val;
      this.account = account;
      this.untieDialog = true;
    },
    //确认解绑
    untied() {
      let thirdParam = {
        clientType: 3, //设备类型
        openId: "", //只有微信有
        thirdPartPlatformType: this.type,
        uniqueId: this.account
      };
      api
        .unBindThird(thirdParam)
        .then(res => {
          this.$message({
            message: "解绑成功",
            type: "success"
          });
          this.untieDialog = false;
          this.queryBindThirdInfo();
        })
        .catch(err => {
          this.message({
            message: err.message,
            type: "error"
          });
        });
    },
    //关闭更换手机号弹出清除数据
    clearData() {
      this.phoneVerificationDialog = false;
      this.loginForm = {
        mobile: "",
        code: ""
      };
    },
    //点击更换按钮
    changePhoneNumberHandle() {
      let arr = [];
      for (let key in this.accountForm) {
        if (this.accountForm[key]) {
          arr.push(this.accountForm[key]);
        }
      }
      if (arr.length === 0) {
        // 若无绑定第三方账号
        this.$message({message: "为了你的账号安全，请先绑定一种第三方账号"});
      } else {
        this.accountVerificationDialog = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.setting-user-accountSecurity-layer {
  background-color: @gray-bg-color;
  .setting-user-accountSecurity-content {
    .content {
      padding: 20px;

      .bind-phone {
        margin-top: 30px;
        color: @global-default3;
      }

      .third-part {
        margin: 52px 0 30px 0;
      }

      .bind-item {
        margin-top: 15px;
        line-height: 35px;

        .login-icon {
          font-size: 32px;
          cursor: pointer;

          &.facebook {
            color: #3c599b;
          }

          &.twitter {
            color: #00aced;
          }
        }
        .bind-account {
          color: @global-muted;
        }

        .ml-mr {
          margin-left: 30px;
          margin-right: 170px;

          .hidden {
            height: 20px;
            visibility: hidden;
          }
        }

        .btn {
          width: 96px;
          height: 32px;
          padding: 2px;
        }

        .unbind-btn {
          color: @white;
        }

        .bind-btn {
          color: @global-muted;
        }

        .btn-bg {
          background-color: @global-primary;
        }
      }
    }
  }

  ::v-deep.third-account-verification {
    .title {
      padding: 30px;
    }

    .account-wrap {
      padding: 24px 48px 46px;

      .login-icon {
        font-size: 32px;
        cursor: pointer;

        &.facebook {
          color: #3c599b;
        }

        &.twitter {
          color: #00aced;
        }
      }

      .icon-name {
        color: @global-default2;
      }
    }
  }

  ::v-deep.phone-verification {
    .title {
      padding: 30px 0 42px 0;
    }

    .phone-verification-component {
      padding: 30px 42px;
    }

    .confirm-btn {
      width: 304px;
      margin: 0 0 48px 48px;
    }
  }

  ::v-deep.untie-account {
    .title {
      font-size: 20px;
      padding: 30px;
    }

    .confirm {
      font-size: 18px;
      padding: 16px 0 41px;
    }

    .btn-common {
      width: 144px;
      height: 40px;
      margin-bottom: 25px;
      border: 1px solid #dcdee1;
      border-radius: 30px;
    }

    .btn-cancel {
      margin: 0 24px 0 44px;
      color: @global-default3;
    }
  }

  .wxLogin {
    padding-top: 30px;
  }
}
</style>
