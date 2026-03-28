<template>
  <div class="ai-assistant">
    <ModulePanelTitle>AI预警与建议</ModulePanelTitle>
    <div v-if="!displayAlerts.length" class="alerts-empty">暂无预警数据</div>
    <div v-else class="panel-table">
      <div class="thead">
        <div class="tr tr-head">
          <span class="th">类型</span>
          <span class="th th--stretch">摘要</span>
          <span class="th th--detail">详情</span>
          <span class="th th--time">时间</span>
          <span class="th th--flag">标识</span>
        </div>
      </div>
      <div
        class="tbody-viewport"
        @mouseenter="scrollPaused = true"
        @mouseleave="scrollPaused = false"
      >
        <div
          class="tbody-track"
          :class="{ 'tbody-track--no-trans': trackNoTrans }"
          :style="trackTransformStyle"
          @transitionend="onTrackTransitionEnd"
        >
          <div
            v-for="(alert, idx) in marqueeAlerts"
            :key="`${alert.id}-${idx}`"
            class="tr tr-data"
          >
            <span class="td td--type">{{ alert.type }}</span>
            <span class="td td--title" :title="alert.title || ''">{{
              alert.title || "—"
            }}</span>
            <span class="td td--detail">{{ alert.content }}</span>
            <span class="td td--time">{{ shortTime(alert.time) }}</span>
            <span class="td td--flag">
              <SeverityStatusIcon
                :variant="flagVariant(alert.type)"
                :label="flagLabel(alert.type)"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModulePanelTitle from "./ModulePanelTitle.vue";
import SeverityStatusIcon from "./SeverityStatusIcon.vue";
import { PANEL_TABLE_ROW_HEIGHT_PX } from "../constants/panelTableLayout";

const ROW_PX = PANEL_TABLE_ROW_HEIGHT_PX;
const STEP_HOLD_MS = 5000;
const STEP_TRANS_MS = 420;

export default {
  name: "AIAssistant",
  components: { ModulePanelTitle, SeverityStatusIcon },
  props: {
    alerts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      scrollStep: 0,
      trackNoTrans: false,
      scrollPaused: false,
      stepTimer: null,
      reduceMotion: false,
    };
  },
  computed: {
    displayAlerts() {
      return this.alerts.length > 0 ? this.alerts : [];
    },
    marqueeAlerts() {
      const a = this.displayAlerts;
      if (!a.length) return [];
      return [...a, ...a];
    },
    alertCount() {
      return this.displayAlerts.length;
    },
    trackTransformStyle() {
      const n = this.alertCount;
      if (!n) return {};
      const y = -this.scrollStep * ROW_PX;
      return {
        transform: `translateY(${y}px)`,
        transitionDuration: this.trackNoTrans ? "0ms" : `${STEP_TRANS_MS}ms`,
        transitionTimingFunction: "ease-out",
        transitionProperty: "transform",
      };
    },
  },
  watch: {
    displayAlerts: {
      handler() {
        this.resetStepScroll();
      },
      deep: true,
    },
    scrollPaused() {
      this.syncStepTimer();
    },
  },
  mounted() {
    this.reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.syncStepTimer();
  },
  beforeDestroy() {
    this.clearStepTimer();
  },
  methods: {
    /** 预警→危险 / 根因·RPA→警告 / 其余→正常 */
    flagVariant(type) {
      const t = String(type || "");
      if (t === "预警") return "danger";
      if (t === "根因分析" || t === "RPA状态") return "warning";
      return "ok";
    },
    flagLabel(type) {
      const t = String(type || "");
      if (t === "预警") return "危险";
      if (t === "根因分析" || t === "RPA状态") return "警告";
      return "正常";
    },
    shortTime(t) {
      if (!t || typeof t !== "string") return "—";
      const s = t.trim();
      if (s.length <= 12) return s;
      return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, "");
    },
    clearStepTimer() {
      if (this.stepTimer) {
        clearInterval(this.stepTimer);
        this.stepTimer = null;
      }
    },
    syncStepTimer() {
      this.clearStepTimer();
      const n = this.alertCount;
      if (!n || n <= 1 || this.reduceMotion) return;
      if (this.scrollPaused) return;
      this.stepTimer = setInterval(() => this.advanceScrollStep(), STEP_HOLD_MS);
    },
    resetStepScroll() {
      this.clearStepTimer();
      this.trackNoTrans = true;
      this.scrollStep = 0;
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          this.trackNoTrans = false;
          this.syncStepTimer();
        });
      });
    },
    advanceScrollStep() {
      const n = this.alertCount;
      if (n <= 1 || this.scrollPaused || this.reduceMotion) return;
      if (this.scrollStep >= n) return;
      const next = this.scrollStep + 1;
      if (next >= n) this.scrollStep = n;
      else this.scrollStep = next;
    },
    onTrackTransitionEnd(e) {
      if (e.propertyName !== "transform") return;
      const n = this.alertCount;
      if (n <= 1 || this.scrollStep !== n) return;
      this.trackNoTrans = true;
      this.scrollStep = 0;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.trackNoTrans = false;
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../styles/panelSectionLayout.less";
@import "../styles/panelTableTokens.less";

@row-h: @panel-table-row-height;
@head-h: 26px;
@visible-rows: 3;
/* 详情加宽；类型/摘要/时间 三等分（时间设最小宽）；标识固定 */
@grid-cols: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 3fr) minmax(76px, 1fr) 36px;
@border: rgba(90, 130, 180, 0.35);
@cell-pad: 0 5px;

.ai-assistant {
  .dashboard-panel-section-core();
  min-width: 0;
  padding: 8px 10px 10px;
  gap: 6px;
  background: transparent;
  border: none;
  box-shadow: none;

  :deep(.module-panel-title) {
    font-size: 13px;
    letter-spacing: 0.04em;
    margin-bottom: 2px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(80, 120, 170, 0.25);
    background: none;
  }

  .alerts-empty {
    flex: 1;
    min-height: (@head-h + @row-h * @visible-rows);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #7a8ca8;
    border: 1px dashed rgba(90, 120, 160, 0.35);
    border-radius: 8px;
    background: transparent;
  }

  .panel-table {
    display: flex;
    flex-direction: column;
    min-height: 0;
    width: 100%;
    border: 1px solid @border;
    border-radius: 8px;
    overflow: hidden;
    background: transparent;
    padding: 0 8px;
    box-sizing: border-box;
  }

  .thead {
    flex-shrink: 0;
    background: transparent;
    border-bottom: 1px solid @border;
  }

  .tr {
    display: grid;
    grid-template-columns: @grid-cols;
    align-items: center;
    column-gap: 8px;
    box-sizing: border-box;
    width: 100%;
  }

  .tr-head {
    height: @head-h;
    padding: @cell-pad;
  }

  .th {
    font-size: @panel-caption-font-size;
    font-weight: 700;
    color: @panel-caption-color;
    letter-spacing: 0.06em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;

    &--stretch,
    &--detail {
      min-width: 0;
    }
  }

  .tbody-viewport {
    position: relative;
    height: (@row-h * @visible-rows);
    overflow: hidden;
    flex-shrink: 0;

  }

  .tbody-track {
    display: flex;
    flex-direction: column;
    will-change: transform;

    &--no-trans {
      transition: none !important;
    }
  }

  .tr-data {
    height: @row-h;
    padding: @cell-pad;
    border-bottom: 1px solid rgba(80, 110, 150, 0.22);
    font-size: @panel-legend-font-size;
    color: @panel-legend-color;
  }

  .td {
    min-width: 0;
    text-align: center;
    font-size: @panel-legend-font-size;
    color: @panel-legend-color;

    &--type {
      font-weight: 600;
      line-height: 1.25;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &--title {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &--detail {
      font-weight: 400;
      line-height: 1.35;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &--time {
      font-weight: 400;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &--flag {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 2px;
    }
  }

}
</style>
