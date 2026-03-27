<template>
  <div class="right-panel">
    <div class="panel-section">
      <h3 class="section-title">能耗与热装分析</h3>
      <div class="chart-container" ref="energyChart"></div>
    </div>
    <div class="panel-section">
      <h3 class="section-title">库存与缴库分析</h3>
      <div class="chart-container" ref="inventoryChart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { darkTheme } from "../utils/echarts";

export default {
  name: "RightPanel",
  props: {
    energyData: {
      type: Array,
      default: () => [],
    },
    inventoryData: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initEnergyChart();
    this.initInventoryChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.energyChart) {
      this.energyChart.dispose();
    }
    if (this.inventoryChart) {
      this.inventoryChart.dispose();
    }
  },
  watch: {
    energyData: {
      handler() {
        this.initEnergyChart();
      },
      deep: true,
    },
    inventoryData: {
      handler() {
        this.initInventoryChart();
      },
      deep: true,
    },
  },
  methods: {
    initEnergyChart() {
      if (!this.$refs.energyChart) return;

      this.energyChart = echarts.init(this.$refs.energyChart, null, {
        theme: darkTheme,
      });

      // 处理能耗数据
      const energyData = this.energyData.slice(-7);
      const dates = energyData.map((item) => {
        const date = new Date(item.date);
        return `3月${date.getDate()}日`;
      });

      const hotChargeRate = energyData.map((item) => item.hot_charge_rate || 0);
      const gasConsumption = energyData.map(
        (item) => item.gas_consumption || 0
      );

      const minHotCharge = Math.min(...hotChargeRate) - 5;
      const maxHotCharge = Math.max(...hotChargeRate) + 5;
      const minGas = Math.min(...gasConsumption) - 0.05;
      const maxGas = Math.max(...gasConsumption) + 0.05;

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["热装率", "煤气单耗"],
        },
        xAxis: [
          {
            type: "category",
            data: dates,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "热装率(%)",
            min: minHotCharge,
            max: maxHotCharge,
            interval: 2,
          },
          {
            type: "value",
            name: "煤气单耗(GJ/t)",
            min: minGas,
            max: maxGas,
            interval: 0.05,
          },
        ],
        series: [
          {
            name: "热装率",
            type: "line",
            data: hotChargeRate,
          },
          {
            name: "煤气单耗",
            type: "line",
            yAxisIndex: 1,
            data: gasConsumption,
          },
        ],
      };
      this.energyChart.setOption(option);
    },
    initInventoryChart() {
      if (!this.$refs.inventoryChart) return;

      this.inventoryChart = echarts.init(this.$refs.inventoryChart, null, {
        theme: darkTheme,
      });

      // 处理库存数据
      const inventoryData = this.inventoryData.slice(-7);
      const dates = inventoryData.map((item) => {
        const date = new Date(item.date);
        return `3月${date.getDate()}日`;
      });

      const inventory = inventoryData.map((item) => item.inventory || 0);

      // 从energyData中获取缴库量数据
      const deliveryData = this.energyData
        .slice(-7)
        .map((item) => item.delivery || 0);

      const minInventory = Math.min(...inventory) - 0.1;
      const maxInventory = Math.max(...inventory) + 0.1;
      const minDelivery = Math.min(...deliveryData) - 500;
      const maxDelivery = Math.max(...deliveryData) + 500;

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["钢坯库存", "缴库量"],
        },
        xAxis: [
          {
            type: "category",
            data: dates,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "钢坯库存(万吨)",
            min: minInventory,
            max: maxInventory,
            interval: 0.02,
          },
          {
            type: "value",
            name: "缴库量(吨)",
            min: minDelivery,
            max: maxDelivery,
            interval: 500,
          },
        ],
        series: [
          {
            name: "钢坯库存",
            type: "line",
            data: inventory,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(45, 140, 255, 0.3)" },
                { offset: 1, color: "rgba(45, 140, 255, 0.1)" },
              ]),
            },
          },
          {
            name: "缴库量",
            type: "bar",
            yAxisIndex: 1,
            data: deliveryData,
          },
        ],
      };
      this.inventoryChart.setOption(option);
    },
    handleResize() {
      if (this.energyChart) {
        this.energyChart.resize();
      }
      if (this.inventoryChart) {
        this.inventoryChart.resize();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;

  .panel-section {
    flex: 1;
    background-color: rgba(21, 30, 44, 0.6);
    border-radius: 8px;
    padding: 16px;

    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #e6e9f0;
      margin-bottom: 16px;
    }

    .chart-container {
      width: 100%;
      height: calc(100% - 40px);
    }
  }
}
</style>
