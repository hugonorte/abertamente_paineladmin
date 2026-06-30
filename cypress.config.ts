import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: false,
    watchForFileChanges: false,
    excludeSpecPattern: ['**/node_modules/**', '**/.nuxt/**', '**/.data/**', '**/.git/**', '**/.agents/**'],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 375,
    viewportHeight: 667,
  },
});
