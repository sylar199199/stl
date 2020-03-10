<template>
  <div class="home-recommend-banner-layer">
    <div class="img-wrap">
      <div class="img-item" v-for="(item, index) in picList" :key="index">
        <img class="img-block" :src="item.url" />
      </div>
      <div
        class="left-arrow-icon common-arrow-icon text-center pointer"
        @click="switchLastHandle"
        v-if="recommendPicList.length > 3"
      >
        <img src="@/assets/img/icon/arrow_right.svg" />
      </div>
      <div
        class="right-arrow-icon common-arrow-icon text-center pointer"
        @click="switchNextHandle"
        v-if="recommendPicList.length > 3"
      >
        <img src="@/assets/img/icon/arrow_right.svg" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    picList: {
      type: Array,
      default() {
        return [];
      }
    },
    recommendPicList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    switchNextHandle() {
      this.$emit("switchNext");
    },
    switchLastHandle() {
      this.$emit("switchLast");
    }
  }
};
</script>
<style lang="less" scope>
@import "~@/style/variables.less";

.home-recommend-banner-layer {
  .img-wrap {
    width: 100%;
    height: 258px;
    position: relative;
    overflow: hidden;
    text-align: center;
    .img-item {
      display: inline-block;
      margin-left: 20px;
      &:first-child {
        margin-left: 0px;
      }
      .img-block {
        width: 460px;
        height: 258px;
        margin: 0 auto;
      }
    }
    .common-arrow-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 50%;
      margin-top: -32px;
      line-height: 70px;
    }
    .left-arrow-icon {
      left: 10px;
    }
    .right-arrow-icon {
      right: 10px;
    }
  }
}
</style>
