<template>
  <container class="feedback gray-bg">
    <div class="container feedback-layer">
      <div class="feedback-header text-lg text-default3">{{ $t("help.feedback") }}</div>
      <div class="feedback-content">
        <span class="text-lg">
          <span class="text-default3">{{ $t("help.questionType") }}</span>
          <span class="text-muted2">{{ $t("help.chooseType") }}</span>
        </span>
        <el-row class="question">
          <el-radio-group v-model="submitData.typeId">
            <el-radio v-for="item in questionType" :key="item.typeId" :label="item.typeId" class="text-default4">
              {{ item.reason }}
            </el-radio>
          </el-radio-group>
        </el-row>
        <el-input type="textarea" :placeholder="$t('help.addMoreMsg')" v-model="submitData.content" rows="7"></el-input>
        <div class="text-lg add-picture">
          <span class="text-default3">{{ $t("help.addPics") }}</span>
          <span class="text-muted2">{{ $t("help.mostPics") }}</span>
        </div>
        <el-upload
          action=""
          ref="fileUpload"
          list-type="picture-card"
          show-file-list
          :limit="4"
          class="upload-pictrue"
          :http-request="fileUpload"
          :on-remove="handleRemove"
        >
          <img src="@/assets/img/icon/add.svg" />
        </el-upload>
      </div>
      <el-row class="text-center feedback-footer-layer">
        <el-button type="primary" class="feedback-footer" @click="submit()">提交</el-button>
      </el-row>
    </div>
  </container>
</template>
<script>
import * as api from "@/api/uploader";
import * as apiFeedBack from "@/api/common";
export default {
  data() {
    return {
      radio: "0",
      information: "",
      submitData: {
        clientType: 4,
        content: "",
        imgUrls: [],
        typeId: -1
      },
      questionType: []
    };
  },
  created() {
    this.getQuestionType();
  },
  methods: {
    handleRemove(file, fileList) {
      this.$message({
        message: "删除图片成功",
        type: "succuss"
      });
    },
    fileUpload(event) {
      let file = event.file;
      let fileType = 1; //1是图片，2是音频，3是视频，4是文件
      api.upLoad
        .uploader(file, fileType)
        .then(res => {
          let imgUrl = res.url;
          this.submitData.imgUrls.push(imgUrl);
        })
        .catch(res => {
          this.$message({
            message: "上传失败",
            type: "error"
          });
        });
    },
    reset() {
      this.submitData = {
        clientType: 4,
        content: "",
        imgUrls: [],
        typeId: -1
      };
    },
    submit() {
      apiFeedBack
        .addFeedBack(this.submitData)
        .then(res => {
          this.$refs.fileUpload.clearFiles();
          this.reset();
          this.$message({
            message: "提交成功",
            type: "success"
          });
        })
        .catch(res => {
          this.$message({
            message: "上传失败",
            type: "success"
          });
        });
    },
    getQuestionType() {
      apiFeedBack.getQuestionType().then(res => {
        this.questionType = res;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/style/view/help/feedback.less";
</style>
