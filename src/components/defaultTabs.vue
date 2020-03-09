<template>
  <ul class="default-tabs">
    <slot name="tabs">
      <li
        v-for="item in list"
        :key="item.value"
        :class="{active: activeIndex === item.value}"
        @click="onChangeTabsHandle(item.value)"
      >
        {{ item.label }}
      </li>
    </slot>
  </ul>
</template>

<script>
export default {
  name: "defaultTabs",
  props: {
    list: {
      default() {
        return [];
      },
      type: Array
    },
    activeIndex: {
      default: 0,
      type: Number
    }
  },
  methods: {
    onChangeTabsHandle(value) {
      this.$emit("change", value);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.default-tabs {
  height: 64px;
  line-height: 64px;
  border-bottom: 1px solid @gray-bg-color;

  li {
    position: relative;
    display: inline-block;
    height: 52px;
    line-height: 64px;
    padding: 0 20px;
    text-align: center;
    font-size: @font-size-lg;
    cursor: pointer;

    &.active {
      color: @global-primary;
      .split {
        overflow: hidden;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 4px;
        &::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -4px;
          margin-left: -4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: @global-primary;
        }
      }
    }
  }
}
</style>
