<template>
  <div class="footer">
    <div class="footer-info">
      <span>数据来源：热轧带钢厂调度会材料</span>
      <span class="separator">|</span>
      <span>数据说明：模拟数据（Mock.js），正式环境可对接真实接口</span>
      <span class="separator">|</span>
      <span>技术支持：热轧带钢厂自动化二级</span>
      <span class="separator">|</span>
      <span>版本：v1.0.0-beta</span>
    </div>
    <el-button
      type="text"
      size="small"
      @click="toggleFullscreen"
      class="fullscreen-btn"
    >
      <img
        v-if="!isFullscreen"
        src="/全屏.svg"
        alt="全屏"
        class="fullscreen-icon"
      />
      <img v-else src="/还原画布.svg" alt="非全屏" class="fullscreen-icon" />
    </el-button>
  </div>
</template>

<script>
export default {
  name: "AppFooter",
  data() {
    return {
      isFullscreen: false,
      /** 避免连续触发全屏 API 导致「Pending operation cancelled…」未处理的 Promise 拒绝 */
      _fullscreenBusy: false,
    };
  },
  mounted() {
    // 监听全屏变化事件
    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];
    events.forEach((event) => {
      document.addEventListener(event, this.handleFullscreenChange);
    });
  },
  beforeDestroy() {
    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];
    events.forEach((event) => {
      document.removeEventListener(event, this.handleFullscreenChange);
    });
  },
  methods: {
    handleFullscreenChange() {
      this.isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      this._fullscreenBusy = false;
    },
    getFullscreenElement() {
      const doc = document;
      return (
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
    },
    toggleFullscreen() {
      if (this._fullscreenBusy) return;
      const doc = document;
      const fsEl = this.getFullscreenElement();
      let p = null;

      if (!fsEl) {
        const el = doc.documentElement;
        if (el.requestFullscreen) p = el.requestFullscreen();
        else if (el.webkitRequestFullscreen) p = el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) p = el.mozRequestFullScreen();
        else if (el.msRequestFullscreen) p = el.msRequestFullscreen();
      } else {
        if (doc.exitFullscreen) p = doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) p = doc.webkitExitFullscreen();
        else if (doc.mozCancelFullScreen) p = doc.mozCancelFullScreen();
        else if (doc.msExitFullscreen) p = doc.msExitFullscreen();
      }

      if (p && typeof p.then === "function") {
        this._fullscreenBusy = true;
        p.catch(() => {}).finally(() => {
          this._fullscreenBusy = false;
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  height: 60px;
  background-color: #151e2c;
  color: #8c9ab3;
  padding: 10px 30px;
  font-size: 12px;
  flex-shrink: 0; // 防止被压缩
  z-index: 99999;
  position: relative;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;

  .footer-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .separator {
    color: #8c9ab3;
  }

  .fullscreen-btn {
    color: #8c9ab3;
    padding: 4px;
    margin-left: 20px;
    z-index: 999999;
    position: relative;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      color: #2d8cff;
    }
    .fullscreen-icon {
      width: 16px;
      height: 16px;
      display: block;
    }
  }
}
</style>
