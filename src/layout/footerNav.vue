<template>
  <footer class="footer-layer">
    <div class="container">
      <el-row class="wrapper company-introduce">
        <el-col :span="12">
          <p>
            {{ $t("layout.intro") }}&nbsp;&nbsp;|&nbsp;
            <a
              target="_blank"
              href="http://www.beian.miit.gov.cn/state/outPortal/loginPortal.action;jsessionid=1wNV9B5oaNznr_oh1BZEvu7I1DJrDfoBpqQNIH0rCSrhQLVHwPcr!1834962369"
            >
              粤ICP备13078153号
            </a>
          </p>
          <p>Copyright © 2019 HUIKETANG.COM All Rights Reserved Wanshi company</p>
        </el-col>
        <el-col :span="12" class="text-muted text-right download-layer">
          <a class="text-center">
            <icon-svg icon-class="icon-ios" class="vertical-align-middle"></icon-svg>
            <span class="vertical-align-middle">apple store</span>
          </a>
          <a class="text-center">
            <icon-svg icon-class="icon-android" class="vertical-align-middle"></icon-svg>
            <span class="vertical-align-middle">Android</span>
          </a>
        </el-col>
      </el-row>
    </div>
  </footer>
</template>

<script>
export default {
  name: "footerNav",
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style lang="less">
.footer-layer {
  position: absolute;
  background-color: #1a1b1c;
  bottom: 0;
  left: 0;
  height: 44px;
  padding: 38px 0;
  width: 100%;

  .wrapper {
    &.company-introduce {
      p {
        color: rgba(255, 255, 255, 0.36);

        a {
          color: rgba(255, 255, 255, 0.36);

          &:hover {
            color: #fff;
          }
        }

        &:last-child {
          color: rgba(255, 255, 255, 0.24);
        }
      }
    }

    .download-layer {
      a {
        display: inline-block;
        width: 120px;
        height: 36px;
        line-height: 36px;
        border-radius: 18px;
        margin: 0 25px 0 0;
        padding: 0 5px;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.12);

        svg {
          margin: 0 3px 0 0;
        }
      }
    }
  }
}
</style>
