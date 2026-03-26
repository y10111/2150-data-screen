<template>
  <div class="dashboard">
    <Header />
    <div class="kpi-row">
      <el-col :span="3" v-for="kpi in kpiList" :key="kpi.name">
        <KPICard :data="kpi" />
      </el-col>
    </div>
    <div class="main-area">
      <div class="left-panel">
        <dv-border-box-1>
          <LeftPanel />
        </dv-border-box-1>
      </div>
      <div class="center-panel">
        <dv-border-box-2>
          <CenterChart />
        </dv-border-box-2>
      </div>
      <div class="right-panel">
        <dv-border-box-3>
          <RightPanel />
        </dv-border-box-3>
      </div>
    </div>
    <AIAssistant />
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import KPICard from "@/components/KPICard.vue";
import LeftPanel from "@/components/LeftPanel.vue";
import CenterChart from "@/components/CenterChart.vue";
import RightPanel from "@/components/RightPanel.vue";
import AIAssistant from "@/components/AIAssistant.vue";

export default {
  name: "DataDashboard",
  components: {
    Header,
    Footer,
    KPICard,
    LeftPanel,
    CenterChart,
    RightPanel,
    AIAssistant,
  },
  data() {
    return {
      kpiList: [
        {
          name: "当日产量",
          value: 14276,
          unit: "吨",
          trend: 2.5,
          warning: false,
        },
        {
          name: "计划完成率",
          value: 99.6,
          unit: "%",
          trend: 0.5,
          warning: false,
        },
        {
          name: "成材率",
          value: 98.61,
          unit: "%",
          trend: -0.1,
          warning: false,
        },
        {
          name: "热装率",
          value: 52.42,
          unit: "%",
          trend: 1.2,
          warning: false,
        },
        {
          name: "煤气单耗",
          value: 1.24,
          unit: "GJ/t",
          trend: -0.03,
          warning: false,
        },
        {
          name: "质量封锁",
          value: 76,
          unit: "卷",
          trend: 8.5,
          warning: true,
        },
        {
          name: "设备事故时间",
          value: 2.09,
          unit: "小时",
          trend: 15.2,
          warning: true,
        },
        {
          name: "钢坯库存",
          value: 0.2739,
          unit: "万吨",
          trend: -2.1,
          warning: false,
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.dashboard {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;

  .kpi-row {
    display: flex;
    gap: 16px;
    height: 120px;
  }

  .main-area {
    flex: 1;
    display: flex;
    gap: 16px;

    .left-panel,
    .right-panel {
      flex: 1;
      height: 100%;
    }

    .center-panel {
      flex: 2;
      height: 100%;
    }
  }
}
</style>
