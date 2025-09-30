// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  alias: {
    '~': '.',
    '@': '.'
  },

  app: {
    head: {
      title: 'Pharmacy POS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Pharmacy Point of Sale System' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
    }
  },
  nitro: {
    preset: 'vercel'
  }
})
