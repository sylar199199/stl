<template>
  <div class="user-info text-center">
    <p>
      <el-avatar class="vertical-align-middle pointer head-pic el-avatar-default" :src="userAvatar"></el-avatar>
    </p>
    <p class="text-default3 user-name">{{ userName }}</p>
    <p>
      <el-progress
        class="default-progress progress"
        :percentage="levelPercent"
        :show-text="false"
        :stroke-width="4"
      ></el-progress>
    </p>
    <p>
      <el-button class="btn-block recharge-btn" round type="primary" @click="$router.push({name: 'buyBeans'})">
        {{ $t("layout.huidouPay") }}
      </el-button>
    </p>
    <p>
      <span class="text-muted">{{ $t("layout.huidouRemaing") }}</span>
      <span class="text-primary">{{ userAmount }}</span>
    </p>
    <level-explain class="level-explain"></level-explain>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import levelExplain from "@/components/levelExplain";
import {userLevelPercent} from "@/utils/mUtils";

export default {
  name: "userInfo",
  components: {
    levelExplain
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userName", "userAvatar", "userAmount", "userTotalScore"]),
    levelPercent() {
      return userLevelPercent(this.userTotalScore);
    }
  }
};
</script>

<style lang="less" scoped>
.user-info {
  position: relative;
  width: 160px;
  padding: 24px 40px;
  border-radius: 4px;
  background: url("../../assets/img/user/info_bg.svg") no-repeat #fff;

  .head-pic {
    width: 64px;
    height: 64px;
  }

  .user-name {
    margin: 12px 0;
  }

  .progress {
    margin: 0 0 20px;
  }

  .recharge-btn {
    margin: 0 0 20px;
  }

  .level-explain {
    position: absolute;
    right: 25px;
    top: 25px;
  }
}
</style>
