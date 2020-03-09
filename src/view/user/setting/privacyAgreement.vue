<template>
  <container class="setting-privacy-agreement-layer gray-bg">
    <user-panel active-index="4">
      <div class="setting-privacy-agreement-content">
        <top-menu :active-index="4"></top-menu>
        <div class="content" v-html="content"></div>
      </div>
    </user-panel>
  </container>
</template>

<script>
import userPanel from "@/layout/user/panel";
import topMenu from "@/view/user/setting/components/topMenu";
import * as api from "@/api/user";

export default {
  name: "privacyAgreement",
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
    param.agreementType = 2;
    api.getAgreementContent(param).then(res => {
      this.content = res.content;
    });
  }
};
</script>

<style lang="less" scoped>
.setting-privacy-agreement-layer {
  .setting-privacy-agreement-content {
    .content {
      padding: 32px;
    }
  }
}
</style>
