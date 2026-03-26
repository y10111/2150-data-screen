<template>
  <div class="footer">
    <div class="footer-left">
      <span>数据更新时间: {{ updateTime }}</span>
    </div>
    <div class="footer-center">
      <span>数据来源: 调度图表、质量封锁统计等</span>
    </div>
    <div class="footer-right">
      <span>技术支持 | 版本号: 1.0.0</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppFooter",
  data() {
    return {
      updateTime: "",
    };
  },
  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 60000); // 每分钟更新一次
  },
  methods: {
    updateDateTime() {
      this.updateTime = new Date().toLocaleString();
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background-color: #151e2c;
  color: #8c9ab3;
  padding: 0 20px;
  font-size: 12px;

  .footer-left,
  .footer-center,
  .footer-right {
    flex: 1;
  }

  .footer-center {
    text-align: center;
  }

  .footer-right {
    text-align: right;
  }
}
</style>
