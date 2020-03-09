<template>
  <div
    class="article-card-cover"
    ref="articleCardCover"
    :style="{width, height}"
    :class="{'text-bg': data.coverType === 1}"
  >
    <div class="img-box-off" v-if="data.state === 2">
      <div class="bg">
        <img class="vertical-align-middle" src="@/assets/img/icon/invalid-state.svg" />
      </div>
    </div>
    <template v-else>
      <div
        ref="articleCardBox"
        class="text-box"
        :style="{color: articleBGColor, fontSize: textBoxFontSize}"
        v-if="data.coverType === 1"
      >
        <p class="education">
          {{
            data.gradeId === 1
              ? $t("article.primaryChapter")
              : data.gradeId === 2
              ? $t("article.middleChapter")
              : $t("article.universityChapter")
          }}
        </p>
        <div class="book-name" :style="{letterSpacing, fontSize: textBoxFontSizeEm}">
          <p>{{ data.coverText.substring(0, 2) }}</p>
          <p>{{ data.coverText.substring(2, 4) }}</p>
        </div>
        <span class="tag">HUIKETANG</span>
      </div>
      <div class="img-box" v-else>
        <div class="bg">
          <img :src="data.imageUrl" />
        </div>
      </div>

      <div class="left-shadow" :class="{text: data.coverType === 1}"><!--左边阴影渐变--></div>
      <div class="bottom-mark"><!--底部遮罩--></div>
    </template>
    <slot></slot>
  </div>
</template>

<script>
import {articleType} from "@/utils/types";
export default {
  name: "articleCardCover",
  props: {
    data: {
      type: Object,
      default() {
        return articleType;
      }
    },
    width: {
      type: String,
      default() {
        return "100%";
      }
    },
    height: {
      type: String,
      default() {
        return "100%";
      }
    },
    letterSpacing: {
      type: String,
      default() {
        return "4px";
      }
    },
    textBoxFontSize: {
      type: String,
      default() {
        return "16px";
      }
    },
    textBoxFontSizeEm: {
      type: String,
      default() {
        return "2.6em";
      }
    }
  },
  computed: {
    articleBGColor() {
      return this.data.coverTextColor ? this.data.coverTextColor.substring(0, 7) : "";
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";
.article-card-cover {
  position: relative;
  border-radius: 10px;
  box-shadow: 0 8px 16px 0 #e8e9eb;

  &.text-bg {
  }

  .text-box {
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: left top;
    background-color: #fff;
    border-radius: 20px;

    .education {
      font-size: 1em;
      padding: 10% 20%;
      opacity: 0.7;
    }

    .book-name {
      width: 55%;
      padding: 0 10%;
      text-align: center;
      font-size: 2.6em;
      font-weight: 500;
      margin: 0 auto;

      p {
        line-height: 1.4;
      }
    }

    .tag {
      font-size: 1em;
      writing-mode: vertical-lr;
      position: absolute;
      bottom: 17%;
      right: 5%;
      opacity: 0.6;
    }
  }
  .img-box-off {
    height: 100%;
    background-color: @gray-bg-color;
    .bg {
      position: absolute;
      top: 50%;
      right: 50%;
      transform: translateX(50%) translateY(-50%);
      border-radius: 10px 10px 0 0;
    }
  }

  .img-box {
    height: 100%;

    .bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 10px 10px 0 0;

      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
  }

  .left-shadow {
    position: absolute;
    left: 0;
    top: 0;
    width: 10.9%;
    height: 100%;
    border-radius: 10px 0 0 10px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.72) 1%, rgba(255, 255, 255, 0) 99%);

    &.text {
      background-image: linear-gradient(to right, #f6f6f6 1%, #ffffff 99%);
    }
  }

  .bottom-mark {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 11.42%;
    background-color: #f6f7f9;
    border-radius: 10px 0 10px 10px;
  }
}
</style>
