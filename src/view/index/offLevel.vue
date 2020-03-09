<template>
  <container class="off-level-layer text-center">
    <img src="@/assets/img/home/off_level.svg" />
    <p class="text-muted tips">该内容已下架</p>
    <el-button type="primary" @click="$router.push({name: 'home'})">返回首页</el-button>
  </container>
</template>

<script>
export default {
  name: "offLevel"
};
</script>

<style lang="less" scoped>
.off-level-layer {
  padding: 180px 0 50px;

  .tips {
    margin: 0 0 15px;
  }
}
</style>
