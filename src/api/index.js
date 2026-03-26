import request from "../utils/request";

export const dashboardApi = {
  // 获取KPI数据
  getKpiData: () => request.get("/dashboard/kpi"),
  // 获取趋势数据
  getTrendData: () => request.get("/dashboard/trend"),
  // 获取库存数据
  getInventoryData: () => request.get("/dashboard/inventory"),
  // 获取缺陷数据
  getDefectData: () => request.get("/dashboard/defect"),
  // 获取AI预警数据
  getAiAlerts: () => request.get("/dashboard/ai/alerts"),
  // 获取设备健康数据
  getDeviceHealth: () => request.get("/dashboard/device/health"),
};
