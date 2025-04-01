import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

export function useScrollWatcher() {
  const selectedAnchor = ref(''); // 当前选中的锚点
  const thresholdDistance = 100; // 设置标题距离顶部的最小距离（单位：px）
  const headerHeight = ref(0); // 页面上方固定元素的高度
  const debounceTimeout = 200; // 防抖延迟时间（单位：毫秒）

  let scrollTimeout: number | null = null; // 防抖定时器

  // 获取页面上方固定元素的高度
  const setHeaderHeight = () => {
    const header = document.querySelector('.page-header'); // 假设页面上方固定的元素类名为 `.page-header`
    if (header) {
      headerHeight.value = header.clientHeight;
    }
  };

  // 获取距离顶部最近的锚点标题
  const getNearestAnchor = () => {
    const titles = document.querySelectorAll('.anchor-title');
    let nearest = null;
    let minDistance = Infinity;

    titles.forEach((title) => {
      const rect = title.getBoundingClientRect();
      const distance = rect.top - headerHeight.value; // 计算与顶部的距离
      if (distance >= 0 && distance < minDistance) {
        nearest = title;
        minDistance = distance;
      }
    });

    return nearest;
  };

  // 更新选中的锚点
  const updateSelectedAnchor = () => {
    const nearest = getNearestAnchor();
    if (nearest) {
      selectedAnchor.value = nearest.id;
    }
  };

  // 延迟触发选中更新
  const handleScroll = () => {
    // 如果有已经存在的定时器，清除
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // 设置一个新的定时器，在滚动停止一定时间后更新选中的锚点
    scrollTimeout = setTimeout(() => {
      updateSelectedAnchor(); // 滚动结束后更新选中的锚点
    }, debounceTimeout);
  };

  // 观察新的标题元素
  const observeTitles = () => {
    nextTick(() => {
      const newTitles = document.querySelectorAll('.anchor-title');
      newTitles.forEach((title) => observer.observe(title));
    });
  };

  // 使用 IntersectionObserver 来监听元素是否进入视口
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const rect = entry.target.getBoundingClientRect();
        if (rect.top <= headerHeight.value + thresholdDistance) {
          selectedAnchor.value = entry.target.id;
        }
      });
    },
    {
      threshold: 0,
    }
  );

  onMounted(() => {
    setHeaderHeight(); // 在组件挂载时获取上方元素的高度
    // observeTitles(); // 观察页面中的标题
    window.addEventListener('scroll', handleScroll); // 添加滚动事件监听
  });

  onBeforeUnmount(() => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout); // 清除定时器
    }
    window.removeEventListener('scroll', handleScroll); // 移除滚动事件监听
    observer.disconnect(); // 销毁时断开 IntersectionObserver 监听
  });

  // 手动滚动到指定锚点
  const scrollToSection = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      selectedAnchor.value = sectionId; // 更新选中的锚点
    }
  };

  return { selectedAnchor, scrollToSection, observeTitles };
}
