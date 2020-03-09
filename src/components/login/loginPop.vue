<template>
  <el-dialog
    title="提示"
    :visible="dialogVisible"
    width="400px"
    :show-close="false"
    :lock-scroll="false"
    custom-class="default-dialog"
    :append-to-body="true"
    class="login-pop-layer"
  >
    <icon-svg class="close-btn" icon-class="icon-close" @click.native="onClickCloseHandle"></icon-svg>
    <div slot="title" class="header-title">
      <el-row>
        <el-col :span="15">
          <h2 class="text-left">{{ $t("account.loginHuiketang") }}</h2>
        </el-col>
        <el-col :span="9">
          <el-select :value="currentLanguage" placeholder="简体中文" size="small" @change="onChangeLanguageHandle">
            <el-option v-for="item in languageOpt" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div v-if="loginWay == '0'" class="form-layer">
        <mobile-login></mobile-login>
      </div>
      <div v-if="loginWay == '1'" class="form-layer">
        <password-login></password-login>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import mobileLogin from "./mobileLogin";
import passwordLogin from "./passwordLogin";
import * as types from "@/store/types";
import {mapGetters, mapMutations} from "vuex";
import {setStore} from "@/utils/mUtils";

export default {
  name: "loginPop",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    mobileLogin,
    passwordLogin
  },
  data() {
    return {
      languageOpt: [
        {id: 1, name: "简体中文"},
        {id: 2, name: "繁体中文"}
      ],
      loginWay: 0
    };
  },
  computed: {
    ...mapGetters(["currentLanguage"])
  },
  methods: {
    ...mapMutations([types.SET_CURRENT_LANGUAGE]),
    onClickCloseHandle() {
      this.$emit("close");
    },
    onChangeLanguageHandle(val) {
      this[types.SET_CURRENT_LANGUAGE](val);
      setStore("currentLanguage", val);
      this.$message.success("修改区域语言成功");
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/variables";

.login-pop-layer {
  .header-title {
    padding: 30px 48px;
    border-bottom: 1px solid @gray-bg-color;
  }

  .content {
    padding: 20px 48px 40px;
  }

  .tabs {
    margin: 0 0 20px;

    .split {
      margin: 0 5px;
    }

    .tips {
      border: solid 1px rgba(254, 116, 61, 0.24);
      background-color: rgba(254, 116, 61, 0.06);
      margin: 0 0 0 6px;
      padding: 2px 4px;
      border-radius: 4px;
    }
  }
}
</style>
