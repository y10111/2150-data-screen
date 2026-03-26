<template>
  <div class="kpi-card" :class="{ warning: isWarning }">
    <div class="kpi-title">{{ data.name }}</div>
    <div class="kpi-value">
      <span class="value">{{ data.value }}</span>
      <span class="unit">{{ data.unit }}</span>
    </div>
    <div class="kpi-trend">
      <span class="trend" :class="{ up: data.trend > 0, down: data.trend < 0 }">
        {{ data.trend > 0 ? "↑" : "↓" }}{{ Math.abs(data.trend) }}%
      </span>
      <span v-if="isWarning" class="warning-icon">⚠️</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "KPICard",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isWarning() {
      return this.data.warning || false;
    },
  },
};
</script>

<style lang="less" scoped>
.kpi-card {
  background-color: rgba(21, 30, 44, 0.8);
  border: 1px solid #2a3a4a;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 10px rgba(45, 140, 255, 0.5);
    transform: translateY(-2px);
  }

  &.warning {
    background-color: rgba(244, 67, 54, 0.2);
    border-color: #f44336;
  }

  .kpi-title {
    font-size: 14px;
    color: #8c9ab3;
    margin-bottom: 8px;
  }

  .kpi-value {
    margin-bottom: 8px;

    .value {
      font-size: 24px;
      font-weight: bold;
      color: #e6e9f0;
    }

    .unit {
      font-size: 14px;
      color: #8c9ab3;
      margin-left: 4px;
    }
  }

  .kpi-trend {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .trend {
      font-size: 12px;

      &.up {
        color: #4caf50;
      }

      &.down {
        color: #f44336;
      }
    }

    .warning-icon {
      font-size: 14px;
    }
  }
}
</style>
