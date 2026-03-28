<template>
  <main class="dashboard">
    <Header class="dashboard-header" />
    <section class="dashboard-section kpi-section">
      <el-col :span="3" v-for="kpi in kpiList" :key="kpi.name">
        <KPICard :data="kpi" />
      </el-col>
    </section>
    <PanelFrame class="panel left-panel" borderComponent="dv-border-box-1" stacked>
      <DeviceAccidentChart
        :qualityData="qualityData"
      />
      <QualityYieldChart :qualityData="qualityData" :defectData="defectData" />
    </PanelFrame>
    <PanelFrame class="panel center-panel" borderComponent="dv-border-box-2">
      <CenterChart :productionData="trendData" />
    </PanelFrame>
    <PanelFrame class="panel right-panel" borderComponent="dv-border-box-1" stacked>
      <EnergyHotChargeChart :energyData="energyData" />
      <InventoryDeliveryChart
        :inventoryData="inventoryData"
        :energyData="energyData"
      />
    </PanelFrame>
    <PanelFrame
      class="dashboard-section alert-section"
      borderComponent="dv-border-box-1"
    >
      <AIAssistant :alerts="aiAlerts" />
    </PanelFrame>
    <Footer class="dashboard-footer" />
  </main>
</template>

<script>
// 导入顶部导航栏组件
import Header from "@/components/Header.vue";
// 导入底部信息栏组件
import Footer from "@/components/Footer.vue";
// 导入KPI指标卡片组件
import KPICard from "@/components/KPICard.vue";
// 导入中间图表组件
import CenterChart from "@/components/CenterChart.vue";
import DeviceAccidentChart from "@/components/DeviceAccidentChart.vue";
import QualityYieldChart from "@/components/QualityYieldChart.vue";
import EnergyHotChargeChart from "@/components/EnergyHotChargeChart.vue";
import InventoryDeliveryChart from "@/components/InventoryDeliveryChart.vue";
import PanelFrame from "@/components/PanelFrame.vue";
// 导入AI智能预警组件
import AIAssistant from "@/components/AIAssistant.vue";
// 导入仪表板API接口
import { dashboardApi } from "@/api";
import { DASHBOARD_CONSTANTS } from "@/config/dashboardConstants";

export default {
  name: "DataDashboard",
  // 注册子组件
  components: {
    Header,
    Footer,
    KPICard,
    CenterChart,
    DeviceAccidentChart,
    QualityYieldChart,
    EnergyHotChargeChart,
    InventoryDeliveryChart,
    PanelFrame,
    AIAssistant,
  },
  // 组件数据
  data() {
    return {
      // KPI指标列表
      kpiList: [],
      // 趋势数据
      trendData: [],
      // 库存数据
      inventoryData: [],
      // 缺陷数据
      defectData: [],
      // AI预警数据
      aiAlerts: [],
      // 设备健康数据
      deviceData: [],
      // 质量数据
      qualityData: [],
      // 能耗数据
      energyData: [],
    };
  },
  // 组件挂载后执行
  mounted() {
    // 调用数据获取方法
    this.fetchAllData();
  },
  // 组件方法
  methods: {
    normalizeListResponse(payload) {
      if (Array.isArray(payload)) {
        return payload;
      }
      if (payload && Array.isArray(payload.data)) {
        return payload.data;
      }
      // 兼容：mock/json 里也包含 { code, data: [] }，再被 mock/index.js 包一层
      if (
        payload &&
        payload.data &&
        typeof payload.data === "object" &&
        Array.isArray(payload.data.data)
      ) {
        return payload.data.data;
      }
      return [];
    },
    // 获取所有仪表板数据
    async fetchAllData() {
      try {
        // 并发请求所有API接口
        const [
          kpiRes,
          trendRes,
          inventoryRes,
          defectRes,
          aiAlertsRes,
          deviceHealthRes,
        ] = await Promise.all([
          // 获取KPI数据
          dashboardApi.getKpiData(),
          // 获取趋势数据
          dashboardApi.getTrendData(),
          // 获取库存数据
          dashboardApi.getInventoryData(),
          // 获取缺陷数据
          dashboardApi.getDefectData(),
          // 获取AI预警数据
          dashboardApi.getAiAlerts(),
          // 获取设备健康数据
          dashboardApi.getDeviceHealth(),
        ]);

        const kpiData = this.normalizeListResponse(kpiRes);
        const trendData = this.normalizeListResponse(trendRes);
        const inventoryData = this.normalizeListResponse(inventoryRes);
        const defectData = this.normalizeListResponse(defectRes);
        const aiAlertsData = this.normalizeListResponse(aiAlertsRes);
        const deviceHealthData = this.normalizeListResponse(deviceHealthRes);

        // 处理KPI数据
        if (kpiData.length > 0) {
          // 获取最新的KPI数据（数组最后一个元素）
          const latestKpi = kpiData[kpiData.length - 1];
          // 获取前一天的KPI数据（数组倒数第二个元素），用于计算趋势
          const previousKpi = kpiData[kpiData.length - 2];

          // 计算趋势值
          const calculateTrend = (current, previous) => {
            // 如果没有前一天的值，返回0
            if (!previous) return 0;
            // 计算百分比变化并保留一位小数
            return (((current - previous) / previous) * 100).toFixed(1) * 1;
          };

          // 构建KPI列表，包含8个关键指标
          this.kpiList = [
            {
              name: "当日产量",
              value: latestKpi.today_actual,
              unit: "吨",
              trend: calculateTrend(
                latestKpi.today_actual,
                previousKpi?.today_actual
              ),
              // 如果实际产量低于计划产量，显示警告
              warning: latestKpi.today_actual < latestKpi.today_plan,
            },
            {
              name: "计划完成率",
              value: latestKpi.completion_rate,
              unit: "%",
              trend: calculateTrend(
                latestKpi.completion_rate,
                previousKpi?.completion_rate
              ),
              // 如果完成率低于100%，显示警告
              warning: latestKpi.completion_rate < 100,
            },
            {
              name: "成材率",
              value: latestKpi.yield_rate,
              unit: "%",
              trend: calculateTrend(
                latestKpi.yield_rate,
                previousKpi?.yield_rate
              ),
              // 如果成材率低于98%，显示警告
              warning: latestKpi.yield_rate < DASHBOARD_CONSTANTS.yieldWarning,
            },
            {
              name: "热装率",
              value: latestKpi.hot_charge_rate,
              unit: "%",
              trend: calculateTrend(
                latestKpi.hot_charge_rate,
                previousKpi?.hot_charge_rate
              ),
              // 如果热装率低于50%，显示警告
              warning:
                latestKpi.hot_charge_rate < DASHBOARD_CONSTANTS.hotChargeWarning,
            },
            {
              name: "煤气单耗",
              value: latestKpi.gas_consumption,
              unit: "GJ/t",
              trend: calculateTrend(
                latestKpi.gas_consumption,
                previousKpi?.gas_consumption
              ),
              // 如果煤气单耗超过1.2，显示警告
              warning:
                latestKpi.gas_consumption > DASHBOARD_CONSTANTS.gasConsumptionWarning,
            },
            {
              name: "质量封锁",
              value: latestKpi.quality_lock,
              unit: "卷",
              trend: calculateTrend(
                latestKpi.quality_lock,
                previousKpi?.quality_lock
              ),
              // 如果质量封锁超过50卷，显示警告
              warning:
                latestKpi.quality_lock > DASHBOARD_CONSTANTS.qualityLockWarning,
            },
            {
              name: "设备事故时间",
              value: latestKpi.device_downtime,
              unit: "小时",
              trend: calculateTrend(
                latestKpi.device_downtime,
                previousKpi?.device_downtime
              ),
              // 如果设备事故时间超过2小时，显示警告
              warning:
                latestKpi.device_downtime > DASHBOARD_CONSTANTS.deviceDowntimeWarning,
            },
            {
              name: "钢坯库存",
              value: latestKpi.inventory,
              unit: "万吨",
              trend: calculateTrend(
                latestKpi.inventory,
                previousKpi?.inventory
              ),
              // 如果钢坯库存低于0.5万吨，显示警告
              warning:
                latestKpi.inventory < DASHBOARD_CONSTANTS.inventoryLowWarning,
            },
          ];
        }

        // 处理趋势数据
        if (trendData.length > 0) {
          // 保存趋势数据
          this.trendData = trendData;
        }

        // 处理库存数据
        if (inventoryData.length > 0) {
          // 保存库存数据
          this.inventoryData = inventoryData;
        }

        // 处理缺陷数据
        if (defectData.length > 0) {
          // 保存缺陷数据
          this.defectData = defectData;
        }

        // 处理AI预警数据
        if (aiAlertsData.length > 0) {
          // 获取最新的预警数据
          const latestAlerts = aiAlertsData[aiAlertsData.length - 1];
          // 转换预警数据格式
          this.aiAlerts = latestAlerts.alerts.map((alert) => ({
            id: alert.id,
            // 根据预警类型转换为中文显示
            type:
              alert.type === "info"
                ? "预测信息"
                : alert.type === "warning"
                ? "预警"
                : "根因分析",
            content: alert.message,
            // 设置预警时间
            time: `${latestAlerts.date} 10:00:00`,
          }));
        }

        // 处理设备健康数据
        if (deviceHealthData.length > 0) {
          // 保存设备健康数据
          this.deviceData = deviceHealthData;
        }

        // 构建质量数据
        this.qualityData = kpiData.map((item) => ({
          date: item.date,
          quality_lock: item.quality_lock,
          yield_rate: item.yield_rate,
          device_downtime: item.device_downtime,
          device_type: item.device_type,
        }));

        // 构建能耗数据
        this.energyData = kpiData.map((item) => ({
          date: item.date,
          hot_charge_rate: item.hot_charge_rate,
          gas_consumption: item.gas_consumption,
          delivery: item.delivery,
        }));
      } catch (error) {
        // 捕获并输出错误信息
        console.error("获取数据失败:", error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
/* 仪表板主容器样式 */
.dashboard {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 120px minmax(0, 1fr) auto auto;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  .dashboard-section {
    min-width: 0;
  }

  .kpi-section {
    display: flex;
    gap: 16px;
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .alert-section {
    grid-column: 1 / -1;
    grid-row: 4;
  }

  .dashboard-header {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .dashboard-footer {
    grid-column: 1 / -1;
    grid-row: 5;
  }

  .panel {
    height: 100%;
    min-height: 0;
  }

  .left-panel {
    grid-column: 1;
    grid-row: 3;
  }

  .center-panel {
    grid-column: 2;
    grid-row: 3;
  }

  .right-panel {
    grid-column: 3;
    grid-row: 3;
  }
}

/* 全屏状态下的样式 */
:fullscreen .dashboard {
  height: 100vh;
  min-height: 100vh;
}

:-webkit-full-screen .dashboard {
  height: 100vh;
  min-height: 100vh;
}

:-moz-full-screen .dashboard {
  height: 100vh;
  min-height: 100vh;
}

:-ms-fullscreen .dashboard {
  height: 100vh;
  min-height: 100vh;
}
</style>
