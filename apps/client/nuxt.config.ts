export default defineNuxtConfig({
  css: [
    '~/assets/css/global.css', // 引入 global.css 文件
  ],
  experimental: {
    viewTransition: true,
  },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  ssr: false,
  srcDir: 'src',
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  plugins: ['~/plugins/logto.ts'],
  modules: [
    '@pinia/nuxt',
    '@unocss/nuxt',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'nuxt-viewport',
  ],
  runtimeConfig: {
    logtoAppId: process.env.NUXT_LOGTO_APP_ID,
    logtoEndpoint: process.env.NUXT_LOGTO_ENDPOINT,
    // 公开变量（客户端也可用）
    public: {
      logtoAppId: process.env.NUXT_LOGTO_APP_ID || '',
      logtoEndpoint: process.env.NUXT_LOGTO_ENDPOINT || '',
      backendEndpoint: process.env.BACKEND_ENDPOINT || '',
      signInRedirectURI: process.env.LOGTO_SIGN_IN_REDIRECT_URI || '',
      signOutRedirectURI: process.env.LOGTO_SIGN_OUT_REDIRECT_URI || '',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
      supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET || '',
      jti: process.env.JTI || '',
      apiBase: process.env.API_BASE || '',
      projectName: process.env.PROJECT_NAME || '',
      // AI 配置
      aiApiKey: process.env.AI_API_KEY || '',
      aiApiUrl: process.env.AI_BASE_URL || '',
    },
  },
  unocss: {
    nuxtLayers: true,
  },

  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },
});
