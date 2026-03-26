import Mock from "mockjs";
import kpiData from "./data/kpi.json";
import trendData from "./data/trend.json";
import inventoryData from "./data/inventory.json";
import defectData from "./data/defect.json";
import aiAlertsData from "./data/aiAlerts.json";
import deviceHealthData from "./data/deviceHealth.json";

Mock.setup({ timeout: "200-600" });

Mock.mock("/api/dashboard/kpi", "get", {
  code: 200,
  data: kpiData,
});

Mock.mock("/api/dashboard/trend", "get", {
  code: 200,
  data: trendData,
});

Mock.mock("/api/dashboard/inventory", "get", {
  code: 200,
  data: inventoryData,
});

Mock.mock("/api/dashboard/defect", "get", {
  code: 200,
  data: defectData,
});

Mock.mock("/api/dashboard/ai/alerts", "get", {
  code: 200,
  data: aiAlertsData,
});

Mock.mock("/api/dashboard/device/health", "get", {
  code: 200,
  data: deviceHealthData,
});
