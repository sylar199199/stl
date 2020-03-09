<template>
  <div class="pay-gate-way-layer">
    <p class="text-center">跳转支付宝中...</p>
  </div>
</template>

<script>
export default {
  name: "payGateWay",
  data() {
    return {
      formHtml: ""
    };
  },
  mounted() {
    this.formHtml = this.$route.params.htmlData;
    this.$nextTick(() => {
      document.getElementById("paymentSubmit").submit();
    });
  }
};
</script>

<style scoped></style>
