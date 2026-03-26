<template>
  <div class="header">
    <div class="header-left">
      <h1>热轧2150线数据化大屏运营决策平台</h1>
    </div>
    <div class="header-right">
      <div class="time-info">
        <span>{{ currentTime }}</span>
      </div>
      <div class="shift-info">
        <span>{{ shiftInfo }}</span>
      </div>
      <div class="update-info">
        <span>数据更新时间: {{ updateTime }}</span>
      </div>
      <el-button type="primary" size="small" @click="toggleFullscreen">
        全屏
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      currentTime: "",
      shiftInfo: "白班",
      updateTime: "",
    };
  },
  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString();
      this.updateTime = now.toLocaleTimeString();

      const hour = now.getHours();
      this.shiftInfo = hour >= 8 && hour < 20 ? "白班" : "夜班";
    },
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #151e2c;
  color: #e6e9f0;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  .header-left h1 {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .time-info,
    .shift-info,
    .update-info {
      font-size: 14px;
    }

    .shift-info {
      padding: 2px 8px;
      background-color: #2d8cff;
      border-radius: 4px;
    }
  }
}
</style>
