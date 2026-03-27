<template>
  <div class="left-panel">
    <div class="panel-section">
      <h3 class="section-title">设备与事故分析</h3>
      <div class="chart-container" ref="deviceChart"></div>
    </div>
    <div class="panel-section">
      <h3 class="section-title">质量与成材分析</h3>
      <div class="chart-container" ref="qualityChart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { darkTheme } from "../utils/echarts";

export default {
  name: "LeftPanel",
  props: {
    deviceData: {
      type: Array,
      default: () => [],
    },
    qualityData: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initDeviceChart();
    this.initQualityChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.deviceChart) {
      this.deviceChart.dispose();
    }
    if (this.qualityChart) {
      this.qualityChart.dispose();
    }
  },
  watch: {
    deviceData: {
      handler() {
        this.initDeviceChart();
      },
      deep: true,
    },
    qualityData: {
      handler() {
        this.initQualityChart();
      },
      deep: true,
    },
  },
  methods: {
    initDeviceChart() {
      if (!this.$refs.deviceChart) return;

      this.deviceChart = echarts.init(this.$refs.deviceChart, null, {
        theme: darkTheme,
      });

      // 处理设备数据
      const dates = this.qualityData.slice(-7).map((item) => {
        const date = new Date(item.date);
        return `3月${date.getDate()}日`;
      });

      const deviceDowntime = this.qualityData
        .slice(-7)
        .map((item) => item.device_downtime || 0);

      // 模拟电气、机械、其他数据
      const electricData = deviceDowntime.map((item) => item * 0.3);
      const mechanicalData = deviceDowntime.map((item) => item * 0.5);
      const otherData = deviceDowntime.map((item) => item * 0.2);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["设备事故时间", "电气", "机械", "其他"],
        },
        xAxis: [
          {
            type: "category",
            data: dates,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "小时",
            min: 0,
            max: Math.max(...deviceDowntime, 3),
            interval: 0.5,
          },
        ],
        series: [
          {
            name: "设备事故时间",
            type: "line",
            data: deviceDowntime,
          },
          {
            name: "电气",
            type: "bar",
            stack: "total",
            data: electricData,
          },
          {
            name: "机械",
            type: "bar",
            stack: "total",
            data: mechanicalData,
          },
          {
            name: "其他",
            type: "bar",
            stack: "total",
            data: otherData,
          },
        ],
      };
      this.deviceChart.setOption(option);
    },
    initQualityChart() {
      if (!this.$refs.qualityChart) return;

      this.qualityChart = echarts.init(this.$refs.qualityChart, null, {
        theme: darkTheme,
      });

      // 处理质量数据
      const dates = this.qualityData.slice(-7).map((item) => {
        const date = new Date(item.date);
        return `3月${date.getDate()}日`;
      });

      const qualityLock = this.qualityData
        .slice(-7)
        .map((item) => item.quality_lock || 0);
      const yieldRate = this.qualityData
        .slice(-7)
        .map((item) => item.yield_rate || 98);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["质量封锁", "成材率"],
        },
        xAxis: [
          {
            type: "category",
            data: dates,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "卷数",
            min: 0,
            max: Math.max(...qualityLock, 80),
            interval: 20,
          },
          {
            type: "value",
            name: "成材率(%)",
            min: Math.min(...yieldRate, 98),
            max: Math.max(...yieldRate, 99),
            interval: 0.2,
          },
        ],
        series: [
          {
            name: "质量封锁",
            type: "bar",
            data: qualityLock,
          },
          {
            name: "成材率",
            type: "line",
            yAxisIndex: 1,
            data: yieldRate,
          },
        ],
      };
      this.qualityChart.setOption(option);
    },
    handleResize() {
      if (this.deviceChart) {
        this.deviceChart.resize();
      }
      if (this.qualityChart) {
        this.qualityChart.resize();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.left-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;

  .panel-section {
    flex: 1;
    background-color: rgba(21, 30, 44, 0.6);
    border-radius: 8px;
    padding: 16px;

    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #e6e9f0;
      margin-bottom: 16px;
    }

    .chart-container {
      width: 100%;
      height: calc(100% - 40px);
    }
  }
}
</style>
