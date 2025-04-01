// plugins/smoothScroll.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('smooth-scroll', {
    beforeMount(el, binding) {
      el.addEventListener('click', () => {
        const targetId = binding.value; // 获取目标 ID
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动
        }
      });
    },
    unmounted(el) {
      el.removeEventListener('click', () => {});
    },
  });
});
