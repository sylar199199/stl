<template>
  <div class="user-panel">
    <div class="container">
      <el-row>
        <el-col :span="5">
          <user-info class="user-info"></user-info>
          <user-menu v-bind="$attrs"></user-menu>
        </el-col>
        <el-col class="user-content" :span="19">
          <slot></slot>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import userInfo from "./info";
import userMenu from "./leftMenu";

export default {
  name: "userPanel",
  components: {
    userInfo,
    userMenu
  }
};
</script>

<style lang="less" scoped>
.user-panel {
  padding: 16px 0 90px;

  .user-info {
    margin: 0 0 15px;
  }

  .user-content {
    border-radius: 4px;
    background-color: #fff;
    min-height: 720px;
  }
}
</style>
