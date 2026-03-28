<template>
  <div class="panel-section">
    <ModulePanelTitle>钢坯库存</ModulePanelTitle>
    <div class="mini-card" ref="miniCard">
      <div class="mini-chart" ref="levelChart"></div>
    </div>

    <div class="chart-container" ref="inventoryChart"></div>
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
  name: "InventoryDeliveryChart",
  components: { ModulePanelTitle },
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
  data() {
    return {
      _stopResizeObs: null,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
    this.$nextTick(() => {
      this._stopResizeObs = observeElementsForResize(
        [this.$refs.miniCard, this.$refs.inventoryChart],
        this.handleResize
      );
      requestAnimationFrame(() => {
        this.handleResize();
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this._stopResizeObs) this._stopResizeObs();
    this._stopResizeObs = null;
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
        backgroundColor: "transparent",
        color: ["#64b5f6"],
        title: {
          text: "",
          subtext: "钢坯库存走势（近7日，红虚线为安全库存线）",
          ...panelTitleModule,
          ...panelCaptionBottomCenter,
        },
        tooltip: {
          ...panelTooltipAxis,
          axisPointer: panelAxisPointerLine,
        },
        legend: {
          show: true,
          data: [{ name: "钢坯库存", itemStyle: { color: "#64b5f6" } }],
          left: 8,
          top: 8,
          ...panelLegendStandard,
        },
        grid: { top: 36, left: 8, right: 14, bottom: 72, containLabel: false },
        xAxis: [
          {
            type: "category",
            data: dates,
            ...panelXAxisCategory,
            axisLabel: {
              ...panelXAxisCategory.axisLabel,
              fontSize: 9,
              margin: 8,
              interval: 0,
              rotate: dates.length > 5 ? 20 : 0,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: Math.min(...inventory, this.safetyLine) - 0.2,
            max: Math.max(...inventory, this.safetyLine) + 0.2,
            axisLabel: { show: false },
            splitNumber: 2,
            splitLine: panelSplitLine,
          },
        ],
        series: [
          {
            name: "钢坯库存",
            type: "line",
            data: inventory,
            smooth: 0.35,
            symbol: "circle",
            symbolSize: 4,
            showSymbol: false,
            itemStyle: { color: "#64b5f6" },
            lineStyle: {
              width: 2.5,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#64b5f6" },
                { offset: 1, color: "#1565c0" },
              ]),
              shadowColor: "rgba(45,140,255,0.35)",
              shadowBlur: 8,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(45, 140, 255, 0.28)" },
                { offset: 1, color: "rgba(45, 140, 255, 0.03)" },
              ]),
            },
            markLine: {
              symbol: "none",
              label: { show: false },
              lineStyle: { color: "rgba(244,67,54,0.75)", type: "dashed", width: 1 },
              data: [{ yAxis: this.safetyLine }],
            },
          },
        ],
      };
      trend.setOption(option, true);
      this.$nextTick(() => {
        try {
          trend.resize();
          level.resize();
        } catch (e) {
          /* ignore */
        }
      });
    },
    updateLevelOption(chart) {
      const v = this.latestInventory;
      const delta = this.trendDelta;
      const max = Math.max(this.safetyLine * 2, v * 1.2, 0.5);
      const good = v > this.safetyLine;
      const deltaColor = delta >= 0 ? "#4caf50" : "#f44336";
      const arrow = delta >= 0 ? "↑" : "↓";

      const option = {
        backgroundColor: "transparent",
        title: {
          text: `库存安全水位 · 安全线 ${this.safetyLine.toFixed(
            2
          )} 万吨（柱右为较上日增减）`,
          subtext: "",
          ...panelTitleModule,
          ...panelCaptionBottomCenter,
        },
        tooltip: {
          ...panelTooltipAxis,
          trigger: "item",
          formatter: () =>
            `<b>库存水位</b><br/>当前 ${v.toFixed(2)} 万吨<br/>日变化 ${arrow} ${Math.abs(
              delta
            ).toFixed(2)}`,
        },
        legend: { show: false },
        grid: {
          left: "4%",
          right: "20%",
          top: "8%",
          bottom: "34%",
          containLabel: false,
        },
        media: [
          {
            query: { maxWidth: 260 },
            option: {
              grid: {
                left: "2%",
                right: "28%",
                top: "4%",
                bottom: "42%",
              },
              title: {
                textStyle: { fontSize: 10 },
              },
            },
          },
          {
            query: { minWidth: 420 },
            option: {
              grid: {
                left: "5%",
                right: "16%",
                top: "10%",
                bottom: "28%",
              },
            },
          },
        ],
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
            name: "当前库存",
            type: "bar",
            data: [v],
            barWidth: "58%",
            barMinWidth: "18%",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(255,255,255,0.08)",
              borderRadius: 5,
            },
            itemStyle: {
              color: good
                ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#81c784" },
                    { offset: 1, color: "#2e7d32" },
                  ])
                : new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#ff8a80" },
                    { offset: 1, color: "#c62828" },
                  ]),
              borderRadius: 5,
              shadowBlur: 6,
              shadowColor: "rgba(0,0,0,0.25)",
            },
            label: {
              show: true,
              position: "right",
              distance: 4,
              formatter: () =>
                `{v|${v.toFixed(2)}万} {d|${arrow}${Math.abs(delta).toFixed(2)}}`,
              rich: {
                v: { color: "#e6e9f0", fontSize: 10, fontWeight: 700 },
                d: { color: deltaColor, fontSize: 10, fontWeight: 700 },
              },
            },
            markLine: {
              symbol: "none",
              label: { show: false },
              lineStyle: { color: "rgba(244,67,54,0.85)", type: "dashed", width: 1 },
              data: [{ xAxis: this.safetyLine }],
            },
          },
        ],
      };

      chart.setOption(option, true);
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          try {
            chart.resize();
          } catch (e) {
            /* ignore */
          }
        });
      });
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
@import "../styles/panelSectionLayout.less";

.panel-section {
  .dashboard-panel-section-core();

  .mini-card {
    .dashboard-mini-gauge-cell();
    width: 100%;
    flex: 0 1 35%;
    min-height: 92px;
    max-height: 48%;
    background: rgba(255, 255, 255, 0.04);
    border: none;
    border-radius: 6px;
    padding: 6px 8px 6px 6px;
    gap: 4px;
  }

  .mini-chart {
    .dashboard-mini-gauge-canvas();
    min-height: 0;
  }

  .chart-container {
    .dashboard-flex-chart-host();
  }
}
</style>
