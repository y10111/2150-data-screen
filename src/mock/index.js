import Mock from "mockjs";
import dailyOperationsData from "./data/dailyOperations.json";
import inventoryTimelineData from "./data/inventoryTimeline.json";
import qualityDefectsData from "./data/qualityDefects.json";
import aiAlertTimelineData from "./data/aiAlertTimeline.json";
import deviceHealthTimelineData from "./data/deviceHealthTimeline.json";

// Mock.setup({ timeout: "200-600" });

Mock.mock("/api/dashboard/kpi", "get", {
  code: 200,
  data: dailyOperationsData,
});

Mock.mock("/api/dashboard/trend", "get", {
  code: 200,
  data: dailyOperationsData,
});

Mock.mock("/api/dashboard/inventory", "get", {
  code: 200,
  data: inventoryTimelineData,
});

Mock.mock("/api/dashboard/defect", "get", {
  code: 200,
  data: qualityDefectsData,
});

Mock.mock("/api/dashboard/ai/alerts", "get", {
  code: 200,
  data: aiAlertTimelineData,
});

Mock.mock("/api/dashboard/device/health", "get", {
  code: 200,
  data: deviceHealthTimelineData,
});
