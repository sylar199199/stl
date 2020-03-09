<template>
  <div v-loading="loading" />
</template>

<script>
export default {
  props: ["clientId", "currency", "orderId", "amount", "env", "locale"],
  data() {
    return {
      loading: true
    };
  },
  methods: {
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            reference_id: this.orderId,
            amount: {
              value: this.amount
            }
          }
        ]
      });
    },
    async onApprove(data, actions) {
      const response = await actions.order.capture();
      this.$emit("payment-completed", response);
    },
    loadScript(loaded) {
      const paypalScript = document.createElement("script");
      paypalScript.setAttribute(
        "src",
        `https://www.paypal.com/sdk/js?client-id=${this.clientId}` +
          `&currency=${this.currency}` +
          "&disable-funding=card"
      );
      paypalScript.async = true;
      paypalScript.defer = true;
      paypalScript.onload = loaded;
      document.head.appendChild(paypalScript);
    },
    generateButton() {
      this.loading = false;
      const paypal = window.paypal;
      const button = Object.assign({
        env: this.env,
        locale: this.locale,
        style: {
          color: "blue",
          size: "responsive",
          height: 44
        },
        createOrder: this.createOrder,
        onApprove: this.onApprove
      });
      paypal.Buttons(button).render(this.$el);
    }
  },
  mounted() {
    this.loadScript(this.generateButton);
  }
};
</script>
