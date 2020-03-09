<template>
  <div class="huidou-icon-layer">
    <huidou-icon v-bind="$attrs"></huidou-icon>
    <span class="vertical-align-middle text-muted2 text-lg discount" v-if="discount">{{ discount }}</span>
  </div>
</template>

<script>
import huidouIcon from "./icon";

export default {
  name: "huidouLayer",
  components: {
    huidouIcon
  },
  props: {
    discount: {
      default: 0,
      type: Number
    }
  }
};
</script>

<style lang="less" scoped>
.huidou-icon-layer {
  display: inline-block;

  .discount {
    text-decoration: line-through;
    margin: 0 0 0 12px;
  }
}
</style>
