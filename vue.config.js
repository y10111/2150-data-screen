module.exports = {
  lintOnSave: false,
  devServer: {
    port: Number(process.env.VUE_APP_DEV_SERVER_PORT) || 8080,
    open: true,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_PROXY_TARGET || "http://localhost:3000",
        changeOrigin: true,
        // pathRewrite: { '^/api': '' }  // 根据实际情况
      },
    },
  },
  productionSourceMap: false,
};
