<template>
  <div class="key-word inline-block vertical-align-middle">
    <el-tag
      class="key-word-tag"
      type="default"
      size="small"
      @click="onClickTagSearchHandle(item.tag)"
      v-for="item in list"
      :key="item.id"
    >
      {{ item.tag }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: "keyWordTag",
  props: {
    list: {
      default() {
        return [];
      },
      type: Array
    }
  },
  methods: {
    onClickTagSearchHandle(value) {
      this.$router.push({name: "searchList", params: {query: value}});
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.key-word-tag {
  margin: 0 5px 0 0;
  cursor: pointer;

  &:hover {
    background-color: @gray-bg-color;
    border-color: @gray-bg-color;
  }
}
</style>
