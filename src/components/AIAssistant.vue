<template>
  <div class="ai-assistant">
    <h3 class="assistant-title">AI智能预警与建议</h3>
    <div class="alerts-container">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert-item"
        :class="alert.type"
      >
        <div class="alert-type">{{ alert.type }}</div>
        <div class="alert-content">{{ alert.content }}</div>
        <div class="alert-time">{{ alert.time }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AIAssistant",
  props: {
    alerts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      defaultAlerts: [
        {
          id: 1,
          type: "预警",
          content: "当前产量落后计划8%，建议检查卷取机状态",
          time: "2026-03-26 10:30:00",
        },
        {
          id: 2,
          type: "根因分析",
          content: "近期欠产主要与待热时间增加有关，建议优化加热炉节奏",
          time: "2026-03-26 09:15:00",
        },
        {
          id: 3,
          type: "优化建议",
          content:
            "热装率偏低，预计明日煤气单耗将上升0.05 GJ/t，建议调整装炉节奏",
          time: "2026-03-26 08:45:00",
        },
        {
          id: 4,
          type: "预测信息",
          content: "明日产量预测：14400-14600吨",
          time: "2026-03-26 08:00:00",
        },
        {
          id: 5,
          type: "RPA状态",
          content: "今日调度会汇报已自动生成",
          time: "2026-03-26 07:30:00",
        },
      ],
    };
  },
  computed: {
    displayAlerts() {
      return this.alerts.length > 0 ? this.alerts : this.defaultAlerts;
    },
  },
};
</script>

<style lang="less" scoped>
.ai-assistant {
  background-color: rgba(21, 30, 44, 0.8);
  border: 1px solid #2a3a4a;
  border-radius: 8px;
  padding: 16px;
  height: 250px;

  .assistant-title {
    font-size: 16px;
    font-weight: bold;
    color: #e6e9f0;
    margin: 0 0 16px 0;
  }

  .alerts-container {
    height: calc(100% - 40px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .alert-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      border-left: 4px solid #2d8cff;

      &.预警 {
        border-left-color: #f44336;
      }

      &.根因分析 {
        border-left-color: #ff9800;
      }

      &.优化建议 {
        border-left-color: #4caf50;
      }

      &.预测信息 {
        border-left-color: #2d8cff;
      }

      &.RPA状态 {
        border-left-color: #9c27b0;
      }

      .alert-type {
        font-size: 12px;
        font-weight: bold;
        color: #e6e9f0;
        min-width: 60px;
      }

      .alert-content {
        flex: 1;
        font-size: 14px;
        color: #e6e9f0;
        line-height: 1.4;
      }

      .alert-time {
        font-size: 12px;
        color: #8c9ab3;
        white-space: nowrap;
      }
    }
  }
}
</style>
