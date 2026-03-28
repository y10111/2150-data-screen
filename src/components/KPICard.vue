<template>
  <div class="kpi-card" :class="{ warning: isWarning }">
    <div class="kpi-title">{{ data.name }}</div>
    <div class="kpi-value">
      <span class="value">{{ data.value }}</span>
      <span class="unit">{{ data.unit }}</span>
    </div>
    <div v-if="valueNote" class="kpi-value-note">{{ valueNote }}</div>
    <div class="kpi-trend-row">
      <span class="trend-prefix">{{ trendBaselineText }}</span>
      <span class="trend" :class="trendClass">{{ trendPrimary }}</span>
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
    trendBaselineText() {
      return this.data.trendBaseline != null
        ? this.data.trendBaseline
        : "较昨日";
    },
    valueNote() {
      return this.data.valueNote || "";
    },
    trendPrimary() {
      if (this.data.trendDetail) return this.data.trendDetail;
      const t = this.data.trend;
      if (t === null || t === undefined || Number.isNaN(Number(t))) {
        return "—";
      }
      const n = Number(t);
      if (n === 0) return "→ 0.0%";
      return `${n > 0 ? "↑ " : "↓ "}${Math.abs(n).toFixed(1)}%`;
    },
    trendClass() {
      if (this.data.trendDetail || this.data.neutralTrend) return "neutral";
      const t = Number(this.data.trend);
      if (t === 0 || Number.isNaN(t)) return "neutral";
      return { up: t > 0, down: t < 0 };
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
    margin-bottom: 4px;

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

  .kpi-value-note {
    font-size: 11px;
    color: #6b7a94;
    margin-bottom: 6px;
    line-height: 1.3;
  }

  .kpi-trend-row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    gap: 0.35em;
    font-size: 12px;
    line-height: 1.35;
    white-space: nowrap;

    .trend-prefix {
      color: #6b7a94;
      flex-shrink: 0;
    }

    .trend {
      flex-shrink: 0;

      &.up {
        color: #4caf50;
      }

      &.down {
        color: #f44336;
      }

      &.neutral {
        color: #9eb1cc;
      }
    }

    .warning-icon {
      font-size: 13px;
      line-height: 1;
      flex-shrink: 0;
    }
  }
}
</style>
