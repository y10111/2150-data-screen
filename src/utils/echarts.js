export const darkTheme = {
  backgroundColor: "#0a0f1c",
  textStyle: { color: "#e6e9f0" },
  title: { textStyle: { color: "#e6e9f0" } },
  tooltip: { backgroundColor: "rgba(21,30,44,0.9)" },
  grid: { borderWidth: 0 },
  xAxis: {
    axisLine: { lineStyle: { color: "#8c9ab3" } },
    axisLabel: { color: "#8c9ab3" },
  },
  yAxis: {
    axisLine: { lineStyle: { color: "#8c9ab3" } },
    axisLabel: { color: "#8c9ab3" },
  },
  legend: {
    textStyle: { color: "#9eb1cc", fontSize: 11 },
  },
};

/** 侧栏小图统一：tooltip / 轴线观感 */
export const panelTooltipItem = {
  trigger: "item",
  backgroundColor: "rgba(18, 26, 38, 0.96)",
  borderColor: "rgba(74, 112, 148, 0.5)",
  borderWidth: 1,
  padding: [10, 14],
  textStyle: { color: "#e8ecf4", fontSize: 12 },
  extraCssText:
    "box-shadow: 0 10px 28px rgba(0,0,0,0.4); border-radius: 8px;",
};

export const panelTooltipAxis = {
  trigger: "axis",
  backgroundColor: "rgba(18, 26, 38, 0.96)",
  borderColor: "rgba(74, 112, 148, 0.5)",
  borderWidth: 1,
  padding: [10, 14],
  textStyle: { color: "#e8ecf4", fontSize: 12 },
  extraCssText:
    "box-shadow: 0 10px 28px rgba(0,0,0,0.4); border-radius: 8px;",
};

export const panelAxisPointerLine = {
  type: "line",
  lineStyle: { color: "rgba(45, 140, 255, 0.35)", width: 1 },
  crossStyle: { color: "rgba(45, 140, 255, 0.35)" },
};

export const panelSplitLine = {
  lineStyle: { color: "rgba(255,255,255,0.07)", type: "dashed" },
};

export const panelXAxisCategory = {
  axisTick: { show: false },
  axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
  axisLabel: { color: "#9aa8bf", fontSize: 11 },
};

/** 题注：白色系、全站统一字号（主行加粗 / 副行常规） */
export const PANEL_CAPTION_FONT_SIZE = 11;
export const PANEL_CAPTION_COLOR = "#e8eaef";

export const panelTitleModule = {
  textStyle: {
    color: PANEL_CAPTION_COLOR,
    fontSize: PANEL_CAPTION_FONT_SIZE,
    fontWeight: "bold",
  },
  subtextStyle: {
    color: PANEL_CAPTION_COLOR,
    fontSize: PANEL_CAPTION_FONT_SIZE,
    fontWeight: "normal",
  },
};

/** 图例文字：非白色（与曲线区分）、全站统一字号 */
export const PANEL_LEGEND_FONT_SIZE = 11;
export const PANEL_LEGEND_TEXT_COLOR = "#9eb1cc";

/** 模块标题统一放左上角 */
export const panelTitleTopLeft = {
  left: 8,
  top: 6,
  textAlign: "left",
};

/**
 * 子图题注：图表正下方水平居中。
 * 勿设置 title.textAlign：ECharts 在 textAlign 已指定时会跳过 layoutRect.x 的居中修正，
 * 题注会以布局框左缘为锚点画「水平居中」文字，左侧会被裁掉。
 * 仅保留 left: "center"，由组件根据 left 推导 textAlign 并修正锚点。
 */
export const panelCaptionBottomCenter = {
  left: "center",
  bottom: 6,
  padding: [2, 10, 2, 10],
};

/**
 * 勿设置全局 icon：否则每个图例项都会继承该形状，ECharts 会跳过线系列的 getLegendIcon，
 * 图例无法随 series.lineStyle 显示实线/虚线。柱图请在 legend.data 项上设 icon: 'rect'，
 * 饼图请在 legend 上设 icon: 'circle'。
 */
export const panelLegendStandard = {
  itemGap: 10,
  itemWidth: 10,
  itemHeight: 6,
  textStyle: {
    color: PANEL_LEGEND_TEXT_COLOR,
    fontSize: PANEL_LEGEND_FONT_SIZE,
  },
};

/**
 * 时间类 X 轴统一为 月/日（如 3/28）。
 * 对 YYYY-MM-DD 按本地日历解析，避免仅日期串被当作 UTC 导致差一天。
 */
export function formatAxisDateMd(dateText) {
  if (dateText == null || dateText === "") return "";
  if (dateText instanceof Date) {
    const d = dateText;
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }
  if (typeof dateText === "string") {
    const m = dateText.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]);
      const day = Number(m[3]);
      const d = new Date(y, mo - 1, day);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }
  }
  const d = new Date(dateText);
  if (Number.isNaN(d.getTime())) return String(dateText);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
