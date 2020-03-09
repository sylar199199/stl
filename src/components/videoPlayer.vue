<template>
  <div
    ref="playerComponent"
    allowfullscreen="true"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    class="video-component"
    :class="{'play-end': isPlayEnd}"
    @keyup.stop.prevent="onVideoOperationHandle($event)"
  >
    <video class="video-js" ref="videoDOM"></video>
    <!--播放完成 -->
    <div class="play-end-layer" v-show="isPlayEnd">
      <el-row class="menu-layer">
        <el-col :span="12">
          <div class="reload-icon vertical-align-middle inline-block text-center">
            <i @click="onClickReloadHandle" class="el-icon-refresh-left pointer"></i>
          </div>
          <span class="vertical-align-middle">重播</span>
        </el-col>
        <el-col :span="12">
          <slot name="right-menu"></slot>
        </el-col>
      </el-row>
      <slot name="content"></slot>
    </div>
    <div v-if="!isCanPlay" class="mark-layer pointer" @click="onClickPlayerComponentHandle($event)"></div>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import videojs from "video.js";
window.videojs = videojs;
import {checkFullScreen} from "@/utils/mUtils";

let playerPlugins = null;
export default {
  name: "DefineVideo",
  props: {
    isCanPlay: {
      type: Boolean,
      default: false
    },
    isPlayEnd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    loadHLS() {
      return new Promise((resolve, reject) => {
        if (!window.emeKey) {
          let configScript = document.createElement("script");
          configScript.type = "text/javascript";
          configScript.src = "/js/bl-video.js";
          document.getElementsByTagName("head")[0].appendChild(configScript);
          configScript.onload = function() {
            if (window.videojs) {
              resolve();
            } else {
              reject("加载视频组件失败");
            }
          };
        } else {
          resolve();
        }
      });
    },
    init(options) {
      //配置播放器
      let playerOptions = Object.assign(
        {
          width: 950,
          height: 540,
          controls: true,
          autoplay: false,
          preload: "auto",
          loop: false,
          muted: false,
          language: "CN",
          playbackRates: [0.7, 1.0, 1.2, 1.5, 2.0],
          notSupportedMessage: this.$t("video.videoUnavailable"), //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          fullscreenDom: this.$refs["playerComponent"],
          controlBar: {
            volumePanel: {
              inline: false
            },
            fullscreenToggle: false, //全屏
            pictureInPictureToggle: false, //隐藏画中画
            currentTimeDisplay: true, //当前播放时间
            timeDivider: true, //时间中间的分割线
            durationDisplay: true, //视频全部时间
            remainingTimeDisplay: false, //视频剩余时间
            playbackRateMenuButton: false //播放速率
          }
        },
        options
      );
      let self = this;
      videojs.addLanguage("CN", {"Play Video": this.$t("video.playVideo")});
      playerPlugins = videojs(this.$refs["videoDOM"], playerOptions, function onPlayerReady() {
        let ctrlBar = document.createElement("div");
        ctrlBar.className = "vjs-mycontrol-bar";
        //监听错误
        this.on("error", function() {
          playerPlugins.errorDisplay.el_.innerHTML = `
            <div class="error-layer text-center">
              <h2 class="title">网络异常，请重新加载</h2>
              <p><a id="videoReloadBtn" class="btn btn-primary-hollow">重新加载</a></p>
            </div>
          `; //将错误信息定义显示方式
          document.getElementById("videoReloadBtn").addEventListener(
            "click",
            () => {
              self.$emit("error"); //分发错误事件
            },
            false
          );
        });
        //监听播放完成
        this.on("ended", function(e) {
          self.$emit("ended");
        });
        //监听播放
        this.on("play", function(e) {
          self.$emit("play");
        });
        //监听播放
        this.on("pause", function(e) {
          self.$emit("pause");
        });
      });
      //this.createNextButton();//下一章节按钮
      this.createFullscreenButton(); //全屏按钮
      return playerPlugins;
    },
    player(playerOptions) {
      return new Promise((resolve, reject) => {
        if (playerOptions.free || playerOptions.bought) {
          this.loadHLS()
            .then(res => {
              //播放加密视频
              playerPlugins.src({
                src: "huiketang",
                type: "application/x-mpegURL",
                videoInfo: playerOptions.encryptedUrl
              });
              resolve();
            })
            .catch(msg => {
              this.$dialog.alert(msg, function() {
                this.$router.go(-1);
              });
              reject("加载视频组件失败");
            });
        } else {
          //播放加密视频
          playerPlugins.src({
            src: playerOptions.episodeUrl,
            type: "video/mp4"
          });
          resolve();
        }
      });
    },
    onVideoOperationHandle(e) {
      //键盘操作
      let vol = playerPlugins.volume(); //1代表100%音量，每次增减0.1
      let currentTime = playerPlugins.currentTime(); //当前时间
      let time = 10; //单位秒，每次增减10秒
      if (playerPlugins) {
        //鼠标上下键控制视频音量
        if (e && e.keyCode === 38) {
          // 按 向上键
          if (vol !== 1) {
            playerPlugins.volume(vol + 0.1);
          }
        } else if (e && e.keyCode === 40) {
          // 按 向下键
          if (vol !== 0) {
            playerPlugins.volume(vol - 0.1);
          }
        } else if (e && e.keyCode === 37) {
          // 按 向左键
          if (currentTime !== 0) {
            playerPlugins.currentTime(currentTime - 10);
          }
        } else if (e && e.keyCode === 39) {
          // 按 向右键
          if (currentTime !== 0) {
            playerPlugins.currentTime(currentTime + 10);
          }
        } else if (e && e.keyCode === 32) {
          // 按空格键 判断当前是否暂停
          playerPlugins.paused() ? playerPlugins.play() : playerPlugins.pause();
        }
        e.returnValue = false;
      }
    },
    //改变播放内容
    getPlayerPlugins() {
      return playerPlugins;
    },
    onClickReloadHandle() {
      playerPlugins.play();
    },
    //创建全屏按钮
    createFullscreenButton() {
      console.log(document.webkitFullscreenEnabled);
      let fullscreenBtn = playerPlugins.controlBar.addChild("button");
      fullscreenBtn.addClass("vjs-fullscreen-control");
      fullscreenBtn.on("click", () => {
        let playerDOM = playerPlugins.el_;
        // 做一下浏览器适配
        if (checkFullScreen()) {
          playerPlugins.removeClass("vjs-fullscreen");
          document.exitFullScreen =
            document.exitFullScreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            document.webkitExitFullscreen;
          document.exitFullScreen();
        } else {
          playerPlugins.addClass("vjs-fullscreen");
          if (playerDOM.requestFullscreen) {
            return playerDOM.requestFullscreen();
          } else if (playerDOM.webkitRequestFullScreen) {
            return playerDOM.webkitRequestFullScreen();
          } else if (playerDOM.mozRequestFullScreen) {
            return playerDOM.mozRequestFullScreen();
          } else {
            return playerDOM.msRequestFullscreen();
          }
        }
      });
      window.onresize = function() {
        if (!checkFullScreen()) {
          playerPlugins.removeClass("vjs-fullscreen");
        }
      };
    },
    //创建播放下一节按钮
    createNextButton() {
      let nextBtn = playerPlugins.controlBar.addChild("button");
      nextBtn.addClass("vjs-icon-next-item");
      nextBtn.on("click", function() {});
    },
    onClickPlayerComponentHandle(event) {
      //点击播放器
      this.$emit("click-player", event);
    }
  },
  //离开页面后销毁播放器，定时器
  beforeDestroy() {
    if (playerPlugins) {
      playerPlugins.dispose();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/style/variables.less";

.video-component {
  position: relative;
  width: 100%;
  height: 540px; //解决全屏缩放
  overflow: hidden;

  &.play-end {
    ::v-deep .vjs-text-track-display {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0));
    }
  }

  .play-end-layer {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 600px;
    margin: -220px 0 0 -300px;

    .menu-layer {
      color: #fff;
      margin: 0 0 20px;

      .reload-icon {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: @global-default3;
        border-radius: 50%;
        margin: 0 10px 0 0;

        i {
          font-size: 28px;
        }
      }
    }
  }

  &.full {
    .play-end-layer {
      width: 900px;
      margin-left: -450px;

      .menu-layer {
        padding-right: 20px;
      }
    }
  }

  .mark-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}

::v-deep .video-js {
  border-radius: 8px;
  position: relative;

  &.vjs-fullscreen {
    .vjs-control-bar {
      .vjs-fullscreen-control {
        .vjs-icon-placeholder {
          &:before {
            content: "\F109";
          }
        }
      }
    }
  }

  .vjs-control-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 48px;
    background-color: rgba(0, 0, 0, 0.3);

    .vjs-fullscreen-control {
      .vjs-icon-placeholder {
        &:before {
          content: "\F108";
        }
      }
    }

    .vjs-progress-control {
      position: absolute;
      left: 0;
      bottom: 38px;
      width: 100%;
      height: 20px;
      .vjs-progress-holder {
        margin: 0;
      }

      .vjs-play-progress {
        height: 4px;
        opacity: 0.9;
        border-radius: 2px;
        background-color: @global-primary;
      }
    }

    .vjs-button {
      > .vjs-icon-placeholder:before {
        font-size: 28px;
      }
    }

    .vjs-current-time,
    .vjs-duration,
    .vjs-time-divider {
      display: block;
      padding: 0;
      line-height: 48px;
    }

    .vjs-current-time {
      opacity: 0.9;
    }

    .vjs-time-divider {
      min-width: 3px;
      padding: 0 3px;
    }

    .vjs-duration {
      opacity: 0.32;
    }

    .vjs-paused:hover {
      color: @global-primary;
    }

    .vjs-volume-panel {
      position: absolute;
      right: 56px;
      bottom: 0;

      &:hover {
        color: @global-primary;
      }

      .vjs-volume-level {
        background-color: @global-primary;
      }
    }

    .vjs-fullscreen-control {
      position: absolute;
      right: 15px;
      bottom: 0;
    }
  }

  .vjs-poster {
    border-radius: 8px;
  }

  .vjs-big-play-button {
    left: 50%;
    top: 50%;
    margin: -32px 0 0 -32px;
    width: 64px;
    height: 64px;
    border-radius: 50%;

    .vjs-icon-placeholder {
      position: relative;
      display: block;
      height: 64px;
      line-height: 64px;
      &:before {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .vjs-next-btn {
    width: 40px;
    height: 40px;

    &:before {
      font-size: 28px;
    }
  }

  .vjs-fullscreen-control {
    position: absolute;

    &:before {
      font-size: 28px;
    }
  }

  .vjs-error-display {
    &:before {
      display: none;
    }

    .error-layer {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -37px 0 0 -100px;

      .title {
        margin: 0 0 15px;
      }

      .btn {
        width: 168px;
        background-color: @global-default3;
      }
    }
  }
}
</style>
