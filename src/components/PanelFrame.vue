<template>
  <component :is="borderComponent" class="panel-frame">
    <div class="panel-content" :class="{ stacked }">
      <slot />
    </div>
  </component>
</template>

<script>
export default {
  name: "PanelFrame",
  props: {
    borderComponent: {
      type: String,
      required: true,
    },
    stacked: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="less" scoped>
.panel-frame {
  display: block;
  width: 100%;
  height: 100%;
}

.panel-content {
  width: 100%;
  height: 100%;
}

.panel-content.stacked {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  box-sizing: border-box;
}
</style>
