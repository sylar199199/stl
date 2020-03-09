<template>
  <div>
    <iframe
      sandbox="allow-scripts allow-top-navigation allow-same-origin"
      scrolling="no"
      width="300"
      height="400"
      frameBorder="0"
      allowTransparency="true"
      :src="setSrc"
    ></iframe>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {weixinUrl, redirect_uri} from "@/utils/env";

export default {
  computed: {
    ...mapGetters(["currentLanguage"]),
    redirectUri() {
      return `${redirect_uri}`;
    },
    setSrc() {
      let _url =
        `${weixinUrl}?appid=` +
        this.appid +
        "&scope=" +
        this.scope +
        "&state=" +
        this.weixinState +
        "&redirect_uri=" +
        this.redirectUri +
        "&login_type=jssdk&self_redirect=default&style=" +
        this.theme;
      return encodeURI(_url);
    },
    weixinState() {
      return encodeURIComponent(`${this.currentLanguage}|2|${location.pathname}|${this.type}|${this.uid}`);
    }
  },
  props: {
    appid: {
      type: String,
      default: "wx5a43fc329329c6ac"
    },
    //应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写snsapi_login即可
    scope: {
      type: String,
      default: "snsapi_login"
    },
    //重定向地址，需要进行UrlEncode
    redirect_uri: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    //提供"black"、"white"可选，默认为黑色文字描述。详见文档底部FAQ
    theme: {
      type: String,
      default: "black"
    },
    // scope类型
    type: {
      type: Number,
      default: 1
    },
    uid: {
      type: Number,
      default: 0
    }
  }
};
</script>
