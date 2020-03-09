<template>
  <div id="paypalButtonContainer"></div>
</template>

<script>
import * as api from "@/api/order";
export default {
  props: {
    clientId: {
      type: String,
      default: ""
    },
    orderNo: {
      type: String,
      default: ""
    },
    locale: {
      type: String,
      default: ""
    },
    env: {
      type: String,
      default: ""
    },
    currency: {
      type: String,
      default: ""
    },
    amount: {
      type: String,
      default: ""
    }
  },
  mounted() {
    this.loadScript(this.clientId).then(() => {
      paypal
        .Buttons({
          env: this.env,
          // Pass in the client ids to use to create your transaction
          // on sandbox and production environments
          style: {
            color: "blue",
            size: "responsive",
            height: 44
          },
          createOrder: this.createOrder,
          onApprove: this.onApprove
        })
        .render("#paypalButtonContainer");
    });
  },
  methods: {
    loadScript(clientId) {
      /*global someFunction paypal:true*/
      return new Promise((resolve, reject) => {
        let configScript = document.createElement("script");
        configScript.type = "text/javascript";
        configScript.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
        document.getElementsByTagName("head")[0].appendChild(configScript);
        configScript.onload = function() {
          if (paypal) {
            resolve();
          } else {
            reject();
          }
        };
      });
    },
    createOrder: function(data) {
      //this.$emit("payment-create", data);
      return api
        .getOrderFrom({
          orderNo: this.orderNo,
          payChannel: 3,
          orderAmountTotal: this.amount
        })
        .then(res => {
          console.log(res);
          return res.returnString.json();
        })
        .then(data => {
          return data.orderID; // Use the same key name for order ID on the client and server
        });
    },
    onApprove(data) {
      //this.$emit("payment-approve", data);
      return api
        .getPaypalOrderStatus({orderID: data.orderID})
        .then(function(res) {
          return res.json();
        })
        .then(function(details) {
          this.$message(details.payer_given_name);
        });
    },
    onCompleted(data, actions) {
      this.$emit("payment-completed", data);
      const vue = this;
      vue.$emit("payment-authorized", data);
      if (this.commit) {
        return actions.payment.execute().then(response => {});
      }
      return true;
    },
    onCancel(data) {
      this.$emit("payment-cancelled", data);
    }
  }
};
</script>
