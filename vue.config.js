module.exports = {
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      "/api": {
        target: "http://真实后端地址", // 后期替换
        changeOrigin: true,
        // pathRewrite: { '^/api': '' }  // 根据实际情况
      },
    },
  },
  productionSourceMap: false,
};
