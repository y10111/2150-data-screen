<template>
  <div class="panel-section">
    <h3 class="section-title">设备事故解释</h3>

    <div class="accident-summary">
      <div class="pie-wrap">
        <div class="pie-legend-column">
          <div
            v-for="item in pieLegendItems"
            :key="item.name"
            class="legend-item"
            :class="{ active: item.name === dominantType }"
          >
            <span class="dot" :class="item.name"></span>
            <span class="text">{{ item.text }}</span>
          </div>
        </div>
        <div class="pie-chart" ref="pieChart"></div>
        <div class="chart-caption">事故类型占比</div>
      </div>

      <div class="gauge-wrap">
        <div class="gauge-chart" ref="trendChart"></div>
        <div class="chart-caption">事故时长变化（近7日）</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { darkTheme } from "../utils/echarts";

export default {
  name: "DeviceAccidentChart",
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
      carouselTimer: null,
      typeIndex: 0,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    this.stopCarousel();
    if (this.pieChart) this.pieChart.dispose();
    if (this.gaugeChart) this.gaugeChart.dispose();
    this.pieChart = null;
    this.gaugeChart = null;
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
    stopCarousel() {
      if (this.carouselTimer) {
        clearInterval(this.carouselTimer);
        this.carouselTimer = null;
      }
    },
    getOrCreatePieChart() {
      if (this.pieChart) return this.pieChart;
      this.pieChart = echarts.init(this.$refs.pieChart, null, {
        theme: darkTheme,
      });
      return this.pieChart;
    },
    getOrCreateGaugeChart() {
      if (this.gaugeChart) return this.gaugeChart;
      this.gaugeChart = echarts.init(this.$refs.trendChart, null, {
        theme: darkTheme,
      });
      return this.gaugeChart;
    },
    initChart() {
      if (!this.$refs.pieChart || !this.$refs.trendChart) return;

      this.stopCarousel();
      this.typeIndex = 0;

      this.getOrCreatePieChart();
      this.getOrCreateGaugeChart();

      this.updatePieOption();
      this.updateGaugeOption();

      this.carouselTimer = setInterval(() => {
        this.typeIndex = (this.typeIndex + 1) % 3;
        this.updatePieOption();
        this.updateGaugeOption();
      }, 5000);
    },
    updatePieOption() {
      const pie = this.pieChart || this.getOrCreatePieChart();

      // rawHours：真实数据（用于仪表盘的“对应时间”）
      const electric = this.electricHours;
      const mechanical = this.mechanicalHours;
      const other = this.otherHours;
      const total = this.totalDowntimeHours;

      // displayHours：用于让 0 值切片在轮播时也“看得见、放得大”
      // 仪表盘仍显示 rawHours；饼图百分比可能略有偏差，优先保证交互观感。
      const minDisplayValue = total > 0 ? total * 0.03 : 0.0001;

      const normalize = (v) => (v > 0 ? v : minDisplayValue);
      const pieData = [
        {
          name: "电气",
          value: normalize(electric),
          selected: this.activeType === "电气",
          itemStyle: {
            color: "#5470c6",
            shadowBlur: this.activeType === "电气" ? 18 : 0,
            shadowColor: "rgba(45,140,255,0.65)",
            opacity: this.activeType === "电气" ? 1 : 0.35,
          },
        },
        {
          name: "机械",
          value: normalize(mechanical),
          selected: this.activeType === "机械",
          itemStyle: {
            color: "#ff9800",
            shadowBlur: this.activeType === "机械" ? 18 : 0,
            shadowColor: "rgba(255,152,0,0.65)",
            opacity: this.activeType === "机械" ? 1 : 0.35,
          },
        },
        {
          name: "其他",
          value: normalize(other),
          selected: this.activeType === "其他",
          itemStyle: {
            color: "#f44336",
            shadowBlur: this.activeType === "其他" ? 18 : 0,
            shadowColor: "rgba(244,67,54,0.65)",
            opacity: this.activeType === "其他" ? 1 : 0.35,
          },
        },
      ];

      const pieOption = {
        tooltip: {
          trigger: "item",
          formatter: (p) => {
            const rawHours =
              p.name === "电气"
                ? electric
                : p.name === "机械"
                ? mechanical
                : other;
            const hourText = `${rawHours.toFixed(2)}小时`;
            const percentText = `${p.percent || 0}%`;
            return `${p.name}<br/>${hourText}<br/>占比：${percentText}`;
          },
        },
        legend: { show: false },
        series: [
          {
            name: "事故类型占比",
            type: "pie",
            selectedMode: "single",
            // 原地突出：selectedOffset 会把切片“推开”造成视觉位移
            selectedOffset: 0,
            radius: ["35%", "58%"],
            // 图例移到左侧后，圆心恢复到正中，确保与图例列水平中线对齐
            center: ["50%", "50%"],
            label: { show: false },
            labelLine: { show: false },
            avoidLabelOverlap: true,
            data: pieData,
          },
        ],
      };

      pie.setOption(pieOption, true);
    },
    updateGaugeOption() {
      const chart = this.gaugeChart || this.getOrCreateGaugeChart();
      const source = this.qualityData.slice(-7);
      const dates = source.map((x) => {
        const d = new Date(x.date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      });
      const hours = source.map((x) => Number(x.device_downtime) || 0);

      const option = {
        grid: { top: 12, left: 10, right: 10, bottom: 18, containLabel: false },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "line" },
          formatter: (params) => {
            const p = params?.[0];
            if (!p) return "";
            return `${p.axisValue}<br/>事故时长：${Number(p.data).toFixed(2)} 小时`;
          },
        },
        xAxis: {
          type: "category",
          data: dates,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } },
          axisLabel: { color: "#8c9ab3", fontSize: 11 },
        },
        yAxis: {
          type: "value",
          min: 0,
          splitNumber: 2,
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } },
        },
        series: [
          {
            name: "事故时长",
            type: "line",
            data: hours,
            smooth: true,
            symbol: "none",
            lineStyle: { color: "#ff9800", width: 2 },
            areaStyle: { color: "rgba(255,152,0,0.12)" },
            markLine: {
              symbol: "none",
              label: { show: false },
              lineStyle: { color: "rgba(244,67,54,0.6)", type: "dashed" },
              data: [{ yAxis: 1 }],
            },
          },
        ],
      };

      chart.setOption(option, true);
    },
    handleResize() {
      if (this.pieChart) this.pieChart.resize();
      if (this.gaugeChart) this.gaugeChart.resize();
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
    pieLegendItems() {
      const total = this.totalDowntimeHours;
      const percent = (v) => (total > 0 ? (v / total) * 100 : 0);
      return [
        { name: "电气", text: `电气 ${percent(this.electricHours).toFixed(0)}%` },
        { name: "机械", text: `机械 ${percent(this.mechanicalHours).toFixed(0)}%` },
        { name: "其他", text: `其他 ${percent(this.otherHours).toFixed(0)}%` },
      ];
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
  gap: 12px;

  .section-title {
    font-size: 14px;
    font-weight: bold;
    color: #e6e9f0;
    margin-bottom: 0;
  }

  .accident-summary {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .gauge-wrap {
    width: 180px;
    height: 130px;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .gauge-chart {
      width: 100%;
      height: 112px;
    }
  }

  .pie-wrap {
    flex: 0 0 180px;
    height: 130px;
    min-width: 180px;
    display: grid;
    grid-template-columns: 58px 122px;
    grid-template-rows: 112px 12px;
    align-items: center;
    justify-content: center;
    justify-items: center;
    .pie-chart {
      grid-column: 2;
      grid-row: 1;
      width: 122px;
      height: 112px;
    }

    .pie-legend-column {
      grid-column: 1;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 4px;
      align-self: center;
      justify-self: start;
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      white-space: nowrap;
      font-size: 13px;
      color: #8c9ab3;
      line-height: 1;
    }

    .legend-item.active {
      color: #e6e9f0;
      font-weight: 600;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .dot.电气 {
      background-color: #5470c6;
    }

    .dot.机械 {
      background-color: #ff9800;
    }

    .dot.其他 {
      background-color: #f44336;
    }
  }

  .chart-caption {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
    text-align: center;
    font-size: 13px;
    color: #8c9ab3;
    line-height: 14px;
    margin-top: -4px;
  }

}
</style>
