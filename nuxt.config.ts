export default defineNuxtConfig({
  compatibilityDate: '2026-05-28',
  devtools: { enabled: true },
  ssr: false,
  experimental: {
    viteEnvironmentApi: true,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    }
  },
  app: {
    head: {
      title: 'TEA Registro',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'theme-color', content: '#16a34a' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'TEA Registro' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'icon', href: '/favicon.ico' },
      ]
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  }
})
