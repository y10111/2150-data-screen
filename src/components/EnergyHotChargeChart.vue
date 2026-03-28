<template>
  <div class="panel-section">
    <h3 class="section-title">能耗目标偏差</h3>

    <div class="mini-row">
      <div class="mini-card">
        <div class="mini-chart" ref="hotGauge"></div>
        <div class="mini-caption">热装率偏差（目标 {{ hotChargeTarget.toFixed(0) }}%）</div>
      </div>
      <div class="mini-card">
        <div class="mini-chart" ref="gasGauge"></div>
        <div class="mini-caption">煤气单耗偏差（目标 ≤ {{ gasTarget.toFixed(2) }}）</div>
      </div>
    </div>

    <div class="chart-container" ref="energyChart"></div>
    <div class="chart-caption">近7日：实际 vs 目标（虚线）</div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { darkTheme } from "../utils/echarts";
import { DASHBOARD_CONSTANTS } from "@/config/dashboardConstants";

export default {
  name: "EnergyHotChargeChart",
  props: {
    energyData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      hotGaugeChart: null,
      gasGaugeChart: null,
      trendChart: null,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.hotGaugeChart) this.hotGaugeChart.dispose();
    if (this.gasGaugeChart) this.gasGaugeChart.dispose();
    if (this.trendChart) this.trendChart.dispose();
    this.hotGaugeChart = null;
    this.gasGaugeChart = null;
    this.trendChart = null;
  },
  watch: {
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
      this.trendChart = echarts.init(this.$refs.energyChart, null, {
        theme: darkTheme,
      });
      return this.trendChart;
    },
    getOrCreateHotGauge() {
      if (this.hotGaugeChart) return this.hotGaugeChart;
      this.hotGaugeChart = echarts.init(this.$refs.hotGauge, null, {
        theme: darkTheme,
      });
      return this.hotGaugeChart;
    },
    getOrCreateGasGauge() {
      if (this.gasGaugeChart) return this.gasGaugeChart;
      this.gasGaugeChart = echarts.init(this.$refs.gasGauge, null, {
        theme: darkTheme,
      });
      return this.gasGaugeChart;
    },
    initChart() {
      if (!this.$refs.energyChart || !this.$refs.hotGauge || !this.$refs.gasGauge)
        return;

      const trend = this.getOrCreateTrendChart();
      const hotGauge = this.getOrCreateHotGauge();
      const gasGauge = this.getOrCreateGasGauge();

      this.updateMiniGauges(hotGauge, gasGauge);

      const source = this.energyData.slice(-7);
      const dates = source.map((item) => this.formatDateLabel(item.date));
      const hotChargeRate = source.map((item) => item.hot_charge_rate || 0);
      const gasConsumption = source.map((item) => item.gas_consumption || 0);

      const option = {
        tooltip: { trigger: "axis" },
        legend: {
          top: 0,
          right: 0,
          data: ["热装率", "热装目标", "煤气单耗", "煤气目标"],
          textStyle: { color: "#8c9ab3", fontSize: 11 },
          itemWidth: 10,
          itemHeight: 6,
        },
        grid: { top: 26, left: 10, right: 10, bottom: 18, containLabel: false },
        xAxis: [{ type: "category", data: dates, axisTick: { show: false } }],
        yAxis: [
          {
            type: "value",
            name: "",
            min: Math.min(...hotChargeRate, this.hotChargeTarget) - 8,
            max: Math.max(...hotChargeRate, this.hotChargeTarget) + 8,
            axisLabel: { show: false },
            splitNumber: 2,
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } },
          },
          {
            type: "value",
            name: "",
            min: Math.min(...gasConsumption, this.gasTarget) - 0.08,
            max: Math.max(...gasConsumption, this.gasTarget) + 0.08,
            axisLabel: { show: false },
            splitNumber: 2,
            splitLine: { show: false },
          },
        ],
        series: [
          {
            name: "热装率",
            type: "line",
            data: hotChargeRate,
            smooth: true,
            symbol: "none",
            lineStyle: { color: "#2d8cff", width: 2 },
            areaStyle: { color: "rgba(45,140,255,0.10)" },
          },
          {
            name: "热装目标",
            type: "line",
            data: hotChargeRate.map(() => this.hotChargeTarget),
            smooth: true,
            symbol: "none",
            lineStyle: { color: "rgba(76,175,80,0.9)", width: 1, type: "dashed" },
          },
          {
            name: "煤气单耗",
            type: "line",
            yAxisIndex: 1,
            data: gasConsumption,
            smooth: true,
            symbol: "none",
            lineStyle: { color: "#ff9800", width: 2 },
            areaStyle: { color: "rgba(255,152,0,0.10)" },
          },
          {
            name: "煤气目标",
            type: "line",
            yAxisIndex: 1,
            data: gasConsumption.map(() => this.gasTarget),
            smooth: true,
            symbol: "none",
            lineStyle: { color: "rgba(76,175,80,0.9)", width: 1, type: "dashed" },
          },
        ],
      };
      trend.setOption(option, true);
    },
    updateMiniGauges(hotGauge, gasGauge) {
      const hotValue = Number(this.latestEnergy?.hot_charge_rate) || 0;
      const hotDelta = hotValue - this.hotChargeTarget;
      const hotLevel = hotDelta >= 0 ? "good" : hotDelta >= -5 ? "warn" : "bad";

      const gasValue = Number(this.latestEnergy?.gas_consumption) || 0;
      const gasDelta = gasValue - this.gasTarget; // 低于目标更好
      const gasLevel = gasDelta <= 0 ? "good" : gasDelta <= 0.05 ? "warn" : "bad";

      const levelColor = (level) =>
        level === "good" ? "#4caf50" : level === "warn" ? "#ff9800" : "#f44336";

      const hotOption = {
        series: [
          {
            type: "gauge",
            startAngle: 210,
            endAngle: -30,
            min: 0,
            max: 100,
            splitNumber: 4,
            axisLine: {
              lineStyle: { width: 10, color: [[1, "rgba(76,175,80,0.20)"]] },
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            pointer: { width: 3, itemStyle: { color: levelColor(hotLevel) } },
            title: {
              show: true,
              offsetCenter: [0, "62%"],
              color: "#8c9ab3",
              fontSize: 11,
              text: "热装率",
            },
            detail: {
              show: true,
              offsetCenter: [0, "18%"],
              fontSize: 14,
              fontWeight: 800,
              color: "#e6e9f0",
              formatter: () =>
                `${hotValue.toFixed(1)}%\n{d|${hotDelta >= 0 ? "+" : ""}${hotDelta.toFixed(
                  1
                )}%}`,
              rich: {
                d: { fontSize: 11, fontWeight: 800, color: levelColor(hotLevel) },
              },
            },
            data: [{ value: hotValue }],
          },
        ],
      };

      const gasOption = {
        series: [
          {
            type: "gauge",
            startAngle: 210,
            endAngle: -30,
            min: 0.8,
            max: 1.4,
            splitNumber: 3,
            axisLine: {
              lineStyle: { width: 10, color: [[1, "rgba(76,175,80,0.20)"]] },
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            pointer: { width: 3, itemStyle: { color: levelColor(gasLevel) } },
            title: {
              show: true,
              offsetCenter: [0, "62%"],
              color: "#8c9ab3",
              fontSize: 11,
              text: "煤气单耗",
            },
            detail: {
              show: true,
              offsetCenter: [0, "18%"],
              fontSize: 14,
              fontWeight: 800,
              color: "#e6e9f0",
              formatter: () =>
                `${gasValue.toFixed(2)}\n{d|${gasDelta >= 0 ? "+" : ""}${gasDelta.toFixed(
                  2
                )}}`,
              rich: {
                d: { fontSize: 11, fontWeight: 800, color: levelColor(gasLevel) },
              },
            },
            data: [{ value: gasValue }],
          },
        ],
      };

      hotGauge.setOption(hotOption, true);
      gasGauge.setOption(gasOption, true);
    },
    handleResize() {
      if (this.hotGaugeChart) this.hotGaugeChart.resize();
      if (this.gasGaugeChart) this.gasGaugeChart.resize();
      if (this.trendChart) this.trendChart.resize();
    },
  },
  computed: {
    latestEnergy() {
      if (!this.energyData || this.energyData.length === 0) return null;
      return this.energyData[this.energyData.length - 1];
    },
    hotChargeTarget() {
      return DASHBOARD_CONSTANTS.hotChargeTarget;
    },
    gasTarget() {
      return DASHBOARD_CONSTANTS.gasConsumptionTarget;
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

  .mini-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .mini-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(42, 58, 74, 0.8);
    border-radius: 8px;
    padding: 8px 8px 4px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 86px;
  }

  .mini-chart {
    width: 100%;
    height: 64px;
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
