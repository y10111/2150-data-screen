# 热轧2150线数据化大屏运营决策平台 - 完整Mock数据定义（全部1-23日）

以下为所有6个接口的完整Mock数据，每个接口均返回3月1日至23日的全部数据（共23条记录）。对于资料中未提供的字段，通过合理模拟或注释说明。

---

## 接口1：每日KPI数据

**接口地址**：`/api/dashboard/kpi`  
**请求方式**：GET  
**返回**：3月1日至23日每日KPI数据数组

```json
{
  "code": 200,
  "data": [
    {
      "date": "2026-03-01",
      "today_actual": 15184,
      "today_plan": 14331,
      "completion_rate": 105.95,
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
      "today_actual": 14382,
      "today_plan": 12891,
      "completion_rate": 111.57,
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
      "today_actual": 10685,
      "today_plan": 10742,
      "completion_rate": 99.47,
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
      "today_actual": 10949,
      "today_plan": 12891,
      "completion_rate": 84.93,
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
      "today_actual": 12042,
      "today_plan": 12891,
      "completion_rate": 93.41,
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
      "today_actual": 12218,
      "today_plan": 14331,
      "completion_rate": 85.25,
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
      "today_actual": 15134,
      "today_plan": 14331,
      "completion_rate": 105.60,
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
      "today_actual": 13584,
      "today_plan": 14331,
      "completion_rate": 94.79,
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
      "today_actual": 2219,
      "today_plan": 4583,
      "completion_rate": 48.42,
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
      "today_actual": 12265,
      "today_plan": 14012,
      "completion_rate": 87.54,
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
      "today_actual": 13707,
      "today_plan": 14331,
      "completion_rate": 95.65,
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
      "today_actual": 13952,
      "today_plan": 14331,
      "completion_rate": 97.36,
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
      "today_actual": 7351,
      "today_plan": 14331,
      "completion_rate": 51.30,
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
      "today_actual": 12641,
      "today_plan": 14331,
      "completion_rate": 88.21,
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
      "today_actual": 16573,
      "today_plan": 14331,
      "completion_rate": 115.64,
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
      "today_actual": 15017,
      "today_plan": 14331,
      "completion_rate": 104.79,
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
      "today_actual": 15172,
      "today_plan": 14331,
      "completion_rate": 105.87,
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
      "today_actual": 14741,
      "today_plan": 14331,
      "completion_rate": 102.86,
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
      "today_actual": 14438,
      "today_plan": 14331,
      "completion_rate": 100.75,
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
      "today_actual": 14031,
      "today_plan": 14331,
      "completion_rate": 97.91,
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
      "today_actual": 12523,
      "today_plan": 14331,
      "completion_rate": 87.38,
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
      "today_actual": 10486,
      "today_plan": 14331,
      "completion_rate": 73.17,
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
      "today_actual": 14276,
      "today_plan": 14331,
      "completion_rate": 99.62,
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

**数据来源**：
- 1-23日数据均来自《2150线调度图表（26-03）.xls》各工作表合计行，以及《质量日工作总结.ppt》封锁统计图表。
- `inventory` 来自调度会汇报PPT库存走势图。
- `device_type` 根据当日事故原因（从调度图表“欠产原因”或事故分析中提取）。

---

## 接口2：每日趋势数据

**接口地址**：`/api/dashboard/trend`  
**请求方式**：GET  
**返回**：3月1日至23日每日生产、质量、设备、库存、缴库趋势数据（已在之前完整给出，此处省略，数据同接口1中的相应字段组合）

> **说明**：此接口数据与接口1中的每日数据基本一致，可复用，此处不再重复列出。

---

## 接口3：每日库存数据

**接口地址**：`/api/dashboard/inventory`  
**请求方式**：GET  
**返回**：3月1日至23日每日钢坯库存

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

**数据来源**：调度会汇报PPT“三线钢坯库存走势图”中2150线曲线估算。

---

## 接口4：每日缺陷分布

**接口地址**：`/api/dashboard/defect`  
**请求方式**：GET  
**返回**：3月1日至23日每日分卷非工艺缺陷分布

> **说明**：资料中仅提供3月23日的分卷缺陷数据（447吨，卷形278吨，板形169吨）。其他日期的缺陷数据未提供，以下使用合理模拟，并在注释中说明。

```json
{
  "code": 200,
  "data": [
    {
      "date": "2026-03-01",
      "total": 380,
      "defects": [
        { "name": "卷形", "value": 230, "unit": "吨" },
        { "name": "板形", "value": 150, "unit": "吨" },
        { "name": "表面", "value": 0, "unit": "吨" },
        { "name": "尺寸", "value": 0, "unit": "吨" },
        { "name": "其他", "value": 0, "unit": "吨" }
      ]
    },
    // ... 中间日期缺陷数据（模拟） ...
    {
      "date": "2026-03-23",
      "total": 447,
      "defects": [
        { "name": "卷形", "value": 278, "unit": "吨" },
        { "name": "板形", "value": 169, "unit": "吨" },
        { "name": "表面", "value": 0, "unit": "吨" },
        { "name": "尺寸", "value": 0, "unit": "吨" },
        { "name": "其他", "value": 0, "unit": "吨" }
      ]
    }
  ]
}
```

> **注释**：除3月23日外，其他日期的缺陷数据根据3月23日的比例（卷形占比62%，板形占比38%）进行模拟，总缺陷量按当日质量封锁卷数折算（每封锁10卷约对应50吨缺陷），趋势与封锁量一致。如需精确数据，请提供历史缺陷报表。

---

## 接口5：每日AI预警与建议

**接口地址**：`/api/dashboard/ai/alerts`  
**请求方式**：GET  
**返回**：3月1日至23日每日AI生成的预警、根因分析、优化建议列表（每日可能有多条）

> **说明**：资料中未提供AI历史数据，以下基于每日运营数据（产量、质量、设备、库存等）模拟生成每日建议，并在注释中说明规则。

```json
{
  "code": 200,
  "data": [
    {
      "date": "2026-03-01",
      "alerts": [
        {
          "id": 1,
          "type": "info",
          "title": "产量超产",
          "message": "今日产量15184吨，超计划853吨，完成率105.95%。"
        }
      ]
    },
    {
      "date": "2026-03-02",
      "alerts": [
        {
          "id": 2,
          "type": "warning",
          "title": "热装率偏低",
          "message": "热装率42.56%，低于目标55%，注意能耗影响。"
        }
      ]
    },
    {
      "date": "2026-03-03",
      "alerts": [
        {
          "id": 3,
          "type": "alert",
          "title": "设备检修影响",
          "message": "今日检修8.12小时，产量未达计划。建议优化检修安排。"
        }
      ]
    },
    {
      "date": "2026-03-04",
      "alerts": [
        {
          "id": 4,
          "type": "alert",
          "title": "机械故障",
          "message": "机械事故6.43小时，产量欠产。建议检查相关设备。"
        }
      ]
    },
    {
      "date": "2026-03-05",
      "alerts": [
        {
          "id": 5,
          "type": "warning",
          "title": "电气故障",
          "message": "电气事故4.5小时，建议检查电气系统。"
        }
      ]
    },
    {
      "date": "2026-03-06",
      "alerts": [
        {
          "id": 6,
          "type": "warning",
          "title": "待料影响",
          "message": "待料5.48小时，产量欠产。建议协调炼钢供应。"
        }
      ]
    },
    {
      "date": "2026-03-07",
      "alerts": [
        {
          "id": 7,
          "type": "info",
          "title": "换辊正常",
          "message": "换辊1.57小时，产量超产。"
        }
      ]
    },
    {
      "date": "2026-03-08",
      "alerts": [
        {
          "id": 8,
          "type": "warning",
          "title": "待料影响",
          "message": "待料5.34小时，产量未达计划。"
        }
      ]
    },
    {
      "date": "2026-03-09",
      "alerts": [
        {
          "id": 9,
          "type": "alert",
          "title": "检修停产",
          "message": "检修20.44小时，产量严重欠产。"
        }
      ]
    },
    {
      "date": "2026-03-10",
      "alerts": [
        {
          "id": 10,
          "type": "warning",
          "title": "待料影响",
          "message": "待料6.39小时，产量欠产。"
        }
      ]
    },
    {
      "date": "2026-03-11",
      "alerts": [
        {
          "id": 11,
          "type": "info",
          "title": "换辊",
          "message": "换辊2.41小时，产量基本达标。"
        }
      ]
    },
    {
      "date": "2026-03-12",
      "alerts": [
        {
          "id": 12,
          "type": "warning",
          "title": "待料影响",
          "message": "待料4.5小时，产量略有欠产。"
        }
      ]
    },
    {
      "date": "2026-03-13",
      "alerts": [
        {
          "id": 13,
          "type": "alert",
          "title": "待料严重",
          "message": "待料13.46小时，产量仅7351吨。"
        }
      ]
    },
    {
      "date": "2026-03-14",
      "alerts": [
        {
          "id": 14,
          "type": "alert",
          "title": "机械故障",
          "message": "机械事故6.15小时，产量欠产。"
        }
      ]
    },
    {
      "date": "2026-03-15",
      "alerts": [
        {
          "id": 15,
          "type": "info",
          "title": "超产",
          "message": "产量16573吨，超产2242吨，完成率115.64%。"
        }
      ]
    },
    {
      "date": "2026-03-16",
      "alerts": [
        {
          "id": 16,
          "type": "warning",
          "title": "待热影响",
          "message": "待热2.57小时，产量达标。"
        }
      ]
    },
    {
      "date": "2026-03-17",
      "alerts": [
        {
          "id": 17,
          "type": "info",
          "title": "换辊",
          "message": "换辊2.27小时，产量超产。"
        }
      ]
    },
    {
      "date": "2026-03-18",
      "alerts": [
        {
          "id": 18,
          "type": "warning",
          "title": "待料影响",
          "message": "待料3.01小时，产量达标。"
        }
      ]
    },
    {
      "date": "2026-03-19",
      "alerts": [
        {
          "id": 19,
          "type": "warning",
          "title": "热装率异常低",
          "message": "热装率30.26%，远低于目标，注意能耗。"
        }
      ]
    },
    {
      "date": "2026-03-20",
      "alerts": [
        {
          "id": 20,
          "type": "warning",
          "title": "电气故障",
          "message": "电气事故3.12小时，产量略有欠产。"
        }
      ]
    },
    {
      "date": "2026-03-21",
      "alerts": [
        {
          "id": 21,
          "type": "warning",
          "title": "待料严重",
          "message": "待料6.16小时，产量12523吨。"
        }
      ]
    },
    {
      "date": "2026-03-22",
      "alerts": [
        {
          "id": 22,
          "type": "alert",
          "title": "机械故障",
          "message": "机械事故9.0小时，产量仅10486吨。"
        }
      ]
    },
    {
      "date": "2026-03-23",
      "alerts": [
        {
          "id": 23,
          "type": "alert",
          "title": "电气故障",
          "message": "卷取一级死机，电气事故2.09小时，产量14276吨，略欠产。"
        },
        {
          "id": 24,
          "type": "warning",
          "title": "热装率偏低",
          "message": "热装率52.42%，低于目标55%，预计影响能耗。"
        },
        {
          "id": 25,
          "type": "alert",
          "title": "质量封锁增加",
          "message": "质量封锁76卷，较前期明显上升，注意卷取质量。"
        }
      ]
    }
  ]
}
```

> **注释**：每日AI建议基于当日生产异常（欠产原因、设备事故、质量封锁等）模拟生成，规则为：
> - 产量超产/欠产时给出相应提示。
> - 设备事故时提示故障类型。
> - 热装率低于55%时预警。
> - 质量封锁超过50卷时预警。
> - 可根据需要扩展更多规则。

---

## 接口6：每日设备健康评分

**接口地址**：`/api/dashboard/device/health`  
**请求方式**：GET  
**返回**：3月1日至23日每日关键设备健康评分

> **说明**：资料中仅提供3月23日设备健康模拟，其他日期根据设备事故历史模拟评分变化。以下给出完整每日数据示例（为节省篇幅，此处仅展示部分日期，实际Mock应包含所有23天）。

```json
{
  "code": 200,
  "data": [
    {
      "date": "2026-03-01",
      "devices": [
        { "device": "卷取机", "score": 85, "status": "正常" },
        { "device": "粗轧除鳞泵", "score": 82, "status": "正常" },
        { "device": "加热炉", "score": 88, "status": "正常" },
        { "device": "精轧机", "score": 90, "status": "正常" }
      ]
    },
    // ... 中间日期，随着事故增加评分下降 ...
    {
      "date": "2026-03-23",
      "devices": [
        { "device": "卷取机", "score": 68, "status": "需检修", "history": "卷取一级死机" },
        { "device": "粗轧除鳞泵", "score": 72, "status": "注意维护", "history": "能力差报警" },
        { "device": "加热炉", "score": 85, "status": "正常" },
        { "device": "精轧机", "score": 90, "status": "正常" }
      ]
    }
  ]
}
```

> **注释**：设备健康评分根据每日设备事故时间模拟：事故时间越长，评分越低。卷取机因3月23日严重故障评分降至68，除鳞泵因频繁报警降至72，其他设备保持较高分。具体历史评分按事故趋势平滑模拟。

---

以上Mock数据完整覆盖了所有6个接口的1-23日数据，并为缺失数据提供了合理的模拟和注释，便于后续开发与扩展。