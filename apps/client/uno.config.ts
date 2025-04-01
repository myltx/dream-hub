import { defineConfig, presetMini } from 'unocss';

export default defineConfig({
  // ...UnoCSS options
  presets: [presetMini()],
  theme: {
    colors: {
      veryCool: '#0000ff', // class="text-very-cool"
      brand: {
        primary: 'hsl(var(--hue, 217) 78% 51%)', //class="bg-brand-primary"
        DEFAULT: '#942192', //class="bg-brand"
      },
      primary: 'var(--primary-color)', // 使用 CSS 变量
      textColor: 'var(--text-color)',
      bgColor: 'var(--background-color)',
      otherBgColor: 'var(--other-bg-color)',
      bColor: 'var(--b-color)',
    },
    fontFamily: {
      // 将自定义字体添加到 fontFamily 中
      'zk-gf': 'ZiKuJiangHuGuFengTi',
      'zk-xst': 'YeZiGongChangXiaoShiTou',
      'zk-qfy': 'ZiKuXingQiuFeiYangTi',
      'zk-syht-bold': 'SourceHanSansSC-Bold-2',
      'zk-syht-extraLight': 'SourceHanSansSC-ExtraLight-2',
      'zk-syht-heavy': 'SourceHanSansSC-Heavy-2',
      'zk-syht-light': 'SourceHanSansSC-Light-2',
      'zk-syht-medium': 'SourceHanSansSC-Medium-2',
      'zk-syht-normal': 'SourceHanSansSC-Normal-2',
      'zk-syht-regular': 'SourceHanSansSC-Regular-2',
    },
  },
  rules: [
    // ...UnoCSS rules
    ['h-calc', { height: 'calc(var(--h))' }],
  ],
});
