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
            siteName: process.env.NUXT_PUBLIC_SITE_NAME,
            publicImagesFolder: process.env.NUXT_PUBLIC_IMAGES_FOLDER || 'images',
        }
    },
  // Fix for "Adding different instances of a keyed plugin" error
  // See: https://ui.nuxt.com/components/editor
  vite: {
    optimizeDeps: {
      include: [
        'prosemirror-state',
        'prosemirror-transform',
        'prosemirror-model',
        'prosemirror-view',
        'prosemirror-dropcursor',
        'prosemirror-gapcursor',
        'prosemirror-history',
        'prosemirror-keymap',
        'prosemirror-commands',
        'prosemirror-schema-list',
        'prosemirror-inputrules',
        '@tiptap/pm/state',
        '@tiptap/pm/model',
        '@tiptap/pm/view',
        '@tiptap/pm/transform',
        '@tiptap/core',
        '@tiptap/vue-3'
      ]
    }
  }
})