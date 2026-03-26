<template>
  <div class="right-panel">
    <div class="panel-section">
      <h3 class="section-title">能耗与热装分析</h3>
      <div class="chart-container" ref="energyChart"></div>
    </div>
    <div class="panel-section">
      <h3 class="section-title">库存与缴库分析</h3>
      <div class="chart-container" ref="inventoryChart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { darkTheme } from "../utils/echarts";

export default {
  name: "RightPanel",
  props: {
    energyData: {
      type: Array,
      default: () => [],
    },
    inventoryData: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initEnergyChart();
    this.initInventoryChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.energyChart) {
      this.energyChart.dispose();
    }
    if (this.inventoryChart) {
      this.inventoryChart.dispose();
    }
  },
  methods: {
    initEnergyChart() {
      this.energyChart = echarts.init(this.$refs.energyChart, null, {
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
          data: ["热装率", "煤气单耗"],
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
            name: "热装率(%)",
            min: 45,
            max: 55,
            interval: 2,
          },
          {
            type: "value",
            name: "煤气单耗(GJ/t)",
            min: 1.15,
            max: 1.3,
            interval: 0.05,
          },
        ],
        series: [
          {
            name: "热装率",
            type: "line",
            data: [50.2, 51.5, 52.1, 53.0, 49.8, 51.8, 53.5],
          },
          {
            name: "煤气单耗",
            type: "line",
            yAxisIndex: 1,
            data: [1.25, 1.22, 1.23, 1.2, 1.26, 1.23, 1.19],
          },
        ],
      };
      this.energyChart.setOption(option);
    },
    initInventoryChart() {
      this.inventoryChart = echarts.init(this.$refs.inventoryChart, null, {
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
          data: ["钢坯库存", "缴库量"],
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
            name: "钢坯库存(万吨)",
            min: 0.2,
            max: 0.3,
            interval: 0.02,
          },
          {
            type: "value",
            name: "缴库量(吨)",
            min: 13000,
            max: 14500,
            interval: 500,
          },
        ],
        series: [
          {
            name: "钢坯库存",
            type: "line",
            data: [0.28, 0.27, 0.26, 0.25, 0.28, 0.26, 0.24],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(45, 140, 255, 0.3)" },
                { offset: 1, color: "rgba(45, 140, 255, 0.1)" },
              ]),
            },
          },
          {
            name: "缴库量",
            type: "bar",
            yAxisIndex: 1,
            data: [13500, 14000, 13800, 14100, 13600, 13900, 14200],
          },
        ],
      };
      this.inventoryChart.setOption(option);
    },
    handleResize() {
      if (this.energyChart) {
        this.energyChart.resize();
      }
      if (this.inventoryChart) {
        this.inventoryChart.resize();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.right-panel {
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
