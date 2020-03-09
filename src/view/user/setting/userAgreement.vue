<template>
  <container class="setting-user-agreement-layer gray-bg">
    <user-panel active-index="4">
      <div class="setting-user-agreement-content">
        <top-menu :active-index="3"></top-menu>
        <div class="content text-sm" v-html="content"></div>
      </div>
    </user-panel>
  </container>
</template>

<script>
import userPanel from "@/layout/user/panel";
import topMenu from "@/view/user/setting/components/topMenu";
import * as api from "@/api/user";

export default {
  name: "userAgreement",
  components: {
    userPanel,
    topMenu
  },
  data() {
    return {
      content: ""
    };
  },
  created() {
    let param = {};
    param.agreementType = 1;
    api.getAgreementContent(param).then(res => {
      this.content = res.content;
    });
  }
};
</script>

<style lang="less" scoped>
.setting-user-agreement-layer {
  .setting-user-agreement-content {
    .content {
      padding: 32px;
    }
  }
}
</style>
