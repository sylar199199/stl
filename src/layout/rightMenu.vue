<template>
  <div class="menu-right text-center" ref="menuTop">
    <ul>
      <slot></slot>
      <li>
        <router-link v-if="userUid > 0" target="_blank" :to="{name: 'feedback'}">
          <el-popover
            popper-class="popover-tips-default"
            :visible-arrow="false"
            placement="bottom"
            trigger="hover"
            :content="$t('help.feedback')"
          >
            <icon-svg slot="reference" icon-class="icon-feedback" class="vertical-align-middle icon"></icon-svg>
          </el-popover>
        </router-link>
        <el-popover
          v-else
          popper-class="popover-tips-default"
          :visible-arrow="false"
          placement="bottom"
          trigger="hover"
          :content="$t('help.feedback')"
        >
          <span slot="reference" @click="popLogin()">
            <icon-svg icon-class="icon-feedback" class="vertical-align-middle icon"></icon-svg>
          </span>
        </el-popover>
      </li>
      <li>
        <el-popover popper-class="app-download-pop" placement="left" trigger="hover">
          <div><img class="app-code-pic" src="@/assets/img/fx110_code.jpg" /></div>
          <icon-svg slot="reference" icon-class="icon-download" class="vertical-align-middle icon"></icon-svg>
        </el-popover>
      </li>
      <li v-show="isShow">
        <back-top @hideBack="hideBack"></back-top>
      </li>
    </ul>
  </div>
</template>

<script>
import backTop from "@/components/backTop";
import {mapGetters, mapMutations} from "vuex";
import * as types from "@/store/types";

export default {
  name: "topMenu",
  data() {
    return {
      searchText: "",
      isShow: false
    };
  },
  components: {
    backTop
  },
  computed: {
    ...mapGetters(["userName", "userUid"])
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations([types.SET_LOGIN_DIALOG_VISIBLE]),
    hideBack(params) {
      this.isShow = params;
    },
    popLogin() {
      this[types.SET_LOGIN_DIALOG_VISIBLE](true);
    }
  },
  watch: {}
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.menu-right {
  position: fixed;
  bottom: 50%;
  right: 20px;
  margin-top: -100px;
  width: 48px;
  border-radius: 5px 0 0 5px;
  z-index: 999;

  li {
    position: relative;
    margin-top: 20px;

    width: 48px;
    height: 48px;
    border-radius: 50%;
    box-shadow: 0 0 16px 0 rgba(91, 100, 110, 0.16);
    line-height: 48px;
    cursor: pointer;
    text-align: center;
    background-color: #fff;

    .icon {
      font-size: @font-size-xl;
      color: @global-default4;
    }
  }
}

.app-download-pop {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 0 16px 0 rgba(91, 100, 110, 0.16);

  .app-code-pic {
    width: 200px;
  }
}
</style>
