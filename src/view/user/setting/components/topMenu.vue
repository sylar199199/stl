<template>
  <default-tabs :list="menuList" :active-index="activeIndex" @change="onChangeTypeHandle"></default-tabs>
</template>

<script>
import defaultTabs from "@/components/defaultTabs";
import {settingMenuList} from "@/utils/env";

export default {
  name: "userSettingLeftMenu",
  data() {
    return {
      settingMenuList: this.$t("personCenter.settingMenuList")
    };
  },
  components: {
    defaultTabs
  },
  props: {
    activeIndex: {
      default: 0,
      type: Number
    }
  },
  computed: {
    menuList() {
      return this.$t("personCenter.settingMenuList").map((item, index) => {
        return {
          label: item.title,
          value: index
        };
      });
    }
  },
  methods: {
    onChangeTypeHandle(index) {
      this.$router.push({name: settingMenuList[index].name});
    }
  }
};
</script>

<style scoped>
.user-left-menu {
  text-align: center;
}
</style>
