<template>
  <div>
    <el-card v-if="type === 'vertical'" class="video-list-card" :style="{width, height}" :body-style="{padding: '0px'}">
      <div class="img-box">
        <img :src="data.imageUrl" class="head-img" />
        <span v-show="data.playInfoCount > 1">{{ data.playInfoCount }} {{ $t("video.course") }}</span>
      </div>
      <div class="info">
        <p class="title text-truncate">{{ data.title }}</p>
        <slot name="info">
          <div class="dollar text-muted">
            <span>{{ data.tagCount }}{{ $t("commons.KnowledgePoint") }}</span>
            <div v-if="!data.free" class="price fr">
              <span v-if="data.virtualBeanAmount" class="origin-price vertical-align-middle">
                {{ data.virtualBeanAmount }}
              </span>
              <img class="vertical-align-middle" src="@/assets/img/icon/huidou.png" />
              <span class="vertical-align-middle text-danger">{{ data.realBeanAmount }}</span>
            </div>
          </div>
        </slot>
      </div>
      <div class="edit-mask" v-show="isEdit">
        <el-checkbox size="medium" :value="data.isChecked" @change="onChangeCheckHandle"></el-checkbox>
      </div>
    </el-card>
    <el-card
      v-else-if="type === 'player'"
      class="video-list-card player-list-card"
      :style="{width, height}"
      :body-style="{padding: '0px'}"
    >
      <div class="img-box">
        <img :src="data.imageUrl" class="head-img" />
        <span v-show="data.playInfoCount > 1">{{ data.playInfoCount }} {{ $t("video.course") }}</span>
      </div>
      <div class="info">
        <div class="content">
          <p class="title text-truncate">{{ data.title }}</p>
          <div class="dollar text-muted">
            <span>{{ data.tagCount }} {{ $t("commons.KnowledgePoint") }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card v-else :style="{width, height}" :body-style="{padding: '8px'}" class="video-list-card horizontal">
      <div class="img-box inline-block vertical-align-middle" :style="{width: coverWidth, height: coverHeight}">
        <div v-if="data.state === 2" class="img-off"><img src="@/assets/img/icon/invalid-state.svg" /></div>
        <template v-else>
          <img :src="data.imageUrl" :style="{width: coverWidth, height: coverHeight, borderRadius: '6px'}" />
          <span v-show="data.playInfoCount > 1" class="play-count">
            {{ data.playInfoCount }} {{ $t("video.course") }}
          </span>
        </template>
        <div v-if="isEdit" class="cover-mask">
          <favorite
            :id="data.id"
            :is-favorite="data.collected"
            :collectionStatus="true"
            :OffStatus="data.state"
            name="videoFavoriteList"
            @handleFavorite="handleFavorite"
          ></favorite>
        </div>
      </div>
      <div class="info inline-block right-box vertical-align-middle text-left" :style="{width: infoWidth}">
        <p
          v-if="data.state === 2"
          class="title-off text-truncate text-muted2"
          :style="{height: titleHeight, fontSize: textFontSize}"
        >
          {{ $t("commons.videoOff") }}
        </p>
        <template v-else>
          <p class="title text-truncate" :style="{height: titleHeight, fontSize: textFontSize}">{{ data.title }}</p>
          <slot name="info">
            <div class="dollar text-muted">
              <span>{{ data.tagCount }} {{ $t("commons.KnowledgePoint") }}</span>
            </div>
          </slot>
        </template>
      </div>
      <div class="edit-mask" v-show="isEdit && data.isEdit" @click.stop>
        <el-checkbox size="medium" :value="data.isChecked" @change="onChangeCheckHandle"></el-checkbox>
      </div>
    </el-card>
  </div>
</template>

<script>
import {formatDate} from "@/utils/mUtils";
import favorite from "./favorite";
import {videoType} from "@/utils/types";

export default {
  name: "articleListCard",
  components: {
    favorite
  },
  props: {
    type: {
      type: String,
      default: "vertical"
    },
    data: {
      type: Object,
      default() {
        return videoType;
      }
    },
    width: {
      type: String,
      default() {
        return "282px";
      }
    },
    height: {
      type: String,
      default() {
        return "230px";
      }
    },
    coverWidth: {
      type: String,
      default() {
        return "112px";
      }
    },
    coverHeight: {
      type: String,
      default() {
        return "64px";
      }
    },
    titleHeight: {
      type: String,
      default() {
        return "40px";
      }
    },
    infoWidth: {
      type: String,
      default() {
        return "156px";
      }
    },
    textFontSize: {
      type: String,
      default() {
        return "16px";
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  filters: {
    formatDate(val) {
      return formatDate(val, "YYYY-MM-DD");
    }
  },
  methods: {
    onChangeCheckHandle() {
      this.$emit("onChangeCheck", this.data);
    },
    handleFavorite(status) {
      this.$emit("handleFavorite", {
        item: this.data,
        status: status
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";
.video-list-card {
  position: relative;
  cursor: pointer;
  box-shadow: none;
  border: none;
  border-radius: 8px;

  &.horizontal {
    .img-box {
      margin-bottom: 0;
      .play-count {
        right: 4px;
        bottom: 4px;
      }
    }
  }

  &.img-box {
    margin-bottom: 0;
  }

  &:hover {
    background: linear-gradient(to right, #f6f7f9, #f6f7f9 51%, rgba(246, 247, 249, 0.12));
  }

  .img-box {
    width: 100%;
    height: 158px;
    display: flex;
    align-items: center;
    position: relative;
    margin: 0 0 10px;

    .head-img {
      width: 100%;
      height: 158px;
      margin: 0 auto;
      border-radius: 8px;
    }
    .img-off {
      height: 100%;
      background-color: @gray-bg-color;
      border-radius: 6px;
      img {
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translateX(50%) translateY(-50%);
        border-radius: 10px 10px 0 0;
      }
    }

    span {
      color: #fff;
      background-color: #000;
      border-radius: 4px;
      font-size: 6px;
      padding: 1px 4px;
      position: absolute;
      right: 8px;
      bottom: 8px;
    }

    .cover-mask {
      background: rgba(26, 27, 28, 0.64);
      z-index: 9;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 4px 0 0 4px;

      ::v-deep .favorite-layer {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -20px 0 0 -20px;
        background: none;
      }
    }
  }

  .info {
    .title {
      font-size: 16px;
      color: #000;
    }
    .title-off {
      position: absolute;
      top: 5px;
    }

    .dollar {
      margin-top: 5px;
      font-size: 12px;

      .price {
        line-height: 1;

        .origin-price {
          text-decoration: line-through;
          margin: 0 6px 0 0;
        }

        img {
          height: 16px;
        }
      }
    }
  }

  .edit-mask {
    position: absolute;
    left: 105px;
    top: 5px;
    z-index: 999;
  }

  .right-box {
    width: 156px;
    padding-left: 12px;
  }
}

.player-list-card {
  margin: 0 0 15px;

  &:hover {
    background: #fff;
  }

  .info {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    &:hover {
      background-color: rgba(0, 0, 0, 0.35);
    }

    .content {
      padding: 15px;

      .title {
        color: #fff;
      }
    }
  }
}
</style>
