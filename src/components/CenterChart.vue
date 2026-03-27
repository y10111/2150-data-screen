<template>
  <div class="center-chart">
    <div class="chart-header">
      <h3 class="chart-title">产量趋势分析</h3>
      <div class="chart-info">
        <span class="info-item">累计欠产: {{ totalUnderproduction }}吨</span>
        <span class="info-item">最高产量: {{ maxProduction }}吨</span>
        <span class="info-item">最低产量: {{ minProduction }}吨</span>
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
  computed: {
    totalUnderproduction() {
      if (!this.productionData || this.productionData.length === 0) return 0;
      return this.productionData
        .reduce((total, item) => {
          return total + (item.today_actual - item.today_plan);
        }, 0)
        .toFixed(0);
    },
    maxProduction() {
      if (!this.productionData || this.productionData.length === 0) return 0;
      return Math.max(...this.productionData.map((item) => item.today_actual));
    },
    minProduction() {
      if (!this.productionData || this.productionData.length === 0) return 0;
      return Math.min(...this.productionData.map((item) => item.today_actual));
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
  watch: {
    productionData: {
      handler() {
        this.initProductionChart();
      },
      deep: true,
    },
  },
  methods: {
    initProductionChart() {
      if (!this.$refs.productionChart) return;

      this.productionChart = echarts.init(this.$refs.productionChart, null, {
        theme: darkTheme,
      });

      // 处理生产数据
      const dates = this.productionData.map((item) => {
        const date = new Date(item.date);
        return `3月${date.getDate()}日`;
      });

      const planProduction = this.productionData.map((item) => item.today_plan);
      const actualProduction = this.productionData.map(
        (item) => item.today_actual
      );

      const minY = Math.min(...actualProduction, ...planProduction) - 500;
      const maxY = Math.max(...actualProduction, ...planProduction) + 500;

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
            data: dates,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "产量(吨)",
            min: minY,
            max: maxY,
            interval: 200,
          },
        ],
        series: [
          {
            name: "计划产量",
            type: "line",
            data: planProduction,
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
            data: actualProduction,
            itemStyle: {
              color: function (params) {
                return params.value < planProduction[params.dataIndex]
                  ? "#f44336"
                  : "#4caf50";
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
