<template>
  <h3 class="module-panel-title"><slot /></h3>
</template>

<script>
export default {
  name: "ModulePanelTitle",
};
</script>

<style lang="less" scoped>
.module-panel-title {
  margin: 0 0 4px 0;
  padding: 0 2px 1px;
  font-size: 13px;
  font-weight: 700;
  color: #e6e9f0;
  text-align: left;
  line-height: 1.28;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}
</style>
