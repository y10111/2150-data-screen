# 2150-data-screen

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### 本地 AI 预警（screen_ai_service）

1. 进入 `screen_ai_service`，安装依赖并启动（需已放置 `models/Qwen2.5-1.5B-Instruct`）：
   ```bash
   cd screen_ai_service && pip install -r requirements.txt && python app.py
   ```
   或在仓库根目录：`npm run ai-server`（需本机 `python` 可用）。
2. 默认监听 **5001**。再执行 `npm run serve`，开发代理会把 `/api/dashboard/ai/*` 转到该服务；其它接口仍走 Mock。
3. AI 生成较慢（约 1～2 分钟），大屏会单独请求；**未启动 AI 服务时** 其它图表仍正常，AI 区域为空并在控制台提示。

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
