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
  methods: {
    initDeviceChart() {
      this.deviceChart = echarts.init(this.$refs.deviceChart, null, {
        theme: darkTheme,
      });
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
            data: [
              "3月1日",
              "3月2日",
              "3月3日",
              "3月4日",
              "3月5日",
              "3月6日",
              "3月7日",
            ],
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
            max: 3,
            interval: 0.5,
          },
        ],
        series: [
          {
            name: "设备事故时间",
            type: "line",
            data: [1.5, 1.2, 1.8, 0.9, 2.2, 1.4, 0.8],
          },
          {
            name: "电气",
            type: "bar",
            stack: "total",
            data: [0.5, 0.3, 0.6, 0.3, 0.8, 0.5, 0.3],
          },
          {
            name: "机械",
            type: "bar",
            stack: "total",
            data: [0.7, 0.6, 0.8, 0.4, 1.0, 0.6, 0.3],
          },
          {
            name: "其他",
            type: "bar",
            stack: "total",
            data: [0.3, 0.3, 0.4, 0.2, 0.4, 0.3, 0.2],
          },
        ],
      };
      this.deviceChart.setOption(option);
    },
    initQualityChart() {
      this.qualityChart = echarts.init(this.$refs.qualityChart, null, {
        theme: darkTheme,
      });
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
            data: [
              "3月1日",
              "3月2日",
              "3月3日",
              "3月4日",
              "3月5日",
              "3月6日",
              "3月7日",
            ],
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
            max: 80,
            interval: 20,
          },
          {
            type: "value",
            name: "成材率(%)",
            min: 98,
            max: 99,
            interval: 0.2,
          },
        ],
        series: [
          {
            name: "质量封锁",
            type: "bar",
            data: [65, 70, 68, 60, 75, 65, 58],
          },
          {
            name: "成材率",
            type: "line",
            yAxisIndex: 1,
            data: [98.5, 98.7, 98.6, 98.8, 98.4, 98.6, 98.9],
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
