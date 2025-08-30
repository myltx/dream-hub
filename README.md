## 项目介绍

- [Dream-hub](https://nav.myltx.cn)：用于记录自己平时使用或发现的好用的网站,后续会完善自己的记录功能
- [开发文档地址](https://dream-hub.docs.myltx.top/guide/)：参考此文档进行二次开发
- [后端地址](https://github.com/myltx/drema-hub-api)：后端代码地址

## 📦 项目依赖

- [nuxt3](https://nuxt.com/) Nuxt3 is a framework for building Vue.js applications.
- [nuxt-ui](https://github.com/nuxt/ui) Nuxt UI is a collection of UI components for Nuxt.js applications.
- [unocss](https://unocss.dev/) Unocss is a utility-first CSS framework that provides a powerful and flexible way to build custom styles for your web applications.
- [logto](https://logto.io/) Logto is an open-source identity and access management (IAM) solution that helps you build modern web and mobile applications with ease.
- [supabase](https://supabase.com/) Supabase is an open source real-time database and backend built on PostgreSQL.
- [nsetjs](https://nestjs.com/) Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications.

## ✨ 特性

- 使用前端最新技术栈开发
- 使用 nestjs 作为后端框架
- 极快响应、便于开发部署
- 支持多种部署方式，优先推荐 [Vercel](https://vercel.com/)
- 支持暗黑模式
  <!-- * 支持 `SSR` 渲染，利于 `SEO` 优化  -->
  <!-- * 目录结构清晰，轻量级，前后端一体 -->

## 效果展示

![alt text](image-2.png)
<!-- ![alt text](image.png)
![alt text](image-1.png) -->

## 🚀 How To Start?

<!-- The mentioned operations below are based on the root directory of the current project, please be attentive to ensure there are no errors! -->

1. 添加 .env 配置文件

   - client env 配置

   ```shell
   # logto 配置
   NUXT_LOGTO_ENDPOINT=
   NUXT_LOGTO_APP_ID=
   BACKEND_ENDPOINT=
   LOGTO_SIGN_IN_REDIRECT_URI =
   LOGTO_SIGN_OUT_REDIRECT_URI =

   # supabase 配置
   SUPABASE_URL=
   SUPABASE_KEY=
   SUPABASE_JWT_SECRET=

   API_BASE=

   # project config
   PROJECT_NAME= Dream-hub

   ```

   - api env 配置

   ```shell
   # supabase 配置
   SUPABASE_URL=
   SUPABASE_KEY=
   SUPABASE_JWT_SECRET=

   # redis 配置
   REDIS_URL=

   # server 配置
   PORT=8081

   # logto 配置
   LOGTO_ENDPOINT=
   LOGTO_APP_ID=
   BACKEND_ENDPOINT=

   ```

2. 安装依赖
   ```shell
   npm install
   ```
3. 启动项目
   ```shell
   pnpm dev
   ```

## 注意事项

1. node 版本需要 20 以上

## ⚙️ Vercel 一键部署

1. `Fork` 本项目，在 `Vercel` 官网点击 `New Project`
2. 点击 `Import Git Repository` 并选择你 fork 的此项目并点击 `import`
3. `PROJECT NAME`自己填，`FRAMEWORK PRESET` 选 `Other` 然后直接点 `Deploy` 接着等部署完成即可

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/myltx/nav-monorepo)

## ⚙️ Vecel 本地部署

```powershell
// 全局安装 vercel
npm i -g vercel

// 登录
vercel login

// 项目推送
vercel

// 挂载生产
vercel --prod
```

> 具体教程可参考文章：[如何使用 Vercel 托管静态网站](https://baiwumm.com/p/5zzij7bt)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=myltx/dream-hub&type=Date)](https://star-history.com/#myltx/dream-hub&Date)
