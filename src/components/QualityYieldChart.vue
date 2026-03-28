<template>
  <div class="panel-section">
    <ModulePanelTitle>缺陷分布解释</ModulePanelTitle>
    <div class="defect-chart" ref="defectBar"></div>
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
      _stopResizeObs: null,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
    this.$nextTick(() => {
      this._stopResizeObs = observeElementsForResize(
        this.$refs.defectBar,
        this.handleResize
      );
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this._stopResizeObs) this._stopResizeObs();
    this._stopResizeObs = null;
    if (this.barChart) this.barChart.dispose();
    this.barChart = null;
  },
  watch: {
    qualityData: {
      handler() {
        this.initChart();
      },
      deep: true,
    },
    defectData: {
      handler() {
        this.initChart();
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
    initChart() {
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
    handleResize() {
      if (this.barChart) this.barChart.resize();
    },
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
  },
};
</script>

<style lang="less" scoped>
@import "../styles/panelSectionLayout.less";

.panel-section {
  .dashboard-panel-section-core();

  .defect-chart {
    .dashboard-flex-chart-host();
  }
}
</style>
