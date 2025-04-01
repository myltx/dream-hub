import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Dream-hub',
  description: 'Dream-hub',
  ignoreDeadLinks: true,
  themeConfig: {
    logo: '/logo.png',
    logoLink: '/guide/',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: "指南", link: "guide/" },
      // { text: "Features", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: '开始',
        items: [
          { text: '简介', link: '/guide/' },
          { text: '快速开始', link: '/guide/getting-started' },
          {
            text: '开发文档',
            items: [
              { text: '前端文档', link: '/guide/front-end-reference' },
              {
                text: '后端文档',
                items: [
                  { text: '开发说明', link: '/guide/api-reference' },
                  { text: 'Supabase配置', link: '/guide/supabase-reference' },
                  { text: 'Logto配置', link: '/guide/logto-referenc' },
                ],
              },
            ],
          },
        ],
      },
      {
        text: '问题',
        items: [{ text: '常见问题', link: '/question/' }],
      },
      // {
      //   text: '贡献代码',
      //   items: [
      //     { text: '如何贡献代码？', link: '/contribution/' },
      //     { text: '如何配置logto?', link: '/contribution/config-logto' },
      //   ],
      // },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/myltx/dream-hub' },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-2024, Dream-hub. All rights reserved.',
    },
    editLink: {
      pattern: 'https://github.com/myltx/dream-hub/packages/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    lastUpdated: {
      text: '最后更新于',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },
});
