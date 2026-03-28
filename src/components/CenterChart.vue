<template>
  <div class="center-chart">
    <ModulePanelTitle>产量趋势分析</ModulePanelTitle>
    <div class="chart-container" ref="productionChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  darkTheme,
  panelTitleModule,
  panelCaptionBottomCenter,
  panelLegendStandard,
} from "../utils/echarts";
import { observeElementsForResize } from "@/utils/chartResizeObserver";
import ModulePanelTitle from "./ModulePanelTitle.vue";

export default {
  name: "CenterChart",
  components: { ModulePanelTitle },
  props: {
    productionData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      _stopResizeObs: null,
    };
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
    this.$nextTick(() => {
      this._stopResizeObs = observeElementsForResize(
        this.$refs.productionChart,
        this.handleResize
      );
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this._stopResizeObs) this._stopResizeObs();
    this._stopResizeObs = null;
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
        color: ["#ff9800", "#4caf50"],
        title: {
          text: "",
          subtext: `计划与实轧对比：累计欠产 ${this.totalUnderproduction} 吨（最高 ${this.maxProduction} 吨，最低 ${this.minProduction} 吨）`,
          ...panelTitleModule,
          ...panelCaptionBottomCenter,
        },
        grid: {
          left: 55,
          right: 45,
          top: 52,
          bottom: 78,
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
          data: [
            { name: "计划产量", itemStyle: { color: "#ff9800" } },
            { name: "实轧产量", icon: "rect", itemStyle: { color: "#4caf50" } },
          ],
          top: 40,
          right: 8,
          ...panelLegendStandard,
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
            itemStyle: { color: "#ff9800" },
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
            // 图例取色用；柱体仍按与计划比较显示红/绿
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
      this.$nextTick(() => {
        try {
          chart.resize();
        } catch (e) {
          /* ignore */
        }
      });
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
@import "../styles/panelSectionLayout.less";

.center-chart {
  /* 与左右栏 stacked 面板一致：在 flex 容器内占满剩余高度 */
  flex: 1;
  min-height: 0;
  .dashboard-center-chart-shell();

  .chart-container {
    .dashboard-flex-chart-host();
  }
}
</style>
