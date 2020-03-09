<template>
  <div @click="handleScrollTop" class="backTop" v-show="goTop">
    <el-popover
      popper-class="popover-tips-default"
      :visible-arrow="false"
      placement="bottom"
      trigger="hover"
      :content="$t('commons.backToTop')"
    >
      <img slot="reference" src="@/assets/icon/backTop.svg" class="vertical-align-middle" />
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "backTop",
  data() {
    return {
      goTop: false,
      scrollHeight: 100
    };
  },
  props: ["ele"],
  created() {},
  mounted() {
    // 此处true需要加上，不加滚动事件可能绑定不成功
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    handleScroll(e) {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      scrollTop > this.scrollHeight ? (this.goTop = true) : (this.goTop = false);
      this.$emit("hideBack", this.goTop);
    },
    handleScrollTop() {
      this.$nextTick(() => {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.backTop {
  cursor: pointer;
  margin: 0 auto;
  // .back-icon {
  //   font-size: 36px;
  // }
}
</style>
