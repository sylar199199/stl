<template>
  <container class="setting-language-layer gray-bg">
    <user-panel active-index="4">
      <div class="setting-language-content">
        <top-menu :active-index="2"></top-menu>
        <h4 class="title">{{ $t("setting.changeLanguage") }}</h4>
        <div class="content">
          <el-form ref="personalDataForm" label-position="left" label-width="50px">
            <el-form-item :label="$t('setting.language')">
              <el-select v-model="language" @change="onChangeHandle">
                <el-option
                  v-for="item in languageOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </user-panel>
  </container>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import * as types from "@/store/types";
import userPanel from "@/layout/user/panel";
import topMenu from "@/view/user/setting/components/topMenu";

export default {
  name: "settingLanguage",
  components: {
    userPanel,
    topMenu
  },
  data() {
    return {
      languageOpt: [
        {
          value: 1,
          label: "简体中文"
        },
        {
          value: 2,
          label: "繁体中文"
        }
      ]
    };
  },

  computed: {
    ...mapGetters(["currentLanguage"]),
    language: {
      get() {
        return this.currentLanguage;
      },
      set(val) {
        this[types.SET_CURRENT_LANGUAGE](val);
      }
    }
  },
  methods: {
    ...mapMutations([types.SET_CURRENT_LANGUAGE]),
    onChangeHandle(value) {
      this.$message.success("修改区域语言成功");
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.setting-language-layer {
  .setting-language-content {
    .title {
      height: 48px;
      line-height: 48px;
      padding: 16px 32px;
    }

    .content {
      padding: 0 0 0 60px;

      ::v-deep .el-form-item__label {
        color: @global-muted;
        padding: 0 16px 0 0;
      }
    }
  }
}
</style>
