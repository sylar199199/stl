<template>
  <header class="head-nav">
    <div class="container">
      <el-row>
        <el-col class="logo pointer" :span="4" @click.native="$router.push({name: 'home'})">
          <img src="@/assets/icon/huiketang.svg" class="icon-logo vertical-align-middle" />
          <img src="@/assets/icon/huiketangZh.svg" class="vertical-align-middle" />
        </el-col>
        <el-col :span="20">
          <slot name="toolsMenu">
            <top-menu></top-menu>
          </slot>
        </el-col>
      </el-row>
    </div>
  </header>
</template>

<script>
import {mapGetters} from "vuex";
import topMenu from "./topMenu";

export default {
  name: "headNav",
  data() {
    return {};
  },
  components: {
    topMenu
  },
  computed: {
    ...mapGetters(["name", "avatar", "sidebar"])
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped lang="less">
.head-nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 36px;
  padding: 18px 0;
  border-bottom: 1px solid #eff0f2;
  background-color: #fff;
  z-index: 999;
  width: 100%;

  .logo {
    padding: 2px 0;

    .icon-logo {
      margin-right: 10px;
    }
  }
}
</style>
