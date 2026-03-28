module.exports = {
  lintOnSave: false,
  devServer: {
    port: Number(process.env.VUE_APP_DEV_SERVER_PORT) || 8080,
    open: true,
    proxy: {
      // 本地 LLM 预警服务（screen_ai_service），需先于通用 /api 匹配
      // 本地 Qwen 推理可能数分钟，必须加大超时，否则会出现 ECONNRESET
      "/api/dashboard/ai": {
        target: process.env.VUE_APP_SCREEN_AI_URL || "http://127.0.0.1:5001",
        changeOrigin: true,
        timeout: 600000,
        proxyTimeout: 600000,
      },
      "/api": {
        target: process.env.VUE_APP_PROXY_TARGET || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  productionSourceMap: false,
};
