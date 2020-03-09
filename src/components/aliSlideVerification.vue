<template>
  <div v-show="isShow" class="ali-validator-layer">
    <div class="slider">
      <div class="ali-validator-boxer" id="nc"></div>
    </div>
  </div>
</template>

<script>
import "@/utils/ali_validate";
import * as api from "@/api/user";

let nc = null;
export default {
  name: "validatorModal",
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    mobile: {
      type: String,
      default: ""
    },
    isSign: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    /*global someFunction NoCaptcha:true*/
    //滑块验证
    let nc_appkey = "FFFF0N00000000008BB2"; // 应用标识,不可更改
    let nc_token = [nc_appkey, new Date().getTime(), Math.random()].join(":");
    let nc_scene = "nc_message";
    nc = NoCaptcha.init({
      renderTo: "#nc",
      appkey: nc_appkey,
      scene: nc_scene,
      token: nc_token,
      elementID: ["phone"],
      callback: data => {
        console.log("submit");
        let res = {
          ...data,
          scene: nc_scene,
          token: nc_token
        };
        this.$emit("onValidatorResult", res);
      }
    });
    NoCaptcha.upLang("cn", {
      SLIDER_LABEL: "向右滑动验证" //等待滑动
    });
    nc.on("error", e => {
      console.log("error");
    });
    nc.on("fail", e => {
      console.log("fail");
    });
    nc.on("success", e => {
      console.log("success");
    });
    nc.on("afterverify", e => {
      console.log("afterverify");
    });
    NoCaptcha.setEnabled(true);
    nc.reset();
  },
  methods: {
    reset() {
      nc.reset();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";
.ali-validator-layer {
  ::v-deep.ali-validator-boxer {
    ￼.nc_scale .scale_text {
      color: @global-default4; /* 默认字体颜色 */
    }
    .nc_scale div.nc_bg {
      background: @global-success; /* 滑过时的背景色 */
    }
    .nc_scale .scale_text2 {
      color: #fff; /* 滑过时的字体颜色 */
    }
    ._nc .stage1 {
      width: 304px;
      height: 40px;
      margin-left: -13px;
    }
    ._nc .stage1 .bg-green,
    .label {
      height: 40px; //拖动时左边已变绿的样式
      font-size: 14px;
      line-height: 40px;
    }
    ._nc .stage1 .slider {
      height: 40px;
      border-radius: 26px;
      box-shadow: none;
      background-color: @gray-bg-color;
    }
    ._nc .stage1 .button {
      width: 38px; //带有箭头的可拖动button的样式
      height: 38px;
      border-radius: 50%;
      text-align: center;
      border: 1px solid #f6f7f9;
    }
    ._nc .stage1 .icon {
      left: 0; //控制箭头icon和通过验证图标的位置
      right: 0;
    }
    ._nc .icon-ok {
      font-size: 24px;
      line-height: 32px;
    }
    ._nc .stage1 .track div {
      border-radius: 26px;
      color: #fff;
    }
    ._nc .icon-slide-arrow {
      &::before {
        font-size: 14px; //箭头的样式
        vertical-align: middle;
        color: #979797;
      }
    }
    .nc_scale span {
      border: 1px solid #ccc;
      background: #979797 url("//g.alicdn.com/sd/ncpc/images/rt.png") no-repeat center;
    }
    .nc_scale .btnok {
      background: #fff url("//g.alicdn.com/sd/ncpc/images/yes.png") no-repeat center;
    }
    .errloading {
      border: #faf1d5 1px solid;
      background: url("//g.alicdn.com/sd/ncpc/images/no.png") #fffff0 no-repeat 10px 9px;
      color: #ef9f06;
    }
  }
}
</style>
