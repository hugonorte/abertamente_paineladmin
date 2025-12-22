// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon','@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {

        public: {
            // Disponibiliza a URL da API para o lado do cliente (navegador)
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://admin.abertamente.net/api',
            siteName: process.env.NUXT_PUBLIC_SITE_NAME 
        }
    }
})