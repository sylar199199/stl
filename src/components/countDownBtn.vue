<template>
  <el-button
    :type="isStart ? 'disabled' : 'primary'"
    :class="className"
    class="text-center text"
    @click="onClickBtnHandle"
    :disabled="isStart"
  >
    {{ this.$t(codeBtn.text) }}
  </el-button>
</template>

<script>
let codeBtn = {
  Tid: null
};
export default {
  name: "countDownBtn",
  props: {
    btnText: {
      type: String,
      default: "account.getCode"
    },
    className: {
      type: String,
      default: ""
    },
    countTime: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      codeBtn: {
        text: this.btnText
      },
      isStart: false
    };
  },
  methods: {
    startCount() {
      if (!this.isStart) {
        this.isStart = true;
        this.countDown(this.countTime);
      }
    },
    onClickBtnHandle(event) {
      if (!this.isStart) {
        this.$emit("onClick");
      }
    },
    countDown(time) {
      let count = time;
      codeBtn.Tid = setInterval(() => {
        if (count > 0) {
          count--;
          this.codeBtn.text = this.$t("account.remaining") + count + "秒";
        } else {
          this.countEnd();
        }
      }, 1000);
    },
    countEnd() {
      //倒计时结束
      clearInterval(codeBtn.Tid);
      this.codeBtn.text = this.btnText;
      this.isStart = false;
      this.$emit("onEnd");
    }
  },
  destroyed() {
    this.countEnd(); //跳转的时候清除倒计时
  }
};
</script>

<style lang="less" scoped>
.text {
  padding: 10px;
}
</style>
