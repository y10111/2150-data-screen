<template>
  <div class="panel-section">
    <h3 class="section-title">库存安全水位</h3>

    <div class="mini-card">
      <div class="mini-chart" ref="levelChart"></div>
      <div class="mini-caption">当前 vs 安全线（含日增减）</div>
    </div>

    <div class="chart-container" ref="inventoryChart"></div>
    <div class="chart-caption">近7日库存趋势（红虚线：安全线）</div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { darkTheme } from "../utils/echarts";
import { DASHBOARD_CONSTANTS } from "@/config/dashboardConstants";

export default {
  name: "InventoryDeliveryChart",
  props: {
    inventoryData: {
      type: Array,
      default: () => [],
    },
    energyData: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.levelChart) this.levelChart.dispose();
    if (this.trendChart) this.trendChart.dispose();
    this.levelChart = null;
    this.trendChart = null;
  },
  watch: {
    inventoryData: {
      handler() {
        this.initChart();
      },
      deep: true,
    },
    energyData: {
      handler() {
        this.initChart();
      },
      deep: true,
    },
  },
  methods: {
    formatDateLabel(dateText) {
      const date = new Date(dateText);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },
    getOrCreateTrendChart() {
      if (this.trendChart) return this.trendChart;
      this.trendChart = echarts.init(this.$refs.inventoryChart, null, {
        theme: darkTheme,
      });
      return this.trendChart;
    },
    getOrCreateLevelChart() {
      if (this.levelChart) return this.levelChart;
      this.levelChart = echarts.init(this.$refs.levelChart, null, {
        theme: darkTheme,
      });
      return this.levelChart;
    },
    initChart() {
      if (!this.$refs.inventoryChart || !this.$refs.levelChart) return;
      const trend = this.getOrCreateTrendChart();
      const level = this.getOrCreateLevelChart();

      this.updateLevelOption(level);

      const inventorySource = this.inventoryData.slice(-7);
      const dates = inventorySource.map((item) => this.formatDateLabel(item.date));
      const inventory = inventorySource.map((item) => item.inventory || 0);

      const option = {
        tooltip: { trigger: "axis" },
        legend: { show: false },
        grid: { top: 12, left: 10, right: 10, bottom: 18, containLabel: false },
        xAxis: [{ type: "category", data: dates, axisTick: { show: false } }],
        yAxis: [
          {
            type: "value",
            name: "",
            min: Math.min(...inventory, this.safetyLine) - 0.2,
            max: Math.max(...inventory, this.safetyLine) + 0.2,
            axisLabel: { show: false },
            splitNumber: 2,
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } },
          },
        ],
        series: [
          {
            name: "钢坯库存",
            type: "line",
            data: inventory,
            smooth: true,
            symbol: "none",
            lineStyle: { color: "#2d8cff", width: 2 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(45, 140, 255, 0.3)" },
                { offset: 1, color: "rgba(45, 140, 255, 0.1)" },
              ]),
            },
            markLine: {
              symbol: "none",
              label: { show: false },
              lineStyle: { color: "rgba(244,67,54,0.7)", type: "dashed" },
              data: [{ yAxis: this.safetyLine }],
            },
          },
        ],
      };
      trend.setOption(option, true);
    },
    updateLevelOption(chart) {
      const v = this.latestInventory;
      const delta = this.trendDelta;
      const max = Math.max(this.safetyLine * 2, v * 1.2, 0.5);
      const good = v > this.safetyLine;
      const color = good ? "#4caf50" : "#f44336";
      const deltaColor = delta >= 0 ? "#4caf50" : "#f44336";
      const arrow = delta >= 0 ? "↑" : "↓";

      const option = {
        grid: { top: 8, left: 10, right: 10, bottom: 6, containLabel: false },
        xAxis: {
          type: "value",
          min: 0,
          max,
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: { show: false },
        },
        yAxis: {
          type: "category",
          data: ["库存"],
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
        },
        series: [
          {
            type: "bar",
            data: [max],
            barWidth: 12,
            silent: true,
            itemStyle: { color: "rgba(255,255,255,0.06)", borderRadius: 6 },
            z: 1,
          },
          {
            type: "bar",
            data: [v],
            barWidth: 12,
            itemStyle: { color, borderRadius: 6 },
            z: 2,
            label: {
              show: true,
              position: "right",
              distance: 6,
              formatter: () =>
                `{v|${v.toFixed(2)} 万吨}  {d|${arrow} ${Math.abs(delta).toFixed(
                  2
                )}}`,
              rich: {
                v: { color: "#e6e9f0", fontSize: 12, fontWeight: 800 },
                d: { color: deltaColor, fontSize: 12, fontWeight: 800 },
              },
            },
          },
          {
            type: "line",
            data: [this.safetyLine],
            symbol: "none",
            z: 3,
            lineStyle: { opacity: 0 },
            markLine: {
              symbol: "none",
              label: {
                show: true,
                formatter: `安全线 ${this.safetyLine.toFixed(2)}`,
                color: "rgba(244,67,54,0.9)",
                fontSize: 11,
                fontWeight: 700,
              },
              lineStyle: { color: "rgba(244,67,54,0.8)", type: "dashed" },
              data: [{ xAxis: this.safetyLine }],
            },
          },
        ],
      };

      chart.setOption(option, true);
    },
    handleResize() {
      if (this.levelChart) this.levelChart.resize();
      if (this.trendChart) this.trendChart.resize();
    },
  },
  computed: {
    safetyLine() {
      return DASHBOARD_CONSTANTS.inventorySafetyLine;
    },
    latestInventory() {
      if (!this.inventoryData || this.inventoryData.length === 0) return 0;
      return Number(this.inventoryData[this.inventoryData.length - 1].inventory) || 0;
    },
    trendDelta() {
      if (!this.inventoryData || this.inventoryData.length < 2) return 0;
      const a = Number(this.inventoryData[this.inventoryData.length - 2].inventory) || 0;
      const b = Number(this.inventoryData[this.inventoryData.length - 1].inventory) || 0;
      return b - a;
    },
  },
};
</script>

<style lang="less" scoped>
.panel-section {
  flex: 1;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .section-title {
    font-size: 14px;
    font-weight: bold;
    color: #e6e9f0;
    margin-bottom: 0;
  }

  .mini-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(42, 58, 74, 0.8);
    border-radius: 8px;
    padding: 8px 8px 4px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 78px;
  }

  .mini-chart {
    width: 100%;
    height: 52px;
  }

  .mini-caption {
    font-size: 11px;
    color: #8c9ab3;
    text-align: center;
  }

  .chart-container {
    width: 100%;
    flex: 1;
    min-height: 0;
  }

  .chart-caption {
    width: 100%;
    text-align: center;
    font-size: 11px;
    color: #8c9ab3;
    line-height: 14px;
    margin-top: -4px;
  }
}
</style>
