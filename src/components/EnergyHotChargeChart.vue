<template>
  <div class="panel-section">
    <ModulePanelTitle>能耗目标偏差</ModulePanelTitle>
    <div class="mini-row">
      <div class="mini-card">
        <div class="mini-chart-wrap">
          <div class="mini-chart" ref="hotGauge"></div>
        </div>
        <div class="gauge-value">{{ hotMainValueText }}</div>
        <div class="gauge-meta">
          <div class="gauge-meta-title">
            热装率（目标 {{ hotChargeTarget }}%）
          </div>
          <div class="gauge-meta-delta" :style="{ color: hotDeltaColor }">
            {{ hotDeltaText }}
          </div>
        </div>
      </div>
      <div class="mini-card">
        <div class="mini-chart-wrap">
          <div class="mini-chart" ref="gasGauge"></div>
        </div>
        <div class="gauge-value">{{ gasMainValueText }}</div>
        <div class="gauge-meta">
          <div class="gauge-meta-title">
            煤气单耗（目标≤{{ gasTarget.toFixed(2) }}）
          </div>
          <div class="gauge-meta-delta" :style="{ color: gasDeltaColor }">
            {{ gasDeltaText }}
          </div>
        </div>
      </div>
    </div>

    <div class="chart-container" ref="energyChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  darkTheme,
  panelTooltipAxis,
  panelAxisPointerLine,
  panelSplitLine,
  panelXAxisCategory,
  panelTitleModule,
  panelCaptionBottomCenter,
  panelLegendStandard,
} from "../utils/echarts";
import { DASHBOARD_CONSTANTS } from "@/config/dashboardConstants";
import { observeElementsForResize } from "@/utils/chartResizeObserver";
import ModulePanelTitle from "./ModulePanelTitle.vue";

export default {
  name: "EnergyHotChargeChart",
  components: { ModulePanelTitle },
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
      _stopResizeObs: null,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
    this.$nextTick(() => {
      this._stopResizeObs = observeElementsForResize(
        [this.$refs.hotGauge, this.$refs.gasGauge, this.$refs.energyChart],
        this.handleResize
      );
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this._stopResizeObs) this._stopResizeObs();
    this._stopResizeObs = null;
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
        backgroundColor: "transparent",
        color: ["#4da3ff", "#81c784", "#ffb74d", "#81c784"],
        title: {
          text: "",
          subtext: "热装率与煤气单耗（近7日）：实线为实际值，虚线为目标值",
          ...panelTitleModule,
          ...panelCaptionBottomCenter,
        },
        tooltip: {
          ...panelTooltipAxis,
          axisPointer: panelAxisPointerLine,
        },
        legend: {
          orient: "vertical",
          right: 4,
          top: "middle",
          data: [
            { name: "热装率", itemStyle: { color: "#4da3ff" } },
            { name: "热装目标", itemStyle: { color: "#81c784" } },
            { name: "煤气单耗", itemStyle: { color: "#ffb74d" } },
            { name: "煤气目标", itemStyle: { color: "#81c784" } },
          ],
          ...panelLegendStandard,
          itemGap: 6,
        },
        grid: { top: 18, left: 8, right: 64, bottom: 62, containLabel: false },
        xAxis: [
          {
            type: "category",
            data: dates,
            ...panelXAxisCategory,
            axisLabel: {
              ...panelXAxisCategory.axisLabel,
              fontSize: 10,
              margin: 10,
              interval: 0,
              rotate: dates.length > 6 ? 18 : 0,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: Math.min(...hotChargeRate, this.hotChargeTarget) - 8,
            max: Math.max(...hotChargeRate, this.hotChargeTarget) + 8,
            axisLabel: { show: false },
            splitNumber: 2,
            splitLine: panelSplitLine,
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
            smooth: 0.35,
            symbol: "circle",
            symbolSize: 4,
            showSymbol: false,
            itemStyle: { color: "#4da3ff" },
            lineStyle: {
              color: "#4da3ff",
              width: 2.5,
              shadowColor: "rgba(45,140,255,0.4)",
              shadowBlur: 8,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(45,140,255,0.22)" },
                { offset: 1, color: "rgba(45,140,255,0.02)" },
              ]),
            },
          },
          {
            name: "热装目标",
            type: "line",
            data: hotChargeRate.map(() => this.hotChargeTarget),
            smooth: 0.35,
            symbol: "none",
            itemStyle: { color: "#81c784" },
            lineStyle: {
              color: "rgba(129,199,132,0.95)",
              width: 1.5,
              type: "dashed",
            },
          },
          {
            name: "煤气单耗",
            type: "line",
            yAxisIndex: 1,
            data: gasConsumption,
            smooth: 0.35,
            symbol: "circle",
            symbolSize: 4,
            showSymbol: false,
            itemStyle: { color: "#ffb74d" },
            lineStyle: {
              color: "#ffb74d",
              width: 2.5,
              shadowColor: "rgba(255,152,0,0.35)",
              shadowBlur: 8,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(255,183,77,0.2)" },
                { offset: 1, color: "rgba(255,183,77,0.02)" },
              ]),
            },
          },
          {
            name: "煤气目标",
            type: "line",
            yAxisIndex: 1,
            data: gasConsumption.map(() => this.gasTarget),
            smooth: 0.35,
            symbol: "none",
            itemStyle: { color: "#81c784" },
            lineStyle: {
              color: "rgba(129,199,132,0.95)",
              width: 1.5,
              type: "dashed",
            },
          },
        ],
      };
      trend.setOption(option, true);
      this.$nextTick(() => {
        try {
          trend.resize();
          hotGauge.resize();
          gasGauge.resize();
        } catch (e) {
          /* ignore */
        }
      });
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
            radius: "72%",
            center: ["50%", "58%"],
            startAngle: 210,
            endAngle: -30,
            min: 0,
            max: 100,
            splitNumber: 4,
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 6,
                color: [[1, "rgba(255,255,255,0.08)"]],
              },
            },
            progress: {
              show: true,
              width: 6,
              roundCap: true,
              overlap: false,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#64b5f6" },
                  { offset: 1, color: levelColor(hotLevel) },
                ]),
              },
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            anchor: { show: false },
            pointer: {
              show: true,
              showAbove: true,
              length: "72%",
              width: 3,
              offsetCenter: [0, 0],
              itemStyle: {
                color: "#5eb8ff",
                shadowBlur: 3,
                shadowColor: "rgba(30,90,160,0.55)",
              },
            },
            title: { show: false },
            detail: { show: false },
            data: [{ value: hotValue }],
          },
        ],
      };

      const gasOption = {
        series: [
          {
            type: "gauge",
            radius: "72%",
            center: ["50%", "58%"],
            startAngle: 210,
            endAngle: -30,
            min: 0.8,
            max: 1.4,
            splitNumber: 3,
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 6,
                color: [[1, "rgba(255,255,255,0.08)"]],
              },
            },
            progress: {
              show: true,
              width: 6,
              roundCap: true,
              overlap: false,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#ffe082" },
                  { offset: 1, color: levelColor(gasLevel) },
                ]),
              },
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            anchor: { show: false },
            pointer: {
              show: true,
              showAbove: true,
              length: "72%",
              width: 3,
              offsetCenter: [0, 0],
              itemStyle: {
                color: "#ffb74d",
                shadowBlur: 3,
                shadowColor: "rgba(180,100,20,0.45)",
              },
            },
            title: { show: false },
            detail: { show: false },
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
    hotMainValueText() {
      const v = Number(this.latestEnergy?.hot_charge_rate) || 0;
      return `${v.toFixed(1)}%`;
    },
    gasMainValueText() {
      const v = Number(this.latestEnergy?.gas_consumption) || 0;
      return v.toFixed(2);
    },
    hotDeltaText() {
      const v = Number(this.latestEnergy?.hot_charge_rate) || 0;
      const d = v - this.hotChargeTarget;
      return `${d >= 0 ? "+" : ""}${d.toFixed(1)}%`;
    },
    hotDeltaColor() {
      const v = Number(this.latestEnergy?.hot_charge_rate) || 0;
      const d = v - this.hotChargeTarget;
      if (d >= 0) return "#4caf50";
      if (d >= -5) return "#ff9800";
      return "#f44336";
    },
    gasDeltaText() {
      const v = Number(this.latestEnergy?.gas_consumption) || 0;
      const d = v - this.gasTarget;
      return `${d >= 0 ? "+" : ""}${d.toFixed(2)}`;
    },
    gasDeltaColor() {
      const v = Number(this.latestEnergy?.gas_consumption) || 0;
      const d = v - this.gasTarget;
      if (d <= 0) return "#4caf50";
      if (d <= 0.05) return "#ff9800";
      return "#f44336";
    },
  },
};
</script>

<style lang="less" scoped>
@import "../styles/panelSectionLayout.less";

.panel-section {
  .dashboard-panel-section-core();

  .mini-row {
    .dashboard-mini-gauge-row();
  }

  .mini-card {
    .dashboard-mini-gauge-cell();
    background: rgba(255, 255, 255, 0.04);
    border: none;
    border-radius: 6px;
    padding: 6px 4px 8px;
    gap: 2px;
  }

  .mini-chart-wrap {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .mini-chart {
    .dashboard-mini-gauge-canvas();
  }

  .gauge-value {
    flex-shrink: 0;
    text-align: center;
    font-size: 17px;
    font-weight: 800;
    color: #e6e9f0;
    letter-spacing: 0.02em;
    line-height: 1.2;
    padding: 2px 4px 0;
  }

  .gauge-meta {
    flex-shrink: 0;
    text-align: center;
    padding: 2px 2px 0;
    line-height: 1.35;
  }

  .gauge-meta-title {
    font-size: 11px;
    font-weight: 600;
    color: #e8eaef;
  }

  .gauge-meta-delta {
    margin-top: 2px;
    font-size: 10px;
    font-weight: 700;
  }

  .chart-container {
    .dashboard-flex-chart-host();
  }
}
</style>
