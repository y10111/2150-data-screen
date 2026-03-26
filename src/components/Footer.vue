<template>
  <div class="footer">
    <div class="footer-info">
      <span>数据来源：热轧带钢厂调度会材料</span>
      <span class="separator">|</span>
      <span>数据说明：模拟数据（Mock.js），正式环境可对接真实接口</span>
      <span class="separator">|</span>
      <span>技术支持：自动化二级系统</span>
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
    },
    toggleFullscreen() {
      if (!this.isFullscreen) {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
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
