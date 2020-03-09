<template>
  <div class="container-layer">
    <slot name="headNav">
      <head-nav></head-nav>
    </slot>
    <slot></slot>
    <slot name="footer">
      <footer-nav></footer-nav>
    </slot>
    <slot name="rightMenu">
      <right-menu></right-menu>
    </slot>
  </div>
</template>
<script>
import HeadNav from "@/layout/headNav";
import FooterNav from "@/layout/footerNav";
import rightMenu from "@/layout/rightMenu";

export default {
  name: "container",
  components: {
    HeadNav,
    FooterNav,
    rightMenu
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style scoped lang="less">
.container-layer {
  padding-top: 72px;
}
</style>
