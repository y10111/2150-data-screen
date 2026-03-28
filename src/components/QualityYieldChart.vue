<template>
  <div class="panel-section">
    <h3 class="section-title">缺陷分布解释</h3>

    <div class="defect-card">
      <div class="defect-chart" ref="defectBar"></div>
      <div class="chart-caption">缺陷 TopN（吨）</div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { darkTheme } from "../utils/echarts";

export default {
  name: "QualityYieldChart",
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
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
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

      const option = {
        grid: { top: 10, left: 6, right: 6, bottom: 10, containLabel: false },
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        xAxis: {
          type: "value",
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } },
        },
        yAxis: {
          type: "category",
          data: categories,
          axisLabel: { color: "#e6e9f0", fontSize: 12, margin: 0 },
          axisTick: { show: false },
          axisLine: { show: false },
        },
        series: [
          {
            name: "缺陷",
            type: "bar",
            data: values.map((v) => Number(v)),
            barWidth: 12,
            animation: false,
            itemStyle: {
              borderRadius: [6, 6, 6, 6],
              color: (params) => {
                const palette = ["#5470c6", "#ff9800", "#f44336", "#2d8cff"];
                return palette[params.dataIndex % palette.length];
              },
            },
            label: {
              show: true,
              position: "insideRight",
              distance: 2,
              color: "#e6e9f0",
              formatter: "{c} 吨",
              fontSize: 11,
            },
          },
        ],
      };

      chart.setOption(option, true);
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

  .defect-card {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(42, 58, 74, 0.8);
    border-radius: 8px;
    padding: 8px 4px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 0;

    .defect-chart {
      width: 100%;
      flex: 1;
      min-height: 0;
    }
  }

  .chart-caption {
    width: 100%;
    text-align: center;
    font-size: 11px;
    color: #8c9ab3;
    line-height: 14px;
  }
}
</style>
