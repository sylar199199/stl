<template>
  <el-form
    :model="form"
    :rules="rules"
    status-icon
    :show-message="false"
    ref="loginForm"
    class="mobile-login-form"
    width="600px"
  >
    <el-row>
      <el-col :span="8">
        <el-select class="region-select" popper-class="region-select-opt" :value="form.region" @change="changeRegion">
          <el-option v-for="item in regionOpt" :key="item.code" :value="item.code" :label="item.regionCode">
            <span class="fl select-label">{{ item.name }}</span>
            <span class="fr">{{ item.regionCode }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="16">
        <el-form-item prop="mobile">
          <el-input
            :value="form.mobile"
            maxlength="15"
            @input="changeMobile"
            :placeholder="$t('account.phone')"
            @keyup.enter.native="handleKeyUp()"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item prop="code">
          <el-input
            class="code-txt"
            :value="form.code"
            @input="changeCode"
            maxlength="4"
            :placeholder="$t('account.codeInput')"
            @keyup.enter.native="handleKeyUp()"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <count-down-btn
          class="count-down-btn"
          @onClick="onClickSendSMSHandle"
          ref="sendSMSBtn"
          class-name="btn-block"
        ></count-down-btn>
      </el-col>
    </el-row>
    <aliSlideVerification
      ref="SMSLoginSlide"
      class="ali-slide"
      @onValidatorResult="onAliSlideResposeHandle"
      :is-show="isShowSMSSlide"
    ></aliSlideVerification>
  </el-form>
</template>

<script>
import * as validator from "@/utils/validator";
import * as api from "@/api/common";
import countDownBtn from "@/components/countDownBtn";
import {isInteger} from "@/utils/mUtils";
import aliSlideVerification from "@/components/aliSlideVerification";
export default {
  components: {
    countDownBtn,
    aliSlideVerification
  },
  props: {
    form: {
      type: Object,
      default() {
        return {
          region: 6541,
          mobile: "",
          code: ""
        };
      }
    },
    codeParam: Object
  },

  data() {
    let validateMobile = (rule, value, callback) => {
      let reg = new RegExp(this.currentCountyItem.regular);
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号码"));
      }
    };
    return {
      regionOpt: [{code: 6541, regionCode: "+86"}],
      rules: {
        mobile: [
          {required: true, message: "请输入手机号", trigger: "blur"},
          {validator: validateMobile, trigger: "blur"}
        ],
        code: [
          {required: true, message: "请输入验证码", trigger: "blur"},
          {validator: validator.mobileCode, trigger: "blur"}
        ]
      },
      SMSValidInfo: {
        scene: "",
        sessionId: "",
        token: "",
        sig: "",
        slidercode: false
      },
      isShowSMSSlide: true
    };
  },
  computed: {
    currentCountyItem() {
      let item = this.regionOpt.filter(item => {
        if (item.code === this.form.region) {
          return true;
        }
      });
      return item.length > 0 ? item[0] : {};
    }
  },
  mounted() {
    //获取国家信息列表
    api
      .getCountryList()
      .then(res => {
        this.regionOpt = res.map(item => {
          item.regionCode = item.regionCode.replace(/^00/, "+");
          return item;
        });
      })
      .catch(res => {
        this.$message.error(res.message);
      });
  },
  methods: {
    onClickSendSMSHandle() {
      //点击获取验证码
      this.$refs["loginForm"].validateField("mobile", error => {
        //验证手机号码输入框
        if (!error) {
          if (this.SMSValidInfo.sig || process.env.VUE_APP_MODE === "test") {
            let AuthCodeParam = {
              ...this.SMSValidInfo,
              code: this.form.code,
              countryCode: this.form.region,
              platformType: this.codeParam.platformType,
              sendType: this.codeParam.sendType,
              telephone: this.form.mobile
            };
            api
              .getAuthCode(AuthCodeParam)
              .then(res => {
                this.$message.success(this.$t("commons.sendValidCodeSuccess"));
                this.isShowSMSSlide = false;
              })
              .finally(() => {
                this.$refs["sendSMSBtn"].startCount(); //开始倒计时
                this.doResetAliSlide(); //重置滑块验证
              });
          } else {
            this.isShowSMSSlide = true;
            this.$message.error("请滑动滑块验证");
          }
        } else {
          this.$message.error("请输入正确的手机号码");
        }
      });
    },
    doResetAliSlide() {
      this.SMSValidInfo.sig = "";
      this.$refs["SMSLoginSlide"].reset();
    },
    onAliSlideResposeHandle(res) {
      this.SMSValidInfo.sessionId = res.csessionid;
      this.SMSValidInfo.sig = res.sig;
      this.SMSValidInfo.scene = res.scene;
      this.SMSValidInfo.token = res.token;
    },
    //切换地区
    changeRegion(val) {
      this.$emit("update:region", val);
    },
    //输入手机号
    changeMobile(val) {
      if (isInteger(val)) {
        //判断是否为整数
        this.$emit("update:mobile", val);
      }
    },
    //输入验证码
    changeCode(val) {
      if (isInteger(val)) {
        //判断是否为整数
        this.$emit("update:code", val);
      }
    },
    handleKeyUp() {
      this.$emit("handleKeyUpEnter");
    },
    //校验
    validator() {
      let flag = false;
      this.$refs["loginForm"].validate((boolean, object) => {
        if (boolean) {
          //校验通过
          flag = true;
        } else {
          //this.$emit("errorMsg", object);
          this.$message.error(object[Object.keys(object)[0]][0].message);
        }
      });
      return flag;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.mobile-login-form {
  position: relative;

  .send-tip {
    height: 40px;
    line-height: 40px;
    color: @white;
    padding: 0 21px;
    background-color: @global-default;
    border-radius: @border-radius-base;
    position: absolute;
    left: 96px;
    top: 80px;
    z-index: 3;
  }

  .region-select {
    width: 96px;

    ::v-deep::before {
      color: @global-default;
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

  .count-down-btn {
    border-radius: 0 4px 4px 0;
    padding: 12px 10px;
  }
  .ali-slide {
    margin: 0 0 15px;
  }
}
</style>

<style lang="less">
.region-select-opt {
  width: 304px;
}
</style>
