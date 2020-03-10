<template>
  <el-card class="article-list-card" :style="{width, height}" :body-style="{padding: '0px'}">
    <div class="wrap">
      <div class="left-box inline-block vertical-align-middle" :style="{width: coverWidth, height: coverHeight}">
        <article-card-cover
          class="article-card-cover"
          :data="data"
          :width="coverWidth"
          :height="coverHeight"
          :text-box-font-size="textBoxFontSize"
          :text-box-font-size-em="textBoxFontSizeEm"
        >
          <div v-if="isEdit" class="cover-mask">
            <favorite
              :is-favorite="data.collected"
              :id="data.id"
              :collectionStatus="true"
              :OffStatus="data.state"
              name="articleFavoriteList"
              @handleFavorite="handleFavorite"
            ></favorite>
          </div>
        </article-card-cover>
        <div class="edit-mask fl" v-show="isEdit && data.isEdit" @click.stop>
          <el-checkbox
            class="del-ckb"
            size="medium"
            :value="data.isChecked"
            @change="onChangeCheckHandle"
          ></el-checkbox>
        </div>
      </div>
      <div class="right-box inline-block vertical-align-middle" :style="{width: rightBoxTextWidth}">
        <div class="info">
          <p v-if="data.state === 2" class="title-off text-left text-muted2">{{ $t("commons.articleOff") }}</p>
          <template v-else>
            <p class="title text-left" :style="{fontSize: textFontSize}">{{ data.title }}</p>
            <slot name="info">
              <div class="dollar text-muted">
                <div v-if="!data.free" class="price fl">
                  <img class="vertical-align-middle" src="@/assets/img/icon/price-icon.svg" />
                  <span class="vertical-align-middle text-danger real-bean">{{ data.realBeanAmount }}</span>
                  <span v-if="data.virtualBeanAmount" class="origin-price vertical-align-middle">
                    {{ data.virtualBeanAmount }}
                  </span>
                </div>
                <div class="free fl text-center" v-else>{{ $t("commons.free") }}</div>
                <span class="chapter-count">Chapter {{ data.chapterCount }}</span>
              </div>
            </slot>
          </template>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import articleCardCover from "./cover";
import {formatDate} from "@/utils/mUtils";
import favorite from "../favorite";
import {articleType} from "@/utils/types";

export default {
  name: "articleCardList",
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
        return "300px";
      }
    },
    height: {
      type: String,
      default() {
        return "auto";
      }
    },
    coverWidth: {
      type: String,
      default() {
        return "94px";
      }
    },
    coverHeight: {
      type: String,
      default() {
        return "120px";
      }
    },
    textFontSize: {
      type: String,
      default() {
        return "16px";
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
    },
    isEdit: {
      type: Boolean,
      default() {
        return false;
      }
    },
    rightBoxTextWidth: {
      type: String,
      default() {
        return "170px";
      }
    }
  },
  data() {
    return {};
  },
  components: {
    articleCardCover,
    favorite
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
@import "~@/style/variables";

.article-list-card {
  position: relative;
  cursor: pointer;
  box-shadow: none;
  border: none;

  &:hover {
    background: linear-gradient(to right, #f6f7f9, #f6f7f9 51%, rgba(246, 247, 249, 0.12));
  }

  .wrap {
    .left-box {
      padding: 8px;

      .article-card-cover {
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
    }

    .edit-mask {
      position: absolute;
      left: 55px;
      top: 5px;
      z-index: 999;
    }

    .right-box {
      padding: 0 12px 0 0;
      width: 170px;

      .info {
        padding: 0 0 0 10px;

        .title {
          white-space: pre-wrap;
          font-size: 16px;
          color: #000;
        }
        .title-off {
          white-space: pre-wrap;
        }

        .dollar {
          margin-top: 12px;
          font-size: 12px;

          .price {
            line-height: 1;

            .origin-price {
              text-decoration: line-through;
              margin: 0 0 0 6px;
            }

            img {
              height: 16px;
            }

            .real-bean {
              margin-left: 5px;
            }
          }
          .free {
            width: 36px;
            height: 20px;
            font-size: 11px;
            line-height: 20px;
            color: @global-success;
            border-radius: @border-radius-base;
            border: 2px solid @global-success;
          }

          .chapter-count {
            margin-left: 30px;
          }
        }
      }
    }
  }
}
</style>
