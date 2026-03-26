<template>
  <div class="header">
    <div class="header-left">
      <img src="/ansteel.svg" alt="鞍钢logo" class="logo" />
    </div>
    <div class="header-center">
      <h1>鞍钢股份有限公司热轧带钢厂2150线数据化大屏运营决策平台</h1>
    </div>
    <div class="header-right">
      <div class="info-section">
        <div class="time-info">{{ fullTimeInfo }}</div>
        <div class="weather-info">
          <span>鞍山</span>
          <span class="weather-icon">☀️</span>
          <span>晴 15°C</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      fullTimeInfo: "",
    };
  },
  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const weekDay = weekDays[now.getDay()];
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      this.fullTimeInfo = `${year}年${month}月${day}日 ${weekDay} ${hours}:${minutes}:${seconds}`;
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  height: 80px;
  background-color: #151e2c;
  color: #e6e9f0;
  padding: 0 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  .header-left {
    flex: 1;
    display: flex;
    align-items: center;

    .logo {
      height: 60px;
      width: auto;
    }
  }

  .header-center {
    flex: 1;
    text-align: center;

    h1 {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
      color: #fff;
      animation: breathe 3s ease-in-out infinite;
    }
  }

  @keyframes breathe {
    0%,
    100% {
      opacity: 1;
      text-shadow: 0 0 10px rgba(45, 140, 255, 0.5);
    }
    50% {
      opacity: 0.8;
      text-shadow: 0 0 20px rgba(45, 140, 255, 0.8);
    }
  }

  .header-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .info-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;

      .time-info {
        font-size: 16px;
        font-weight: bold;
        color: #e6e9f0;
      }

      .weather-info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;

        .weather-icon {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
