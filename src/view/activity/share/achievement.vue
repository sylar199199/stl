<template>
  <container class="achievement-layer">
    <div class="container">
      <el-row class="obtain text-center">{{ $t("myHuidou.congratulations") }}</el-row>
      <el-row class="bean text-ll text-center">{{ rewardBean }}{{ $t("commons.huidou") }}</el-row>
      <div class="content-box">
        <img class="bg" src="@/assets/img/icon/sunlight.svg" />
        <div class="bean-card">
          <p class="text-ll">{{ rewardBean }}</p>
        </div>
        <el-row class="huidou-bar text-center">
          <img class="inline-block  vertical-align-middle" src="@/assets/img/icon/huidou.png" />
          <img class="inline-block vertical-align-middle" src="@/assets/img/icon/multiplication.svg" />
          <span class="bean-amount vertical-align-middle">{{ rewardBean }}</span>
          <span class="bean-text text-sm vertical-align-middle">{{ $t("commons.huidou") }}</span>
        </el-row>
      </div>
      <div style="margin-bottom: 180px;">
        <el-button @click="onClickLinkCourseHandle" class="look-course btn-block" type="primary">
          去{{ $t("myOrder.lookCourse") }}
        </el-button>
      </div>
    </div>
  </container>
</template>

<script>
import * as api from "@/api/share";
import {mapGetters} from "vuex";
export default {
  data() {
    return {
      rewardBean: 0
    };
  },
  computed: {
    ...mapGetters(["userName", "userUid"]),
    params() {
      return this.$route.query.params;
    }
  },
  created() {
    this.addRewardRecord();
  },
  methods: {
    addRewardRecord() {
      let inviteParam = {
        fromUid: this.params.fromUid,
        invitedUid: this.userUid,
        objId: this.params.objId,
        objType: this.params.type
      };
      api
        .addRewardRecord(inviteParam)
        .then(res => {
          this.rewardBean = res.rewardBean;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    onClickLinkCourseHandle() {
      if (this.params.type === "1") {
        this.$router.push({name: "articleInfo", params: {articleId: this.params.objId}});
      } else {
        this.$router.push({name: "videoDetail", params: {id: this.params.objId}});
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.achievement-layer {
  height: 745px;
  background-color: @global-default;

  .container {
    margin: 24px auto 0;
    height: 720px;
    border-radius: 8px;
    background-color: #27201e;

    .obtain {
      font-size: 30px;
      color: #ef275e;
    }

    .bean {
      color: @white;
      margin: 24px auto;
    }

    .content-box {
      width: 280px;
      height: 280px;
      margin: 0 auto;
      border-radius: 16px;
      border: 2px solid @global-primary;
      position: relative;

      .bg {
        width: 270px;
        height: 270px;
        border-radius: 50%;
        background-color: #27201e;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        animation: play 15s linear infinite;
      }

      @keyframes play {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .bean-card {
        width: 120px;
        height: 153px;
        top: 44px;
        left: 50%;
        margin-left: -60px;
        text-align: center;
        position: absolute;
        background: url("../../../assets/img/icon/bean-card.svg") no-repeat #27201e;

        p {
          color: #d2a05a;
          margin-top: 100px;
        }
      }

      .huidou-bar {
        width: 172px;
        height: 42px;
        margin: 0 auto;
        color: @global-primary2;
        line-height: 42px;
        border-radius: 30px;
        background-color: @white;
        position: absolute;
        bottom: 24px;
        left: 54px;

        .bean-amount {
          font-size: 20px;
          padding-right: 4px;
        }
      }
    }

    .look-course {
      width: 240px;
      height: 40px;
      margin: 48px auto 0;
      border-radius: 30px;
    }
  }
}
</style>
