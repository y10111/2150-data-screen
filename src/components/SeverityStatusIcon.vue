<template>
  <span
    class="sev-icon-wrap"
    :class="`sev-icon-wrap--${variant}`"
    role="img"
    :aria-label="label || undefined"
    :title="label || undefined"
  >
    <!-- 危险 / 警告：正三角形 + 叹号；正常：圆内对勾 -->
    <svg
      v-if="variant === 'danger' || variant === 'warning'"
      class="sev-icon-svg sev-icon-svg--hazard"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d="M12 4l9.5 16h-19L12 4z" />
      <rect class="sev-hazard-mark" x="11" y="9.5" width="2" height="5.5" rx="0.5" />
      <circle class="sev-hazard-mark" cx="12" cy="19" r="1.35" />
    </svg>
    <svg
      v-else
      class="sev-icon-svg sev-icon-svg--ok"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      />
    </svg>
  </span>
</template>

<script>
/** 危险（红三角）、警告（黄三角）、正常（绿圆勾）— 与工业/W 类警示图形习惯一致 */
export default {
  name: "SeverityStatusIcon",
  props: {
    variant: {
      type: String,
      required: true,
      validator: (v) => ["danger", "warning", "ok"].includes(v),
    },
    label: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
.sev-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 0;

  &--danger {
    .sev-icon-svg--hazard {
      color: #e53935;
      filter: drop-shadow(0 0 4px rgba(229, 57, 53, 0.55));
    }
    .sev-hazard-mark {
      fill: rgba(255, 255, 255, 0.92);
    }
  }

  &--warning {
    .sev-icon-svg--hazard {
      color: #fbc02d;
      filter: drop-shadow(0 0 4px rgba(251, 192, 45, 0.45));
    }
    .sev-hazard-mark {
      fill: rgba(26, 26, 26, 0.78);
    }
  }

  &--ok .sev-icon-svg {
    color: #43a047;
    filter: drop-shadow(0 0 4px rgba(67, 160, 71, 0.4));
  }
}

.sev-icon-svg {
  display: block;
  width: 15px;
  height: 15px;
}
</style>
