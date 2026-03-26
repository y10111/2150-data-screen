<template>
  <div class="center-chart">
    <div class="chart-header">
      <h3 class="chart-title">产量趋势分析</h3>
      <div class="chart-info">
        <span class="info-item">累计欠产: -18067吨</span>
        <span class="info-item">最高产量: 14300吨</span>
        <span class="info-item">最低产量: 13700吨</span>
      </div>
    </div>
    <div class="chart-container" ref="productionChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { darkTheme } from "../utils/echarts";

export default {
  name: "CenterChart",
  props: {
    productionData: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initProductionChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.productionChart) {
      this.productionChart.dispose();
    }
  },
  methods: {
    initProductionChart() {
      this.productionChart = echarts.init(this.$refs.productionChart, null, {
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
          data: ["计划产量", "实轧产量"],
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
              "3月8日",
              "3月9日",
              "3月10日",
              "3月11日",
              "3月12日",
              "3月13日",
              "3月14日",
              "3月15日",
              "3月16日",
              "3月17日",
              "3月18日",
              "3月19日",
              "3月20日",
              "3月21日",
              "3月22日",
              "3月23日",
            ],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "产量(吨)",
            min: 13500,
            max: 14500,
            interval: 200,
          },
        ],
        series: [
          {
            name: "计划产量",
            type: "line",
            data: Array(23).fill(14000),
            lineStyle: {
              type: "dashed",
              color: "#ff9800",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(255, 152, 0, 0.3)" },
                { offset: 1, color: "rgba(255, 152, 0, 0.1)" },
              ]),
            },
          },
          {
            name: "实轧产量",
            type: "bar",
            data: [
              13800, 14100, 13900, 14200, 13700, 14000, 14300, 13950, 14150,
              13850, 14250, 14050, 13900, 14100, 13800, 14200, 14000, 14300,
              13950, 14150, 13850, 14250, 14050,
            ],
            itemStyle: {
              color: function (params) {
                return params.value < 14000 ? "#f44336" : "#4caf50";
              },
            },
          },
        ],
      };
      this.productionChart.setOption(option);
    },
    handleResize() {
      if (this.productionChart) {
        this.productionChart.resize();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.center-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .chart-title {
      font-size: 16px;
      font-weight: bold;
      color: #e6e9f0;
      margin: 0;
    }

    .chart-info {
      display: flex;
      gap: 16px;

      .info-item {
        font-size: 12px;
        color: #8c9ab3;
      }
    }
  }

  .chart-container {
    flex: 1;
    width: 100%;
  }
}
</style>
