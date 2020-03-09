<template>
  <div class="level-explain-layer">
    <el-popover
      slot="reference"
      class="level-tips-pop pointer"
      popper-class="popover-tips-default"
      :visible-arrow="false"
      placement="bottom"
      trigger="hover"
      @click.native="levelDialog = true"
    >
      <span slot="reference" class="education">{{ $t(levelText) }}</span>
      <p @click="levelDialog = true">{{ $t("account.level") }}</p>
    </el-popover>
    <!-- 二维码 -->
    <el-dialog
      :title="$t('account.upgradeLevel')"
      :visible.sync="levelDialog"
      width="400px"
      custom-class="default-dialog"
      class="level-tips-dialog"
      :append-to-body="true"
      center
    >
      <icon-svg class="close-btn" icon-class="icon-close" @click.native="levelDialog = false"></icon-svg>
      <img class="code-img" src="@/assets/img/fx110_code.jpg" />
      <p class="download text-center">{{ $t("account.downLoad") }}</p>
      <div class="pricese text-center">{{ $t("account.consolidate") }}</div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {classData} from "@/utils/env";

export default {
  name: "levelExplain",
  data() {
    return {
      levelDialog: false,
      classData: classData
    };
  },
  computed: {
    ...mapGetters(["userLevel"]),
    levelText() {
      let level = this.classData.find(item => {
        return item.value === this.userLevel;
      });
      if (level) {
        return level.label;
      }
      return 0;
    }
  }
};
</script>

<style lang="less">
@import "~@/style/variables";

.level-explain-layer {
  display: inline-block;

  .level-tips-pop {
    .education {
      color: @global-primary2;
      display: inline-block;
      padding: 0 12px;
      border-radius: 11px;
      background-image: linear-gradient(to right, rgba(255, 172, 112, 0.12), rgba(254, 116, 61, 0.06));
      font-size: @font-size-sm;

      &:hover {
        color: @white;
        background-color: @global-primary;
      }
    }
  }
}

.level-tips-dialog {
  .el-dialog {
    padding: 20px;
  }

  .el-dialog__title {
    font-size: 20px;
    color: @global-default2;
    font-weight: bold;
  }

  .el-dialog__close {
    display: none;
  }

  .close-icon {
    position: absolute;
    right: 8px;
    top: 8px;
  }

  .code-img {
    width: 100%;
  }

  .download {
    color: @global-default2;
    font-size: 16px;
  }

  .pricese {
    margin: 0 auto;
    width: 280px;
    font-size: @font-size-sm;
    color: @global-muted;
    line-height: 30px;
  }
}
</style>
