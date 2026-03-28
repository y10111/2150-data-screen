# screen_ai_service（原 python_rag_service）

本地 **Qwen2.5-1.5B-Instruct** 根据仓库内 **`src/mock/data/dailyOperations.json`** 最近 7 日记录，生成 **AI 预警与建议** JSON，接口与前端 Mock 一致：

- `GET /dashboard/ai/alerts` → `{ "code": 200, "data": [ { "date": "...", "alerts": [ ... ] } ] }`
- `GET /health`

若模型生成失败或解析失败，自动回退到 **`aiAlertTimeline.json` 最后一天**。

## 运行

```bash
cd screen_ai_service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

或在仓库根目录：`npm run ai-server`（使用系统 `python` 执行 `screen_ai_service/app.py`）。

默认端口 **5001**，可通过环境变量 `SCREEN_AI_PORT` 修改。

### 与 Vue 联调

1. 先启动本服务，再 `npm run serve`。
2. `vue.config.js` 已将 `/api/dashboard/ai` 代理到 `VUE_APP_SCREEN_AI_URL`（默认 `http://127.0.0.1:5001`）。
3. 模型会读取 `src/mock/data/` 下 **dailyOperations、qualityDefects、deviceHealthTimeline、inventoryTimeline**（只读），综合生成 4～6 条预警；失败则回退 `aiAlertTimeline.json` 最后一天。

## 模型

将 **Qwen2.5-1.5B-Instruct** 完整权重放在：

`screen_ai_service/models/Qwen2.5-1.5B-Instruct/`

（由旧 RAG 目录重命名迁移即可，无需重新下载。）

## 与 Vue 大屏对接（需你自行改前端代理时）

开发环境将 `/api` 中 `dashboard/ai/alerts` 代理到 `http://127.0.0.1:5001`；或把 `baseURL` 指到该服务。当前仓库前端仍走 Mock 时，**不必改 Vue**，仅启动本服务即可单独联调。

## 说明

- **不**再包含向量检索、PDF/Word 解析、Java 文档接口。
- 仅读取 **Mock JSON（只读）**，不修改 `src` 下其它代码。
