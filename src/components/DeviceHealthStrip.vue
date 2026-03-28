<template>
  <div class="health-section">
    <ModulePanelTitle>设备健康评分（今日）</ModulePanelTitle>
    <div v-if="!devices.length" class="health-empty">暂无设备健康数据</div>
    <div v-else class="panel-table">
      <div class="thead">
        <div class="tr tr-head">
          <span class="th">设备</span>
          <span class="th">状态</span>
          <span class="th th--stretch">备注</span>
          <span class="th th--num">评分</span>
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
            v-for="(d, idx) in marqueeDevices"
            :key="`${d.device}-${idx}`"
            class="tr tr-data"
          >
            <span class="td td--name" :title="d.device">{{ d.device }}</span>
            <span class="td td--status">{{ d.status }}</span>
            <span class="td td--hint" :title="d.history || ''">{{
              d.history || "—"
            }}</span>
            <span class="td td--score">{{ d.score }}</span>
            <span class="td td--flag">
              <SeverityStatusIcon
                :variant="flagVariant(d.score)"
                :label="flagLabel(d.score)"
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
  name: "DeviceHealthStrip",
  components: { ModulePanelTitle, SeverityStatusIcon },
  props: {
    deviceTimeline: {
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
    devices() {
      if (!this.deviceTimeline || !this.deviceTimeline.length) return [];
      const last = this.deviceTimeline[this.deviceTimeline.length - 1];
      return last?.devices || [];
    },
    marqueeDevices() {
      const a = this.devices;
      if (!a.length) return [];
      return [...a, ...a];
    },
    deviceCount() {
      return this.devices.length;
    },
    trackTransformStyle() {
      const n = this.deviceCount;
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
    devices: {
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
    /** 危险 / 警告 / 正常，与评分一致 */
    flagVariant(score) {
      const s = Number(score);
      if (s < 70) return "danger";
      if (s < 82) return "warning";
      return "ok";
    },
    flagLabel(score) {
      const s = Number(score);
      if (s < 70) return "危险";
      if (s < 82) return "警告";
      return "正常";
    },
    clearStepTimer() {
      if (this.stepTimer) {
        clearInterval(this.stepTimer);
        this.stepTimer = null;
      }
    },
    syncStepTimer() {
      this.clearStepTimer();
      const n = this.deviceCount;
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
      const n = this.deviceCount;
      if (n <= 1 || this.scrollPaused || this.reduceMotion) return;
      if (this.scrollStep >= n) return;
      const next = this.scrollStep + 1;
      if (next >= n) this.scrollStep = n;
      else this.scrollStep = next;
    },
    onTrackTransitionEnd(e) {
      if (e.propertyName !== "transform") return;
      const n = this.deviceCount;
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
/* 备注加宽；设备/状态/评分 三等分；标识固定 */
@grid-cols: 1fr 1fr 3fr 1fr 36px;
@border: rgba(90, 130, 180, 0.35);
@cell-pad: 0 5px;

.health-section {
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
}

.health-empty {
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
  text-transform: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;

  &--stretch {
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: @panel-legend-font-size;
  color: @panel-legend-color;

  &--name {
    font-weight: 600;
  }

  &--status {
    font-weight: 400;
  }

  &--hint {
    font-weight: 400;
  }

  &--score {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &--flag {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2px;
  }
}

</style>
