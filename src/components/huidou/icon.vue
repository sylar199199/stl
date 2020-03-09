<template>
  <div class="huidou-btn vertical-align-middle">
    <img class="vertical-align-middle" src="@/assets/img/icon/huidou.png" />
    <span class="num text-danger vertical-align-middle">{{ $attrs.price }}</span>
    <span class="vertical-align-middle text-sm">{{ $t("buyBeans.huidou") }}</span>
  </div>
</template>

<script>
export default {
  name: "huidouIcon"
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.huidou-btn {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  background-color: rgba(254, 116, 61, 0.06);
  padding: 0 15px 0 10px;
  color: @global-primary;

  img {
    width: 24px;
    height: 24px;
    margin: 0 5px 0 0;
  }

  span {
    &.num {
      font-size: 22px;
      font-weight: bold;
      margin: 0 4px 0 0;
    }
  }
}
</style>
