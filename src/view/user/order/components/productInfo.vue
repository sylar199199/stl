<template>
  <div class="product-info-layer">
    <template v-if="productType === 1">
      <template v-if="product.courseType === 1">
        <router-link
          v-if="product.subCourseCount === 1"
          target="_blank"
          :to="{name: 'chapterDetails', params: {articleId: productId, chapterId: product.chapterId}}"
        >
          <article-list-card class="article-list-card" :data="product">
            <p slot="info" class="text-muted text-left">
              {{ product.subCourseCount }}章共{{ product.tagCount }}个知识点
            </p>
          </article-list-card>
        </router-link>
        <router-link v-else target="_blank" :to="{name: 'articleInfo', params: {articleId: productId}}">
          <article-list-card class="article-list-card" :data="product">
            <p slot="info" class="text-muted text-left">
              {{ product.subCourseCount }}章共{{ product.tagCount }}个知识点
            </p>
          </article-list-card>
        </router-link>
      </template>
      <template v-else>
        <router-link target="_blank" :to="{name: 'videoDetail', params: {id: productId}}">
          <video-list-card
            class="video-list-card"
            :data="product"
            type="horizontal"
            width="470px"
            height="104px"
            infoWidth="200px"
            cover-width="156px"
            cover-height="88px"
          >
            <p slot="info" class="text-muted text-left">共{{ product.subCourseCount }}{{ $t("myOrder.course") }}</p>
          </video-list-card>
        </router-link>
      </template>
    </template>
    <template v-else>
      <huidou-icon class="huidou-layer" :price="'X  ' + product.foreignExchangeBean"></huidou-icon>
    </template>
  </div>
</template>
<script>
import {orderType} from "@/utils/types";
import articleListCard from "@/components/articleCard/list";
import videoListCard from "@/components/videoListCard";
import huidouIcon from "@/components/huidou/icon";

export default {
  name: "productInfo",
  components: {
    articleListCard,
    videoListCard,
    huidouIcon
  },
  props: {
    data: {
      type: Object,
      default() {
        return orderType;
      }
    },
    productType: {
      type: Number,
      default() {
        return 1;
      }
    },
    productId: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  computed: {
    product() {
      let item = Object.assign(this.data);
      item.title = this.data.productName;
      return item;
    }
  }
};
</script>

<style scoped>
.product-info-layer {
  position: relative;
  z-index: 0;
}
</style>
