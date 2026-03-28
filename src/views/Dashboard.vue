<template>
  <main class="dashboard">
    <Header class="dashboard-header" />
    <section class="dashboard-section kpi-section">
      <el-col :span="3" v-for="kpi in kpiList" :key="kpi.name">
        <KPICard :data="kpi" />
      </el-col>
    </section>
    <div class="panel left-panel panel-stack">
      <dv-border-box-1 class="side-border-cell">
        <div class="side-border-inner">
          <DeviceAccidentChart :qualityData="qualityData" />
        </div>
      </dv-border-box-1>
      <dv-border-box-1 class="side-border-cell">
        <div class="side-border-inner">
          <QualityYieldChart
            :qualityData="qualityData"
            :defectData="defectData"
          />
        </div>
      </dv-border-box-1>
    </div>
    <PanelFrame class="panel center-panel" borderComponent="dv-border-box-2" stacked>
      <CenterChart :productionData="trendData" />
    </PanelFrame>
    <div class="panel right-panel panel-stack">
      <dv-border-box-1 class="side-border-cell">
        <div class="side-border-inner">
          <EnergyHotChargeChart :energyData="energyData" />
        </div>
      </dv-border-box-1>
      <dv-border-box-1 class="side-border-cell">
        <div class="side-border-inner">
          <InventoryDeliveryChart
            :inventoryData="inventoryData"
            :energyData="energyData"
          />
        </div>
      </dv-border-box-1>
    </div>
    <section class="dashboard-section ai-row-section">
      <div class="ai-row-grid">
        <dv-border-box-7 class="ai-border-cell">
          <div class="ai-border-inner">
            <DeviceHealthStrip :deviceTimeline="deviceData" />
          </div>
        </dv-border-box-7>
        <dv-border-box-7 class="ai-border-cell">
          <div class="ai-border-inner">
            <AIAssistant :alerts="aiAlerts" />
          </div>
        </dv-border-box-7>
      </div>
    </section>
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
import DeviceHealthStrip from "@/components/DeviceHealthStrip.vue";
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
    DeviceHealthStrip,
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
  methods: {
    mapAiAlertType(type) {
      const t = String(type || "").toLowerCase();
      if (t === "info") return "预测信息";
      if (t === "warning") return "预警";
      if (t === "alert") return "根因分析";
      if (t === "suggestion" || t === "optimize") return "优化建议";
      return "预警";
    },
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
        // KPI 等仍走 Mock/代理；任一路失败不再拖死整屏（Promise.all 会全挂）
        const settled = await Promise.allSettled([
          dashboardApi.getKpiData(),
          dashboardApi.getTrendData(),
          dashboardApi.getInventoryData(),
          dashboardApi.getDefectData(),
          dashboardApi.getDeviceHealth(),
        ]);
        const pickSettled = (idx, label) => {
          const r = settled[idx];
          if (r.status === "fulfilled") return r.value;
          console.warn(
            `[Dashboard] ${label} 请求失败:`,
            r.reason && r.reason.message ? r.reason.message : r.reason
          );
          return null;
        };
        const kpiRes = pickSettled(0, "kpi");
        const trendRes = pickSettled(1, "trend");
        const inventoryRes = pickSettled(2, "inventory");
        const defectRes = pickSettled(3, "defect");
        const deviceHealthRes = pickSettled(4, "deviceHealth");

        const loadMockData = (key) => {
          try {
            const mod =
              {
                daily: require("@/mock/data/dailyOperations.json"),
                inventory: require("@/mock/data/inventoryTimeline.json"),
                defect: require("@/mock/data/qualityDefects.json"),
                device: require("@/mock/data/deviceHealthTimeline.json"),
              }[key];
            return Array.isArray(mod && mod.data) ? mod.data : [];
          } catch (_) {
            return [];
          }
        };

        let kpiData = this.normalizeListResponse(kpiRes);
        let trendData = this.normalizeListResponse(trendRes);
        let inventoryData = this.normalizeListResponse(inventoryRes);
        let defectData = this.normalizeListResponse(defectRes);
        let deviceHealthData = this.normalizeListResponse(deviceHealthRes);

        if (!kpiData.length) kpiData = loadMockData("daily");
        if (!trendData.length) {
          trendData = kpiData.length ? kpiData : loadMockData("daily");
        }
        if (!inventoryData.length) inventoryData = loadMockData("inventory");
        if (!defectData.length) defectData = loadMockData("defect");
        if (!deviceHealthData.length) deviceHealthData = loadMockData("device");

        // 处理KPI数据
        if (kpiData.length > 0) {
          // 获取最新的KPI数据（数组最后一个元素）
          const latestKpi = kpiData[kpiData.length - 1];
          // 获取前一天的KPI数据（数组倒数第二个元素），用于计算趋势
          const previousKpi = kpiData[kpiData.length - 2];

          // 环比：与 KPI 序列中「上一日」对比，展示统一标注「较昨日」
          const calculateTrend = (current, previous) => {
            if (previous === undefined || previous === null) return 0;
            const p = Number(previous);
            const c = Number(current);
            if (!Number.isFinite(p) || Math.abs(p) < 1e-12) return 0;
            return +(((c - p) / p) * 100).toFixed(1);
          };

          const invCurrN = Number(latestKpi.inventory);
          const invPrevRaw = previousKpi?.inventory;
          const invPrevN =
            invPrevRaw !== undefined && invPrevRaw !== null
              ? Number(invPrevRaw)
              : null;
          const invMoMMinBase =
            DASHBOARD_CONSTANTS.inventoryMoMPercentMinBase;
          let invTrendDetail = null;
          let invTrend = calculateTrend(latestKpi.inventory, invPrevRaw);
          if (
            invPrevN != null &&
            Number.isFinite(invPrevN) &&
            Math.abs(invPrevN) < invMoMMinBase
          ) {
            const dWan = invCurrN - invPrevN;
            const dTons = Math.round(dWan * 10000);
            invTrendDetail = `${dTons >= 0 ? "↑ " : "↓ "}${Math.abs(
              dTons
            )} 吨`;
            invTrend = 0;
          }
          const invTonsDisplay =
            Number.isFinite(invCurrN) && invCurrN >= 0
              ? String(Math.round(invCurrN * 10000))
              : "—";

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
              trendBaseline: "较昨日",
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
              trendBaseline: "较昨日",
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
              trendBaseline: "较昨日",
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
              trendBaseline: "较昨日",
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
              trendBaseline: "较昨日",
              warning:
                latestKpi.gas_consumption >
                DASHBOARD_CONSTANTS.gasConsumptionWarning,
            },
            {
              name: "质量封锁",
              value: latestKpi.quality_lock,
              unit: "卷",
              trend: calculateTrend(
                latestKpi.quality_lock,
                previousKpi?.quality_lock
              ),
              trendBaseline: "较昨日",
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
              trendBaseline: "较昨日",
              warning:
                latestKpi.device_downtime >
                DASHBOARD_CONSTANTS.deviceDowntimeWarning,
            },
            {
              name: "钢坯库存",
              value: invTonsDisplay,
              unit: "吨",
              trend: invTrendDetail ? 0 : invTrend,
              trendDetail: invTrendDetail || undefined,
              trendBaseline: "较昨日",
              neutralTrend: true,
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

        // AI 预警必须放在 KPI/图表之后：本地 Qwen 推理可能数分钟，先前 await 会导致整屏空白
        let aiAlertsData = [];
        try {
          const aiAlertsRes = await dashboardApi.getAiAlerts();
          aiAlertsData = this.normalizeListResponse(aiAlertsRes);
        } catch (e) {
          console.warn(
            "[AI] 本地预警服务不可用（请启动 screen_ai_service :5001）:",
            e && e.message ? e.message : e
          );
        }
        if (!aiAlertsData.length) {
          try {
            const raw = require("@/mock/data/aiAlertTimeline.json");
            const arr = Array.isArray(raw.data) ? raw.data : [];
            if (arr.length) aiAlertsData = [arr[arr.length - 1]];
          } catch (_) {
            /* ignore */
          }
        }
        if (aiAlertsData.length > 0) {
          const latestAlerts = aiAlertsData[aiAlertsData.length - 1];
          const rawAlerts = latestAlerts && latestAlerts.alerts;
          const list = Array.isArray(rawAlerts) ? rawAlerts : [];
          this.aiAlerts = list.map((alert) => ({
            id: alert.id,
            type: this.mapAiAlertType(alert.type),
            title: alert.title || "",
            content: alert.message,
            time: `${latestAlerts.date} 10:00:00`,
          }));
        }
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
  /* 第四行限高，避免挤压中间产量主图区域 */
  grid-template-rows: auto 120px minmax(0, 1fr) minmax(0, min(200px, 28vh)) auto;
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

  .ai-row-section {
    grid-column: 1 / -1;
    grid-row: 4;
    min-height: 0;
    max-height: min(200px, 28vh);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ai-row-grid {
    display: grid;
    /* 设备健康 / AI 预警 同宽，各占一半 */
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
    flex: 1;
    min-height: 0;
    width: 100%;
    align-items: stretch;
    height: 100%;
    overflow: hidden;
  }

  .ai-border-cell {
    min-width: 0;
    min-height: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .ai-border-inner {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 4px 6px 8px;
    box-sizing: border-box;
  }

  .ai-border-inner :deep(.health-section),
  .ai-border-inner :deep(.ai-assistant) {
    flex: 1;
    min-height: 0;
  }

  .ai-border-cell :deep(.border-box-content) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /* 左/右栏：各子模块单独 dv-border-box-1 */
  .panel-stack {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
  }

  .side-border-cell {
    flex: 1;
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .side-border-inner {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 8px 10px 12px;
    box-sizing: border-box;
  }

  .side-border-cell :deep(.border-box-content) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .side-border-inner :deep(.panel-section) {
    flex: 1;
    min-height: 0;
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
