<template>
  <ul class="user-left-menu user-menu-list">
    <li
      v-for="(item, index) in menuList"
      :index="index.toString()"
      :key="item.title"
      @click="onRouterLinkHandle(item.name)"
    >
      <div class="item-content" :class="{active: $attrs.activeIndex === index.toString()}">
        <icon-svg
          class="text-icon text-muted2 vertical-align-middle inline-block"
          :icon-class="'icon-' + item.icon"
        ></icon-svg>
        <span class="text-default vertical-align-middle name">{{ $t(item.title) }}</span>
        <span
          class="badge inline-block"
          v-if="item.name === 'myInformation' && userInformationCount > 0"
          :class="userInformationCount > 9 ? 'more' : 'less'"
        >
          {{ userInformationCount > 99 ? "99+" : userInformationCount }}
        </span>
      </div>
    </li>
  </ul>
</template>

<script>
import {mapGetters} from "vuex";
import {userMenuList} from "@/utils/env";

export default {
  name: "userLeftMenu",
  data() {
    return {
      menuList: userMenuList
    };
  },
  computed: {
    ...mapGetters(["userInformationCount"])
  },

  methods: {
    onRouterLinkHandle(name) {
      this.$router.push({name});
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables";

.user-left-menu {
  background-color: #fff;
  width: 208px;
  padding: 16px;
  border-radius: 4px;

  .item-content {
    height: 48px;
    line-height: 48px;
    padding: 0 0 0 16px;
    font-size: @font-size-lg;

    &.active {
      .text-icon,
      .name {
        color: @global-primary;
      }
    }

    .badge {
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      color: #fff;
      margin: 0 0 0 10px;
      background-color: @global-danger;
    }

    .more {
      border-radius: 30px;
      padding: 2px 7px;
    }

    .less {
      width: 16px;
      border-radius: 50%;
      padding: 2px;
    }
  }
}
</style>
