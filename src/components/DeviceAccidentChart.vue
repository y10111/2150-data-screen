<template>
  <div class="panel-section">
    <ModulePanelTitle>设备事故解释</ModulePanelTitle>
    <div class="accident-summary">
      <div class="chart-cell">
        <div class="pie-chart" ref="pieChart"></div>
      </div>
      <div class="chart-cell">
        <div class="trend-chart" ref="trendChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  darkTheme,
  panelTooltipItem,
  panelTooltipAxis,
  panelAxisPointerLine,
  panelSplitLine,
  panelXAxisCategory,
  panelLegendStandard,
  panelTitleModule,
  panelCaptionBottomCenter,
} from "../utils/echarts";
import { DASHBOARD_CONSTANTS } from "@/config/dashboardConstants";
import { observeElementsForResize } from "@/utils/chartResizeObserver";
import ModulePanelTitle from "./ModulePanelTitle.vue";

export default {
  name: "DeviceAccidentChart",
  components: { ModulePanelTitle },
  props: {
    qualityData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      pieChart: null,
      gaugeChart: null,
      _stopResizeObs: null,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
    this.$nextTick(() => {
      this._stopResizeObs = observeElementsForResize(
        [this.$refs.pieChart, this.$refs.trendChart],
        this.handleResize
      );
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this._stopResizeObs) this._stopResizeObs();
    this._stopResizeObs = null;
    this.disposePieIfNeeded();
    this.disposeGaugeIfNeeded();
  },
  watch: {
    qualityData: {
      handler() {
        this.initChart();
      },
      deep: true,
    },
  },
  methods: {
    isChartContainer(el) {
      return (
        el &&
        el.nodeType === 1 &&
        typeof el.getBoundingClientRect === "function"
      );
    },
    disposePieIfNeeded() {
      if (!this.pieChart) return;
      try {
        this.pieChart.dispose();
      } catch (e) {
        /* ignore */
      }
      this.pieChart = null;
    },
    disposeGaugeIfNeeded() {
      if (!this.gaugeChart) return;
      try {
        this.gaugeChart.dispose();
      } catch (e) {
        /* ignore */
      }
      this.gaugeChart = null;
    },
    getOrCreatePieChart() {
      const el = this.$refs.pieChart;
      if (!this.isChartContainer(el)) return null;
      if (this.pieChart) {
        let dom = null;
        try {
          dom = this.pieChart.getDom ? this.pieChart.getDom() : null;
        } catch (e) {
          dom = null;
        }
        if (dom === el) return this.pieChart;
        this.disposePieIfNeeded();
      }
      const existed = echarts.getInstanceByDom(el);
      if (existed) {
        this.pieChart = existed;
        return existed;
      }
      this.pieChart = echarts.init(el, null, {
        theme: darkTheme,
      });
      return this.pieChart;
    },
    getOrCreateGaugeChart() {
      const el = this.$refs.trendChart;
      if (!this.isChartContainer(el)) return null;
      if (this.gaugeChart) {
        let dom = null;
        try {
          dom = this.gaugeChart.getDom ? this.gaugeChart.getDom() : null;
        } catch (e) {
          dom = null;
        }
        if (dom === el) return this.gaugeChart;
        this.disposeGaugeIfNeeded();
      }
      const existed = echarts.getInstanceByDom(el);
      if (existed) {
        this.gaugeChart = existed;
        return existed;
      }
      this.gaugeChart = echarts.init(el, null, {
        theme: darkTheme,
      });
      return this.gaugeChart;
    },
    initChart() {
      const run = () => {
        if (
          !this.isChartContainer(this.$refs.pieChart) ||
          !this.isChartContainer(this.$refs.trendChart)
        ) {
          return;
        }
        const pie = this.getOrCreatePieChart();
        const gauge = this.getOrCreateGaugeChart();
        if (!pie || !gauge) return;
        this.updatePieOption();
        this.updateGaugeOption();
        this.$nextTick(() => {
          try {
            pie.resize();
            gauge.resize();
          } catch (e) {
            /* ignore */
          }
        });
      };
      this.$nextTick(() => {
        this.$nextTick(run);
      });
    },
    updatePieOption() {
      const pie = this.getOrCreatePieChart();
      if (!pie) return;

      // rawHours：真实数据（用于仪表盘的“对应时间”）
      const electric = this.electricHours;
      const mechanical = this.mechanicalHours;
      const other = this.otherHours;
      const total = this.totalDowntimeHours;

      const active = this.dominantType;
      const pieData = [
        {
          name: "电气",
          value: electric,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: "#7c9dff" },
              { offset: 1, color: "#3d5cbf" },
            ]),
            shadowBlur: active === "电气" ? 16 : 0,
            shadowColor: "rgba(90,140,255,0.55)",
            opacity: active === "电气" ? 1 : 0.38,
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
          },
        },
        {
          name: "机械",
          value: mechanical,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: "#ffb74d" },
              { offset: 1, color: "#e65100" },
            ]),
            shadowBlur: active === "机械" ? 16 : 0,
            shadowColor: "rgba(255,167,38,0.5)",
            opacity: active === "机械" ? 1 : 0.38,
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
          },
        },
        {
          name: "其他",
          value: other,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: "#ff8a80" },
              { offset: 1, color: "#c62828" },
            ]),
            shadowBlur: active === "其他" ? 16 : 0,
            shadowColor: "rgba(244,67,54,0.5)",
            opacity: active === "其他" ? 1 : 0.38,
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
          },
        },
      ];

      const totalH = total;
      const pct = (v) => (totalH > 0 ? ((v / totalH) * 100).toFixed(0) : "0");
      const pieOption = {
        backgroundColor: "transparent",
        color: ["#7c9dff", "#ffb74d", "#ff8a80"],
        title: {
          text: "事故类型占比（按停机时长）",
          ...panelTitleModule,
          ...panelCaptionBottomCenter,
        },
        tooltip: {
          ...panelTooltipItem,
          formatter: (p) => {
            const rawHours =
              p.name === "电气"
                ? electric
                : p.name === "机械"
                ? mechanical
                : other;
            const hourText = `${rawHours.toFixed(2)} 小时`;
            const percentText = `${p.percent || 0}%`;
            return `<div style="font-weight:600;margin-bottom:4px">${p.marker}${p.name}</div>${hourText}<br/>占比 ${percentText}`;
          },
        },
        legend: {
          show: true,
          orient: "vertical",
          left: 4,
          top: "middle",
          ...panelLegendStandard,
          icon: "circle",
          itemWidth: 6,
          itemHeight: 6,
          itemGap: 4,
          data: [
            { name: "电气", itemStyle: { color: "#7c9dff" } },
            { name: "机械", itemStyle: { color: "#ffb74d" } },
            { name: "其他", itemStyle: { color: "#ff8a80" } },
          ],
          formatter: (name) => {
            const v =
              name === "电气"
                ? electric
                : name === "机械"
                ? mechanical
                : other;
            return `${name}  ${pct(v)}%`;
          },
        },
        series: [
          {
            name: "事故类型占比",
            type: "pie",
            radius: ["26%", "40%"],
            center: ["72%", "44%"],
            label: { show: false },
            labelLine: { show: false },
            avoidLabelOverlap: true,
            emphasis: {
              scale: true,
              scaleSize: 4,
              itemStyle: {
                shadowBlur: 22,
                shadowColor: "rgba(255,255,255,0.2)",
                opacity: 1,
              },
            },
            data: pieData,
          },
        ],
      };

      pie.setOption(pieOption, true);
    },
    updateGaugeOption() {
      const chart = this.getOrCreateGaugeChart();
      if (!chart) return;
      const source = this.qualityData.slice(-7);
      const dates = source.map((x) => {
        const d = new Date(x.date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      });
      const hours = source.map((x) => Number(x.device_downtime) || 0);

      const warnH = DASHBOARD_CONSTANTS.deviceDowntimeWarning;
      const option = {
        backgroundColor: "transparent",
        color: ["#ffb74d"],
        title: {
          text: "事故停机时长（近7日，单位：小时）",
          ...panelTitleModule,
          ...panelCaptionBottomCenter,
        },
        grid: { top: 12, left: 58, right: 8, bottom: 72, containLabel: false },
        tooltip: {
          ...panelTooltipAxis,
          axisPointer: panelAxisPointerLine,
          formatter: (params) => {
            const p = params?.[0];
            if (!p) return "";
            return `${p.marker} <b>${p.axisValue}</b><br/>事故时长 ${Number(
              p.data
            ).toFixed(2)} 小时`;
          },
        },
        xAxis: {
          type: "category",
          data: dates,
          ...panelXAxisCategory,
          axisLabel: {
            ...panelXAxisCategory.axisLabel,
            fontSize: 9,
            margin: 10,
            interval: 0,
            rotate: dates.length > 5 ? 32 : 0,
            hideOverlap: true,
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          splitNumber: 3,
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: panelSplitLine,
        },
        legend: {
          show: true,
          orient: "vertical",
          left: 4,
          top: "middle",
          data: [{ name: "事故时长", itemStyle: { color: "#ffb74d" } }],
          ...panelLegendStandard,
          itemGap: 6,
        },
        series: [
          {
            name: "事故时长",
            type: "line",
            data: hours,
            smooth: 0.35,
            symbol: "circle",
            symbolSize: 4,
            showSymbol: hours.length <= 10,
            itemStyle: { color: "#ffb74d" },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#ffcc80" },
                { offset: 1, color: "#ff6f00" },
              ]),
              width: 2,
              shadowColor: "rgba(255,152,0,0.28)",
              shadowBlur: 6,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(255,167,38,0.28)" },
                { offset: 1, color: "rgba(255,167,38,0.02)" },
              ]),
            },
            markLine: {
              symbol: "none",
              label: { show: false },
              lineStyle: { color: "rgba(244,67,54,0.75)", type: "dashed", width: 1 },
              data: [{ yAxis: warnH, name: `警戒${warnH}h` }],
            },
          },
        ],
      };

      chart.setOption(option, true);
    },
    handleResize() {
      try {
        if (this.pieChart) this.pieChart.resize();
      } catch (e) {
        /* ignore */
      }
      try {
        if (this.gaugeChart) this.gaugeChart.resize();
      } catch (e) {
        /* ignore */
      }
    },
  },
  computed: {
    latestQuality() {
      if (!this.qualityData || this.qualityData.length === 0) return null;
      return this.qualityData[this.qualityData.length - 1];
    },
    totalDowntimeHours() {
      const v = this.latestQuality?.device_downtime;
      return typeof v === "number" ? v : Number(v) || 0;
    },
    latestDeviceType() {
      return this.latestQuality?.device_type || "";
    },
    dominantType() {
      if (this.electricHours > 0) return "电气";
      if (this.mechanicalHours > 0) return "机械";
      if (this.otherHours > 0) return "其他";
      return "电气";
    },
    electricHours() {
      return this.latestDeviceType === "电气" ? this.totalDowntimeHours : 0;
    },
    mechanicalHours() {
      return this.latestDeviceType === "机械" ? this.totalDowntimeHours : 0;
    },
    otherHours() {
      const t = this.latestDeviceType;
      return t && t !== "电气" && t !== "机械" ? this.totalDowntimeHours : 0;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../styles/panelSectionLayout.less";

.panel-section {
  .dashboard-panel-section-core();

  .accident-summary {
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

  .pie-chart,
  .trend-chart {
    width: 100%;
    flex: 1;
    min-height: 0;
  }
}
</style>
