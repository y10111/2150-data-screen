<template>
  <div class="panel-section">
    <ModulePanelTitle>缺陷分布解释</ModulePanelTitle>
    <div class="defect-summary">
      <div class="chart-cell">
        <div class="defect-chart" ref="defectBar"></div>
      </div>
      <div class="chart-cell">
        <div class="cell-caption">近7日缺陷总量走势</div>
        <div class="defect-trend-chart" ref="defectTrend"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  darkTheme,
  panelTooltipAxis,
  panelAxisPointerLine,
  panelSplitLine,
  panelTitleModule,
  panelCaptionBottomCenter,
  panelLegendStandard,
  formatAxisDateMd,
} from "../utils/echarts";
import { observeElementsForResize } from "@/utils/chartResizeObserver";
import ModulePanelTitle from "./ModulePanelTitle.vue";

export default {
  name: "QualityYieldChart",
  components: { ModulePanelTitle },
  props: {
    qualityData: {
      type: Array,
      default: () => [],
    },
    defectData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      barChart: null,
      trendChart: null,
      _stopResizeObs: null,
    };
  },
  computed: {
    latestDefect() {
      if (!this.defectData || this.defectData.length === 0) return null;
      return this.defectData[this.defectData.length - 1];
    },
    defectBarSeries() {
      const defects = this.latestDefect?.defects || [];
      const filtered = defects.filter((d) => (d.value || 0) > 0);
      const top = filtered.slice(0, 5);
      return {
        categories: top.map((d) => d.name),
        values: top.map((d) => d.value),
      };
    },
    defectSeriesSlice() {
      const raw = this.defectData || [];
      const sorted = [...raw].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      return sorted.slice(-7);
    },
    trendDates() {
      return this.defectSeriesSlice.map((x) => formatAxisDateMd(x.date));
    },
    trendTotals() {
      return this.defectSeriesSlice.map((x) => Number(x.total) || 0);
    },
  },
  mounted() {
    this.initCharts();
    window.addEventListener("resize", this.handleResize);
    this.$nextTick(() => {
      this._stopResizeObs = observeElementsForResize(
        [this.$refs.defectBar, this.$refs.defectTrend],
        this.handleResize
      );
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this._stopResizeObs) this._stopResizeObs();
    this._stopResizeObs = null;
    if (this.barChart) {
      this.barChart.dispose();
      this.barChart = null;
    }
    if (this.trendChart) {
      this.trendChart.dispose();
      this.trendChart = null;
    }
  },
  watch: {
    qualityData: {
      handler() {
        this.initCharts();
      },
      deep: true,
    },
    defectData: {
      handler() {
        this.initCharts();
      },
      deep: true,
    },
  },
  methods: {
    getOrCreateBarChart() {
      if (this.barChart) return this.barChart;
      this.barChart = echarts.init(this.$refs.defectBar, null, {
        theme: darkTheme,
      });
      return this.barChart;
    },
    getOrCreateTrendChart() {
      if (this.trendChart) return this.trendChart;
      this.trendChart = echarts.init(this.$refs.defectTrend, null, {
        theme: darkTheme,
      });
      return this.trendChart;
    },
    initCharts() {
      this.initBarChart();
      this.initTrendChart();
    },
    initBarChart() {
      if (!this.$refs.defectBar) return;
      const chart = this.getOrCreateBarChart();
      const { categories, values } = this.defectBarSeries;

      const gradients = [
        ["#7c9dff", "#3d5cbf"],
        ["#ffb74d", "#e65100"],
        ["#ff8a80", "#c62828"],
        ["#4dd0e1", "#00838f"],
        ["#ce93d8", "#6a1b9a"],
      ];
      const option = {
        backgroundColor: "transparent",
        color: ["#7c9dff"],
        title: {
          text: "",
          subtext: "缺陷类型吨位排名（TopN，单位：吨）",
          ...panelTitleModule,
          ...panelCaptionBottomCenter,
        },
        legend: {
          show: true,
          data: [{ name: "缺陷吨数", icon: "rect", itemStyle: { color: "#7c9dff" } }],
          top: 8,
          right: 8,
          ...panelLegendStandard,
        },
        grid: { top: 12, left: 4, right: 8, bottom: 50, containLabel: false },
        tooltip: {
          ...panelTooltipAxis,
          axisPointer: { ...panelAxisPointerLine, type: "shadow" },
          formatter: (params) => {
            const p = params?.[0];
            if (!p) return "";
            return `${p.marker} <b>${p.name}</b><br/>${Number(p.data).toFixed(
              0
            )} 吨`;
          },
        },
        xAxis: {
          type: "value",
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: panelSplitLine,
        },
        yAxis: {
          type: "category",
          data: categories,
          axisLabel: { color: "#c5d0e6", fontSize: 12, margin: 6 },
          axisTick: { show: false },
          axisLine: { show: false },
        },
        series: [
          {
            name: "缺陷吨数",
            type: "bar",
            data: values.map((v) => Number(v)),
            barWidth: 14,
            animationDuration: 480,
            animationEasing: "cubicOut",
            itemStyle: {
              borderRadius: [0, 8, 8, 0],
              color: (params) => {
                const [a, b] = gradients[params.dataIndex % gradients.length];
                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: a },
                  { offset: 1, color: b },
                ]);
              },
              shadowBlur: 6,
              shadowColor: "rgba(0,0,0,0.25)",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 12,
                shadowColor: "rgba(45,140,255,0.35)",
              },
            },
            label: {
              show: true,
              position: "insideRight",
              distance: 4,
              color: "#f0f4fc",
              formatter: (p) => `${Number(p.data).toFixed(0)} 吨`,
              fontSize: 11,
              fontWeight: 600,
              textShadowColor: "rgba(0,0,0,0.45)",
              textShadowBlur: 2,
            },
          },
        ],
      };

      chart.setOption(option, true);
      this.$nextTick(() => {
        try {
          chart.resize();
        } catch (e) {
          /* ignore */
        }
      });
    },
    initTrendChart() {
      if (!this.$refs.defectTrend) return;
      const chart = this.getOrCreateTrendChart();
      const dates = this.trendDates;
      const totals = this.trendTotals;
      if (!dates.length) {
        chart.setOption(
          {
            graphic: [
              {
                type: "text",
                left: "center",
                top: "middle",
                style: {
                  text: "暂无趋势数据",
                  fill: "#6b7a94",
                  fontSize: 11,
                },
              },
            ],
            xAxis: [{ show: false }],
            yAxis: [{ show: false }],
            series: [],
          },
          true
        );
        this.$nextTick(() => {
          try {
            chart.resize();
          } catch (e) {
            /* ignore */
          }
        });
        return;
      }
      chart.setOption(
        {
          graphic: [],
          tooltip: {
            ...panelTooltipAxis,
            axisPointer: panelAxisPointerLine,
            formatter: (params) => {
              const p = params?.[0];
              if (!p) return "";
              return `${p.marker} <b>${p.axisValue}</b><br/>缺陷合计 ${Number(
                p.data
              ).toFixed(0)} 吨`;
            },
          },
          grid: { left: 8, right: 8, top: 6, bottom: 20, containLabel: false },
          xAxis: [
            {
              type: "category",
              data: dates,
              axisTick: { show: false },
              axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
              axisLabel: { color: "#9aa8bf", fontSize: 9, interval: 0 },
            },
          ],
          yAxis: [
            {
              type: "value",
              min: 0,
              splitNumber: 2,
              axisLabel: {
                color: "#9aa8bf",
                fontSize: 9,
                formatter: (v) => `${Math.round(v)}`,
              },
              splitLine: panelSplitLine,
            },
          ],
          series: [
            {
              name: "缺陷总量",
              type: "line",
              data: totals,
              smooth: 0.35,
              symbol: "circle",
              symbolSize: 4,
              showSymbol: dates.length <= 10,
              itemStyle: { color: "#7c9dff" },
              lineStyle: {
                width: 2,
                color: "#7c9dff",
                shadowColor: "rgba(124,157,255,0.35)",
                shadowBlur: 6,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(124, 157, 255, 0.28)" },
                  { offset: 1, color: "rgba(124, 157, 255, 0.02)" },
                ]),
              },
            },
          ],
        },
        true
      );
      this.$nextTick(() => {
        try {
          chart.resize();
        } catch (e) {
          /* ignore */
        }
      });
    },
    handleResize() {
      try {
        if (this.barChart) this.barChart.resize();
      } catch (e) {
        /* ignore */
      }
      try {
        if (this.trendChart) this.trendChart.resize();
      } catch (e) {
        /* ignore */
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../styles/panelSectionLayout.less";

.panel-section {
  .dashboard-panel-section-core();

  .defect-summary {
    display: flex;
    gap: 10px;
    align-items: stretch;
    justify-content: center;
    flex: 1 1 0;
    min-height: 0;
  }

  .chart-cell {
    flex: 1;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.12);
    padding: 4px;
    box-sizing: border-box;

    &:first-child {
      border-right: 1px solid rgba(55, 76, 98, 0.45);
      margin-right: 2px;
      padding-right: 8px;
    }
  }

  .cell-caption {
    flex-shrink: 0;
    text-align: center;
    font-size: 10px;
    font-weight: 600;
    color: #9eb1cc;
    letter-spacing: 0.02em;
    padding: 2px 4px 4px;
    line-height: 1.2;
  }

  .defect-chart,
  .defect-trend-chart {
    width: 100%;
    flex: 1;
    min-height: 0;
  }
}
</style>
