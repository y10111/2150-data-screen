/**
 * flex 布局下父级高度变化时触发回调（不仅依赖 window resize），用于 ECharts resize。
 * 使用 requestAnimationFrame 推迟执行，避免与 ECharts resize 形成同帧布局循环，
 * 消除 “ResizeObserver loop completed with undelivered notifications” 报错。
 *
 * @param {Element|Element[]|null|undefined} target 单个 DOM 或多个
 * @param {() => void} onResize
 * @returns {() => void} 取消监听
 */
export function observeElementsForResize(target, onResize) {
  if (typeof ResizeObserver === "undefined") {
    return function noop() {};
  }
  const list = []
    .concat(target)
    .filter((el) => el && el.nodeType === 1);
  if (!list.length) {
    return function noop() {};
  }

  let rafId = null;
  const schedule = () => {
    if (rafId != null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      try {
        onResize();
      } catch (e) {
        /* ignore */
      }
    });
  };

  const ro = new ResizeObserver(() => schedule());
  list.forEach((el) => ro.observe(el));

  return () => {
    ro.disconnect();
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
