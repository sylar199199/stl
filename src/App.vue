<template>
  <div class="layout-layer" id="app">
    <div class="main-content" id="mainContent">
      <transition>
        <router-view class="app-view"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import * as types from "@/store/types";
import {loadLanguageAsync} from "@/lang";
import {setStore} from "@/utils/mUtils";

export default {
  name: "home",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["rightMenuVisible", "currentLanguage"])
  },
  mounted() {
    this.doChangeLanguage(this.currentLanguage);
  },
  watch: {
    currentLanguage(val) {
      this.doChangeLanguage(val);
    }
  },
  methods: {
    ...mapMutations([types.SET_ROUTERS]),
    doChangeLanguage(val) {
      let lang = val === 1 ? "cn" : "tw";
      loadLanguageAsync(lang).then(res => {
        setStore("currentLanguage", val);
      });
    }
  }
};
</script>

<style lang="less">
@import "./style/variables";
@import "./style/element-ui";
@import "./style/common";

.layout-layer {
  position: relative;
  min-height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.main-content {
  padding-bottom: 120px;

  .app-view {
    //width: 100%;
  }
}
</style>
