export const DASHBOARD_CONSTANTS = {
  // KPI 阈值
  yieldWarning: 98, // 成材率低于该值告警（%）
  completionWarning: 100, // 计划完成率低于该值告警（%）
  hotChargeWarning: 50, // 热装率低于该值告警（%）
  gasConsumptionWarning: 1.2, // 煤气单耗高于该值告警（GJ/t）
  qualityLockWarning: 50, // 质量封锁超过该卷数告警（卷）
  deviceDowntimeWarning: 2, // 设备事故时间超过该值告警（小时）
  inventoryLowWarning: 0.5, // 钢坯库存低于该值告警（万吨）
  /** 环比百分比：基期库存（万吨）低于此值时 KPI 改示「↑↓Δ 万吨」，避免小基数下百分比失真 */
  inventoryMoMPercentMinBase: 0.05,

  // 能耗目标 / 安全线
  hotChargeTarget: 60, // 热装率目标（%）
  gasConsumptionTarget: 1.1, // 煤气单耗目标（GJ/t）

  // 库存安全线
  inventorySafetyLine: 1.5, // 钢坯库存安全线（万吨）
};

