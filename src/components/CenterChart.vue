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
    formatDateLabel(dateText) {
      const date = new Date(dateText);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },
    getOrCreateChart() {
      if (this.productionChart) {
        return this.productionChart;
      }
      this.productionChart = echarts.init(this.$refs.productionChart, null, {
        theme: darkTheme,
      });
      return this.productionChart;
    },
    initProductionChart() {
      if (!this.$refs.productionChart) return;

      const chart = this.getOrCreateChart();

      // 处理生产数据
      const dates = this.productionData.map((item) => {
        return this.formatDateLabel(item.date);
      });

      const planProduction = this.productionData.map((item) => item.today_plan);
      const actualProduction = this.productionData.map(
        (item) => item.today_actual
      );

      const minY = Math.min(...actualProduction, ...planProduction) - 500;
      const maxY = Math.max(...actualProduction, ...planProduction) + 500;
      const xLabelInterval = Math.max(1, Math.ceil(dates.length / 8));

      const option = {
        grid: {
          left: 55,
          right: 45,
          top: 60,
          bottom: 55,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 避免 cross 在 hover 时制造“大面积横向刷屏”
            type: "shadow",
            shadowStyle: { color: "rgba(0,0,0,0.12)" },
          },
        },
        legend: {
          data: ["计划产量", "实轧产量"],
          top: 10,
          left: "center",
          textStyle: { color: "#8c9ab3", fontSize: 12 },
          itemGap: 16,
        },
        xAxis: [
          {
            type: "category",
            data: dates,
            axisPointer: {
              type: "shadow",
            },
            axisTick: { show: false },
            axisLabel: {
              color: "#8c9ab3",
              interval: xLabelInterval,
              fontSize: 12,
              margin: 10,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "产量(吨)",
            min: minY,
            max: maxY,
            // 进一步减少刻度数量，避免 y 轴标签重叠
            splitNumber: 2,
            axisLabel: {
              show: true,
              color: "#8c9ab3",
              fontSize: 9,
              formatter: (v) => `${Math.round(v)}`,
              hideOverlap: true,
              margin: 0,
            },
            splitLine: {
              lineStyle: { color: "rgba(255,255,255,0.04)" },
            },
          },
        ],
        series: [
          {
            name: "计划产量",
            type: "line",
            data: planProduction,
            symbol: "none",
            smooth: true,
            lineStyle: {
              type: "dashed",
              color: "#ff9800",
              width: 2,
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
            barMaxWidth: 18,
            itemStyle: {
              color: function (params) {
                return params.value < planProduction[params.dataIndex]
                  ? "#f44336"
                  : "#4caf50";
              },
              borderRadius: [4, 4, 0, 0],
            },
          },
        ],
      };
      chart.setOption(option, true);
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
