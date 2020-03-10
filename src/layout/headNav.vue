<template>
  <header class="head-nav" :class="{scroll: scrollHeight <= 1080}">
    <div class="container">
      <el-row>
        <el-col class="logo pointer" :span="4" @click.native="$router.push({name: 'home'})">
          <img src="@/assets/img/icon/huiketang-icon.svg" class="icon-logo vertical-align-middle" />
        </el-col>
        <el-col :span="20">
          <slot name="toolsMenu">
            <top-menu :scrollHeight="scrollHeight"></top-menu>
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
    return {
      scrollHeight: 0
    };
  },
  components: {
    topMenu
  },
  computed: {
    ...mapGetters(["name", "avatar", "sidebar"])
  },
  created() {},
  mounted() {
    //监听滚动
    window.addEventListener(
      "scroll",
      () => {
        this.scrollHeight = this.getScrollTop();
      },
      true
    );
  },
  methods: {
    getScrollTop() {
      //滚动条在Y轴上的滚动距离
      let scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
      if (document.body) {
        bodyScrollTop = document.body.scrollTop;
      }
      if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
      }
      scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
      return scrollTop;
    }
  }
};
</script>

<style scoped lang="less">
.head-nav {
  position: fixed;
  border-bottom: 1px solid #eff0f2;
  background: #fff;
  top: 0;
  left: 0;
  height: 36px;
  padding: 18px 0;
  z-index: 999;
  width: 100%;

  &.scroll {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0));
    border-bottom: 0px solid transparent;
  }

  .logo {
    padding: 2px 0;

    .icon-logo {
      margin-right: 10px;
    }
  }
}
</style>
