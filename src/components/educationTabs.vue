<template>
  <div class="education-tabs-layer">
    <el-row>
      <el-col :span="10" :offset="7" justify="center">
        <el-row :gutter="120">
          <el-col :span="8" v-for="item in classData" :key="item.value" :value="item.label">
            <!-- <div class="common" @click="checkItem(item)" :class="educationChild === item.label? 'activeClass':''">{{item.label}}</div> -->
            <div
              class="edu-btn text-center"
              @click="checkItem(item.value)"
              :class="{active: activeIndex === item.value}"
            >
              {{ $t(item.label) }}
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    activeIndex: {
      default: 0,
      type: Number
    },
    classData: Array
  },
  data() {
    return {};
  },
  methods: {
    //切换tab
    checkItem(val) {
      //查询章节
      this.$emit("getContentList", val);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.education-tabs-layer {
  .edu-btn {
    width: 96px;
    height: 40px;
    line-height: 40px;
    border-radius: 30px;
    background-color: #fff;
    border: solid 2px #f6f7f9;
    color: #5f666f;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      border: solid 2px @global-primary;
      color: @global-primary;
    }

    &.active {
      border-color: @global-primary;
      background-color: @global-primary;
      color: #fff;
    }
  }
}
</style>
