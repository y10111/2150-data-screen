<template>
  <!-- 仪表板主容器 -->
  <div class="dashboard">
    <!-- 顶部导航栏组件 -->
    <Header />
    <!-- KPI指标卡片行，显示8个关键绩效指标 -->
    <div class="kpi-row">
      <!-- 循环渲染KPI卡片，每个卡片占据3列宽度 -->
      <el-col :span="3" v-for="kpi in kpiList" :key="kpi.name">
        <!-- KPI卡片组件，传入单个KPI数据 -->
        <KPICard :data="kpi" />
      </el-col>
    </div>
    <!-- 主内容区域，包含左中右三个面板 -->
    <div class="main-area">
      <!-- 左侧面板：设备与事故分析、质量与成材分析 -->
      <div class="left-panel">
        <!-- 边框装饰组件1 -->
        <dv-border-box-1>
          <!-- 左侧面板组件，传入设备数据和质量数据 -->
          <LeftPanel :deviceData="deviceData" :qualityData="qualityData" />
        </dv-border-box-1>
      </div>
      <!-- 中间面板：产量趋势分析 -->
      <div class="center-panel">
        <!-- 边框装饰组件2 -->
        <dv-border-box-2>
          <!-- 中间图表组件，传入生产趋势数据 -->
          <CenterChart :productionData="trendData" />
        </dv-border-box-2>
      </div>
      <!-- 右侧面板：能耗与热装分析、库存与缴库分析 -->
      <div class="right-panel">
        <!-- 边框装饰组件3 -->
        <dv-border-box-3>
          <!-- 右侧面板组件，传入能耗数据和库存数据 -->
          <RightPanel :energyData="energyData" :inventoryData="inventoryData" />
        </dv-border-box-3>
      </div>
    </div>
    <!-- AI智能预警与建议组件，传入预警数据 -->
    <AIAssistant :alerts="aiAlerts" />
    <!-- 底部信息栏组件 -->
    <Footer />
  </div>
</template>

<script>
// 导入顶部导航栏组件
import Header from "@/components/Header.vue";
// 导入底部信息栏组件
import Footer from "@/components/Footer.vue";
// 导入KPI指标卡片组件
import KPICard from "@/components/KPICard.vue";
// 导入左侧面板组件
import LeftPanel from "@/components/LeftPanel.vue";
// 导入中间图表组件
import CenterChart from "@/components/CenterChart.vue";
// 导入右侧面板组件
import RightPanel from "@/components/RightPanel.vue";
// 导入AI智能预警组件
import AIAssistant from "@/components/AIAssistant.vue";
// 导入仪表板API接口
import { dashboardApi } from "@/api";

export default {
  name: "DataDashboard",
  // 注册子组件
  components: {
    Header,
    Footer,
    KPICard,
    LeftPanel,
    CenterChart,
    RightPanel,
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

        // 处理KPI数据
        // 检查请求是否成功且返回的数据数组不为空
        if (kpiRes.code === 200 && kpiRes.data.length > 0) {
          // 获取最新的KPI数据（数组最后一个元素）
          const latestKpi = kpiRes.data[kpiRes.data.length - 1];
          // 获取前一天的KPI数据（数组倒数第二个元素），用于计算趋势
          const previousKpi = kpiRes.data[kpiRes.data.length - 2];

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
              warning: latestKpi.yield_rate < 98,
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
              warning: latestKpi.hot_charge_rate < 50,
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
              warning: latestKpi.gas_consumption > 1.2,
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
              warning: latestKpi.quality_lock > 50,
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
              warning: latestKpi.device_downtime > 2,
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
              warning: latestKpi.inventory < 0.5,
            },
          ];
        }

        // 处理趋势数据
        if (trendRes.code === 200) {
          // 保存趋势数据
          this.trendData = trendRes.data;
        }

        // 处理库存数据
        if (inventoryRes.code === 200) {
          // 保存库存数据
          this.inventoryData = inventoryRes.data;
        }

        // 处理缺陷数据
        if (defectRes.code === 200) {
          // 保存缺陷数据
          this.defectData = defectRes.data;
        }

        // 处理AI预警数据
        if (aiAlertsRes.code === 200 && aiAlertsRes.data.length > 0) {
          // 获取最新的预警数据
          const latestAlerts = aiAlertsRes.data[aiAlertsRes.data.length - 1];
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
        if (deviceHealthRes.code === 200) {
          // 保存设备健康数据
          this.deviceData = deviceHealthRes.data;
        }

        // 构建质量数据
        this.qualityData = kpiRes.data.map((item) => ({
          date: item.date,
          quality_lock: item.quality_lock,
          yield_rate: item.yield_rate,
        }));

        // 构建能耗数据
        this.energyData = kpiRes.data.map((item) => ({
          date: item.date,
          hot_charge_rate: item.hot_charge_rate,
          gas_consumption: item.gas_consumption,
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  /* KPI指标卡片行样式 */
  .kpi-row {
    display: flex;
    gap: 16px;
    height: 120px;
    flex-shrink: 0;
  }

  /* 主内容区域样式 */
  .main-area {
    flex: 1;
    display: flex;
    gap: 16px;
    min-height: 0;

    /* 左右面板样式 */
    .left-panel,
    .right-panel {
      flex: 1;
      height: 100%;
      min-height: 0;
    }

    /* 中间面板样式 */
    .center-panel {
      flex: 2;
      height: 100%;
      min-height: 0;
    }
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
