<template>
  <div class="header">
    <div class="header-left">
      <img src="/ansteel.svg" alt="鞍钢logo" class="logo" />
    </div>
    <div class="header-center">
      <h1>{{ headerTitle }}</h1>
    </div>
    <div class="header-right">
      <div class="info-section">
        <div class="info-line time-line">{{ fullTimeInfo }}</div>
        <div class="info-line weather-line">
          {{ weatherCity }} <span class="weather-emoji">{{ weatherEmoji }}</span> {{ weatherText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DEFAULT_ANSHAN_COORDS,
  fetchOpenMeteoCurrent,
} from "../utils/weatherService";

const WEATHER_REFRESH_MS = 10 * 60 * 1000;

function parseEnvCoord(val, fallback) {
  if (val === undefined || val === "") return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export default {
  name: "AppHeader",
  data() {
    return {
      fullTimeInfo: "",
      timer: null,
      weatherTimer: null,
      weatherEmoji: "⏳",
      headerTitle:
        process.env.VUE_APP_HEADER_TITLE ||
        "鞍钢股份有限公司热轧带钢厂2150线数据化大屏运营决策平台",
      weatherCity: process.env.VUE_APP_WEATHER_CITY || "鞍山",
      weatherText: "天气加载中…",
      weatherFallbackText:
        process.env.VUE_APP_WEATHER_TEXT || "晴 15°C",
    };
  },
  mounted() {
    this.updateDateTime();
    this.timer = setInterval(this.updateDateTime, 1000);
    this.refreshWeather();
    this.weatherTimer = setInterval(
      this.refreshWeather,
      WEATHER_REFRESH_MS
    );
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.weatherTimer) {
      clearInterval(this.weatherTimer);
      this.weatherTimer = null;
    }
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
    weatherCoords() {
      return {
        latitude: parseEnvCoord(
          process.env.VUE_APP_WEATHER_LAT,
          DEFAULT_ANSHAN_COORDS.latitude
        ),
        longitude: parseEnvCoord(
          process.env.VUE_APP_WEATHER_LON,
          DEFAULT_ANSHAN_COORDS.longitude
        ),
      };
    },
    async refreshWeather() {
      try {
        const data = await fetchOpenMeteoCurrent(this.weatherCoords());
        this.weatherEmoji = data.emoji;
        this.weatherText = data.line;
      } catch {
        this.weatherEmoji = "☁️";
        this.weatherText = this.weatherFallbackText;
      }
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
      gap: 8px;
      text-align: right;

      .info-line {
        text-align: right;
        line-height: 1.35;
        white-space: nowrap;
      }

      .time-line {
        font-size: 16px;
        font-weight: bold;
        color: #e6e9f0;
      }

      .weather-line {
        font-size: 14px;
        font-weight: 500;
        color: #e6e9f0;
      }

      .weather-emoji {
        font-size: 16px;
        line-height: 1;
        vertical-align: -0.05em;
      }
    }
  }
}
</style>
