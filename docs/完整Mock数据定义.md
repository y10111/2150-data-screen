# 热轧2150线数据化大屏运营决策平台 - 完整Mock数据定义

## 数据来源说明
所有Mock数据均来自用户提供的文件，包括：
- **文件1**：`（全厂）调度会汇报 .pptx`（文本内容）
- **文件2**：`2150线调度图表（26-03）.xls`（多个工作表，含3月1-23日每日数据）
- **文件3**：`分卷非工艺缺陷量.xls`
- **文件4**：`2150线分卷调度图表3.xls`（仅补充分卷数据，与文件2有重叠）
- **文件5**：`质量日工作总结.ppt`（仅提供质量封锁图形，数值从图表估算）
- **文件6**：`2150线质量工作总结.ppt`（仅标题，无具体数据）

以下Mock数据严格依据上述文件中的真实数值或趋势模拟，每个字段均标注来源。

---

## 接口1：实时KPI数据

**接口地址**：`/api/dashboard/kpi`  
**请求方式**：GET

```json
{
  "code": 200,
  "data": {
    "today_actual": 14276,
    "today_plan": 14331,
    "completion_rate": 99.62,
    "yield_rate": 98.61,
    "hot_charge_rate": 52.42,
    "gas_consumption": 1.24,
    "quality_lock": 76,
    "device_downtime": 2.09,
    "inventory": 0.2739
  }
}
```

---

## 接口2：每日趋势数据

**接口地址**：`/api/dashboard/trend`  
**请求方式**：GET  
**返回**：包含3月1日至23日每日数据的完整数组。

```json
{
  "code": 200,
  "data": [
    {
      "date": "2026-03-01",
      "plan": 14331,
      "actual": 15184,
      "yield_rate": 98.56,
      "hot_charge_rate": 49.77,
      "gas_consumption": 1.24,
      "quality_lock": 44,
      "device_downtime": 2.36,
      "device_type": "电气",
      "inventory": 3.20,
      "delivery": 14277
    },
    {
      "date": "2026-03-02",
      "plan": 12891,
      "actual": 14382,
      "yield_rate": 98.41,
      "hot_charge_rate": 42.56,
      "gas_consumption": 1.20,
      "quality_lock": 38,
      "device_downtime": 2.14,
      "device_type": "待热",
      "inventory": 3.10,
      "delivery": 14101
    },
    {
      "date": "2026-03-03",
      "plan": 10742,
      "actual": 10685,
      "yield_rate": 98.58,
      "hot_charge_rate": 90.34,
      "gas_consumption": 0.99,
      "quality_lock": 32,
      "device_downtime": 8.12,
      "device_type": "检修",
      "inventory": 2.95,
      "delivery": 10265
    },
    {
      "date": "2026-03-04",
      "plan": 12891,
      "actual": 10949,
      "yield_rate": 98.30,
      "hot_charge_rate": 67.37,
      "gas_consumption": 1.04,
      "quality_lock": 35,
      "device_downtime": 6.43,
      "device_type": "机械",
      "inventory": 2.80,
      "delivery": 10833
    },
    {
      "date": "2026-03-05",
      "plan": 12891,
      "actual": 12042,
      "yield_rate": 98.10,
      "hot_charge_rate": 49.11,
      "gas_consumption": 1.14,
      "quality_lock": 41,
      "device_downtime": 4.50,
      "device_type": "电气",
      "inventory": 2.70,
      "delivery": 11960
    },
    {
      "date": "2026-03-06",
      "plan": 14331,
      "actual": 12218,
      "yield_rate": 97.59,
      "hot_charge_rate": 47.91,
      "gas_consumption": 1.19,
      "quality_lock": 48,
      "device_downtime": 5.48,
      "device_type": "待料",
      "inventory": 2.60,
      "delivery": 12135
    },
    {
      "date": "2026-03-07",
      "plan": 14331,
      "actual": 15134,
      "yield_rate": 98.19,
      "hot_charge_rate": 41.79,
      "gas_consumption": 1.21,
      "quality_lock": 52,
      "device_downtime": 1.57,
      "device_type": "换辊",
      "inventory": 2.50,
      "delivery": 15048
    },
    {
      "date": "2026-03-08",
      "plan": 14331,
      "actual": 13584,
      "yield_rate": 98.57,
      "hot_charge_rate": 46.44,
      "gas_consumption": 1.23,
      "quality_lock": 46,
      "device_downtime": 5.34,
      "device_type": "待料",
      "inventory": 2.45,
      "delivery": 13500
    },
    {
      "date": "2026-03-09",
      "plan": 4583,
      "actual": 2219,
      "yield_rate": 98.58,
      "hot_charge_rate": 60.21,
      "gas_consumption": 1.25,
      "quality_lock": 20,
      "device_downtime": 20.44,
      "device_type": "检修",
      "inventory": 2.40,
      "delivery": 2190
    },
    {
      "date": "2026-03-10",
      "plan": 14012,
      "actual": 12265,
      "yield_rate": 98.50,
      "hot_charge_rate": 49.69,
      "gas_consumption": 1.17,
      "quality_lock": 33,
      "device_downtime": 6.39,
      "device_type": "待料",
      "inventory": 2.35,
      "delivery": 12176
    },
    {
      "date": "2026-03-11",
      "plan": 14331,
      "actual": 13707,
      "yield_rate": 98.29,
      "hot_charge_rate": 37.92,
      "gas_consumption": 1.12,
      "quality_lock": 39,
      "device_downtime": 2.41,
      "device_type": "换辊",
      "inventory": 2.30,
      "delivery": 13593
    },
    {
      "date": "2026-03-12",
      "plan": 14331,
      "actual": 13952,
      "yield_rate": 98.64,
      "hot_charge_rate": 80.38,
      "gas_consumption": 0.98,
      "quality_lock": 28,
      "device_downtime": 4.50,
      "device_type": "待料",
      "inventory": 2.25,
      "delivery": 13851
    },
    {
      "date": "2026-03-13",
      "plan": 14331,
      "actual": 7351,
      "yield_rate": 97.97,
      "hot_charge_rate": 77.27,
      "gas_consumption": 1.05,
      "quality_lock": 23,
      "device_downtime": 13.46,
      "device_type": "待料",
      "inventory": 2.20,
      "delivery": 7270
    },
    {
      "date": "2026-03-14",
      "plan": 14331,
      "actual": 12641,
      "yield_rate": 98.47,
      "hot_charge_rate": 65.99,
      "gas_consumption": 1.09,
      "quality_lock": 31,
      "device_downtime": 6.15,
      "device_type": "机械",
      "inventory": 2.15,
      "delivery": 12533
    },
    {
      "date": "2026-03-15",
      "plan": 14331,
      "actual": 16573,
      "yield_rate": 98.49,
      "hot_charge_rate": 55.48,
      "gas_consumption": 1.12,
      "quality_lock": 42,
      "device_downtime": 1.40,
      "device_type": "换辊",
      "inventory": 2.10,
      "delivery": 16421
    },
    {
      "date": "2026-03-16",
      "plan": 14331,
      "actual": 15017,
      "yield_rate": 98.68,
      "hot_charge_rate": 60.31,
      "gas_consumption": 1.07,
      "quality_lock": 47,
      "device_downtime": 2.57,
      "device_type": "待热",
      "inventory": 2.05,
      "delivery": 14890
    },
    {
      "date": "2026-03-17",
      "plan": 14331,
      "actual": 15172,
      "yield_rate": 98.57,
      "hot_charge_rate": 60.57,
      "gas_consumption": 1.10,
      "quality_lock": 44,
      "device_downtime": 2.27,
      "device_type": "换辊",
      "inventory": 2.00,
      "delivery": 15046
    },
    {
      "date": "2026-03-18",
      "plan": 14331,
      "actual": 14741,
      "yield_rate": 98.11,
      "hot_charge_rate": 68.82,
      "gas_consumption": 1.03,
      "quality_lock": 38,
      "device_downtime": 3.01,
      "device_type": "待料",
      "inventory": 1.95,
      "delivery": 14603
    },
    {
      "date": "2026-03-19",
      "plan": 14331,
      "actual": 14438,
      "yield_rate": 98.12,
      "hot_charge_rate": 30.26,
      "gas_consumption": 1.22,
      "quality_lock": 49,
      "device_downtime": 2.59,
      "device_type": "换辊",
      "inventory": 1.85,
      "delivery": 14317
    },
    {
      "date": "2026-03-20",
      "plan": 14331,
      "actual": 14031,
      "yield_rate": 98.06,
      "hot_charge_rate": 70.07,
      "gas_consumption": 1.14,
      "quality_lock": 53,
      "device_downtime": 3.12,
      "device_type": "电气",
      "inventory": 1.75,
      "delivery": 13907
    },
    {
      "date": "2026-03-21",
      "plan": 14331,
      "actual": 12523,
      "yield_rate": 98.51,
      "hot_charge_rate": 56.02,
      "gas_consumption": 1.19,
      "quality_lock": 57,
      "device_downtime": 6.16,
      "device_type": "待料",
      "inventory": 1.65,
      "delivery": 12415
    },
    {
      "date": "2026-03-22",
      "plan": 14331,
      "actual": 10486,
      "yield_rate": 97.59,
      "hot_charge_rate": 55.74,
      "gas_consumption": 1.21,
      "quality_lock": 61,
      "device_downtime": 9.00,
      "device_type": "机械",
      "inventory": 1.50,
      "delivery": 10400
    },
    {
      "date": "2026-03-23",
      "plan": 14331,
      "actual": 14276,
      "yield_rate": 98.61,
      "hot_charge_rate": 52.42,
      "gas_consumption": 1.24,
      "quality_lock": 76,
      "device_downtime": 2.09,
      "device_type": "电气",
      "inventory": 0.2739,
      "delivery": 14277
    }
  ]
}
```

> **说明**：
> - 每日 `plan`、`actual`、`yield_rate`、`hot_charge_rate`、`gas_consumption`、`device_downtime`、`delivery` 均从文件2对应工作表的合计行提取。
> - `quality_lock` 根据文件5质量封锁统计图表估算（数值为近似值，但整体趋势与实际一致）。
> - `inventory` 根据文件1库存走势图估算，3月1日为3.2万吨，逐日下降，3月23日为0.2739万吨（来自原料库存2739吨）。
> - `device_type` 根据当日主要事故原因（从“欠产原因”或事故分析中提取）。

---

## 接口3：库存历史数据

**接口地址**：`/api/dashboard/inventory`  
**请求方式**：GET  

```json
{
  "code": 200,
  "data": [
    { "date": "2026-03-01", "inventory": 3.20 },
    { "date": "2026-03-02", "inventory": 3.10 },
    { "date": "2026-03-03", "inventory": 2.95 },
    { "date": "2026-03-04", "inventory": 2.80 },
    { "date": "2026-03-05", "inventory": 2.70 },
    { "date": "2026-03-06", "inventory": 2.60 },
    { "date": "2026-03-07", "inventory": 2.50 },
    { "date": "2026-03-08", "inventory": 2.45 },
    { "date": "2026-03-09", "inventory": 2.40 },
    { "date": "2026-03-10", "inventory": 2.35 },
    { "date": "2026-03-11", "inventory": 2.30 },
    { "date": "2026-03-12", "inventory": 2.25 },
    { "date": "2026-03-13", "inventory": 2.20 },
    { "date": "2026-03-14", "inventory": 2.15 },
    { "date": "2026-03-15", "inventory": 2.10 },
    { "date": "2026-03-16", "inventory": 2.05 },
    { "date": "2026-03-17", "inventory": 2.00 },
    { "date": "2026-03-18", "inventory": 1.95 },
    { "date": "2026-03-19", "inventory": 1.85 },
    { "date": "2026-03-20", "inventory": 1.75 },
    { "date": "2026-03-21", "inventory": 1.65 },
    { "date": "2026-03-22", "inventory": 1.50 },
    { "date": "2026-03-23", "inventory": 0.2739 }
  ]
}
```

> **来源**：文件1库存走势图，数值趋势与图表一致。

---

## 接口4：当日缺陷分布

**接口地址**：`/api/dashboard/defect`  
**请求方式**：GET  

```json
{
  "code": 200,
  "data": {
    "total": 447,
    "卷形": 278,
    "板形": 169,
    "表面": 0,
    "尺寸": 0,
    "其他": 0
  }
}
```

> **来源**：文件3“分卷非工艺缺陷量”中2150线一行数据。

---

## 接口5：AI预警与建议

**接口地址**：`/api/dashboard/ai/alerts`  
**请求方式**：GET  

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "type": "warning",
      "message": "当前热装率偏低（52.4%），低于指标55%，预计明日煤气单耗将上升0.05 GJ/t，建议协调炼钢增加热装量。",
      "time": "2026-03-23 14:30",
      "source": "根据历史数据关联分析"
    },
    {
      "id": 2,
      "type": "alert",
      "message": "今日设备事故主要为电气类（2.09小时），与卷取机相关，建议检查变频柜。",
      "time": "2026-03-23 10:15",
      "source": "基于故障记录和电气事故趋势"
    },
    {
      "id": 3,
      "type": "info",
      "message": "根据历史数据，未来3天库存可能降至2.3万吨，低于安全线2.5万吨，建议增加热装量或加快外发。",
      "time": "2026-03-23 09:00",
      "source": "库存预测模型"
    },
    {
      "id": 4,
      "type": "forecast",
      "message": "AI预测明日产量：14400~14600吨，预计完成率101%。",
      "time": "2026-03-23 08:00",
      "source": "时间序列预测"
    }
  ]
}
```

> **说明**：以上建议均基于真实数据（热装率、设备故障、库存趋势）模拟生成，用于演示AI能力。

---

## 接口6：设备健康评分

**接口地址**：`/api/dashboard/device/health`  
**请求方式**：GET  

```json
{
  "code": 200,
  "data": [
    {
      "device": "卷取机",
      "score": 68,
      "status": "需检修",
      "history": "近期故障：3月23日卷取一级死机；3月18日卷筒故障"
    },
    {
      "device": "粗轧除鳞泵",
      "score": 72,
      "status": "注意维护",
      "history": "3月23日报警频繁，不能三点除鳞"
    },
    {
      "device": "加热炉",
      "score": 85,
      "status": "正常",
      "history": "1#加热炉修炉完成"
    },
    {
      "device": "精轧机",
      "score": 90,
      "status": "正常",
      "history": "无重大故障"
    }
  ]
}
```

> **来源**：设备健康评分基于文件1中设备运行情况、文件2中事故时间及类型统计模拟。卷取机因多次故障得分较低，除鳞泵因能力差报警频繁得分中等。

---

## 附录：关键数据来源汇总表

| 数据项 | 来源文件 | 具体位置 |
|--------|----------|----------|
| 当日产量/计划/成材率/热装率/煤气单耗 | 文件1（调度会汇报PPT） | 2150线生产总结 |
| 当日质量封锁 | 文件1 | 2150线质量封锁统计 |
| 当日设备事故时间 | 文件1 | 设备运行情况 + 文件2合计 |
| 当日钢坯库存 | 文件1 | 原料库存 |
| 1-23日每日生产数据 | 文件2（调度图表Excel） | 工作表“1”至“23”合计行 |
| 1-23日每日质量封锁 | 文件5（质量日工作总结） | 封锁统计图表 |
| 1-23日库存走势 | 文件1 | 三线钢坯库存走势图 |
| 当日分卷缺陷 | 文件3（分卷非工艺缺陷量） | Sheet1“2150”行 |
| 设备故障历史 | 文件2 | 各工作表“电气”“机械”列 |

以上Mock数据已完整覆盖大屏所有图表所需信息，可直接用于前端开发。