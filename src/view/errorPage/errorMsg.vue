<template>
  <container class="error-msg-layer">
    <div class="container text-center" ref="container">
      <div class="errPage-container cflex wflex">
        <img class="error-img" :src="errorImg" />
        <p class="error-tro">该账号已绑定其他账户</p>
        <router-link :to="{path: '/'}">
          <el-button size="mini" type="primary">{{ $t("errorPage.returnHomePage") }}</el-button>
        </router-link>
      </div>
    </div>
  </container>
</template>

<script>
import errorImg from "@/assets/img/404.png";
import * as mutils from "@/utils/mUtils";

export default {
  name: "page401",
  data() {
    return {
      errorImg: errorImg
    };
  },
  mounted() {
    mutils.setContentHeight(this, this.$refs.container, 200);
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.error-msg-layer {
  .errPage-container {
    padding-top: 20px;

    p {
      line-height: 30px;
    }

    .error-img {
      width: 286px;
      height: 325px;
      margin-bottom: 10px;
    }

    .error-tro {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }

    .router-link-active:hover {
      color: #a9d86e;
      text-decoration: underline;
    }
  }
}
</style>
