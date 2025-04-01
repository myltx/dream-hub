<script setup lang="ts">
const colorMode = useColorMode();

// 切换模式
const setColorMode = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', colorMode.value);
};

// 判断是否支持 startViewTransition API
const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

// 切换动画
async function toggleDark({ clientX: x, clientY: y }: MouseEvent) {
  const isDark = colorMode.value === 'dark';

  if (!enableTransitions()) {
    setColorMode();
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`,
  ];

  await document.startViewTransition(async () => {
    setColorMode();
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: !isDark ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${!isDark ? 'old' : 'new'}(root)`,
    }
  );
}

// 在页面加载时，设置主题
onMounted(() => {
  document.documentElement.setAttribute('data-theme', colorMode.value);
});
</script>

<template>
  <div
    class="cursor-pointer flex items-center justify-center rounded-md p-1.5 text-gray-700 hover:bg-gray-100"
  >
    <Icon
      :name="
        $colorMode.value === 'dark'
          ? 'line-md:moon-rising-filled-alt-loop'
          : 'line-md:moon-to-sunny-outline-loop-transition'
      "
      class="text-2xl cursor-pointer"
      @click="toggleDark"
    />
  </div>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}
</style>
