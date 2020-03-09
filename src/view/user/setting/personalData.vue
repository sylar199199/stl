<template>
  <container class="setting-personal-data-layer gray-bg">
    <user-panel activeIndex="6">
      <div class="setting-personal-data-content">
        <top-menu :active-index="0"></top-menu>
        <div class="content">
          <el-row class="title">
            <el-col :span="12">
              <strong class="text-default3">基本信息</strong>
            </el-col>
            <el-col class="text-right" :span="12">
              <strong class="text-primary pointer" @click="onClickEditHandle">{{ editText }}</strong>
            </el-col>
          </el-row>
          <el-form
            class="personal-form"
            ref="personalDataForm"
            label-position="right"
            :rules="rules"
            :model="ruleForm"
            label-width="80px"
            :hide-required-asterisk="true"
          >
            <el-form-item :label="$t('setting.avatar')">
              <el-upload
                v-show="isEdit"
                class="avatar-uploader"
                ref="fileUpload"
                action=""
                :show-file-list="false"
                :http-request="fileUpload"
              >
                <el-avatar class="vertical-align-middle  el-avatar-default" :src="ruleForm.avatar"></el-avatar>
                <el-button class="avatar-btn">{{ $t("setting.changeAvatar") }}</el-button>
              </el-upload>
              <el-avatar
                v-show="!isEdit"
                class="vertical-align-middle head-pic el-avatar-default"
                :src="userAvatar"
              ></el-avatar>
            </el-form-item>
            <el-form-item :label="$t('setting.nickName')" prop="nickname">
              <el-input v-show="isEdit" v-model="ruleForm.nickname"></el-input>
              <p v-show="!isEdit" class="txt text-default3">{{ userName }}</p>
            </el-form-item>
            <el-form-item :label="$t('setting.intro')" prop="intro">
              <el-input v-show="isEdit" v-model="ruleForm.intro" type="textarea" :rows="3" resize="none"></el-input>
              <p v-show="!isEdit" class="txt text-default3">{{ introduce }}</p>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="isEdit" class="footer text-center">
          <el-button round type="default" @click="cancleEdit">取消</el-button>
          <el-button round type="primary" @click="onSubmitHandle" :loading="loading">保存并修改</el-button>
        </div>
      </div>
    </user-panel>
  </container>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import userPanel from "@/layout/user/panel";
import topMenu from "@/view/user/setting/components/topMenu";
import * as types from "@/store/types";
import * as validator from "@/utils/validator";
import * as api from "@/api/uploader";
import * as apiUser from "@/api/user";

export default {
  name: "personalData",
  components: {
    userPanel,
    topMenu
  },
  data() {
    return {
      isEdit: false,
      ruleForm: {
        avatar: "",
        nickname: "",
        intro: ""
      },
      rules: {
        nickname: [{required: true, min: 1, max: 10, trigger: "change", message: "请输入1-10个字符的昵称"}],
        intro: [{min: 0, max: 30, trigger: "change", message: "请输入0-30字符之间的自我介绍"}]
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters(["userAvatar", "userName", "userIntroduce"]),
    introduce() {
      return this.userIntroduce || "暂无自我介绍";
    },
    editText() {
      return this.isEdit ? "保存" : this.$t("commons.edit");
    }
  },
  created() {},
  mounted() {
    this.resetContent();
  },
  methods: {
    ...mapMutations([types.SET_AVATAR, types.USER_SET_NAME, types.SET_INTRODUCE]),
    resetContent() {
      this.ruleForm.avatar = this.userAvatar;
      this.ruleForm.nickname = this.userName;
      this.ruleForm.intro = this.userIntroduce;
    },
    fileUpload(event) {
      let file = event.file;
      let fileType = 1; //1是图片，2是音频，3是视频，4是文件
      api.upLoad
        .uploader(file, fileType)
        .then(res => {
          this.ruleForm.avatar = res.url;
        })
        .catch(res => {
          this.$message({
            message: "上传失败",
            type: "error"
          });
        });
    },
    onClickEditHandle() {
      if (this.isEdit) {
        this.onSubmitHandle();
      } else {
        this.isEdit = !this.isEdit;
      }
    },
    onSubmitHandle() {
      this.$refs["personalDataForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          apiUser
            .updateUserBaseInfo(this.ruleForm)
            .then(res => {
              this[types.SET_AVATAR](this.ruleForm.avatar);
              this[types.SET_INTRODUCE](this.ruleForm.intro);
              this[types.USER_SET_NAME](this.ruleForm.nickname);
              this.loading = false;
              this.isEdit = false;
              this.resetContent();
            })
            .catch(res => {
              this.$message.error(res.message);
              this.loading = false;
            });
        } else {
          this.$message.error("修改信息失败");
        }
      });
    },
    cancleEdit() {
      this.isEdit = false;
      this.$refs["personalDataForm"].clearValidate(); //移除验证结果
      this.resetContent();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.setting-personal-data-layer {
  .setting-personal-data-content {
    .content {
      padding: 32px;
      margin: 0 0 236px;

      .title {
        margin: 0 0 20px;
      }

      .head-pic {
        width: 64px;
        height: 64px;
        margin: -12px 0 0 16px;
      }

      .txt {
        padding: 0 0 0 16px;
      }

      ::v-deep .el-form-item__label {
        color: @global-muted;
        padding: 0 16px 0 0;
      }

      ::v-deep.avatar-uploader {
        .avatar-btn {
          margin: 0 0 0 15px;
        }
      }
      ::v-deep.el-form .el-form-item {
        margin: 0px 0px 20px;
      }

      .personal-form {
        width: 475px;
      }
    }

    .footer {
      border-top: 1px solid @gray-bg-color;
      padding: 25px 0;

      .el-button {
        width: 168px;
      }
    }
  }
}
</style>
