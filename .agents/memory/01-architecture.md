---
title: "Project Architecture"
description: Vue 3 structure, component organization, and key patterns
---

# Project Architecture (Abertamente)

This document describes the structural layout and high-level architecture of the frontend application.

## 1. Directory Structure

The project uses a standard Vite + Vue 3 structure, with code concentrated in `src/`:

```
src/
├── api/                 # Axios configurations and API service classes
├── assets/              # Static files, global CSS/SCSS, images, data JSONs
├── components/          # Vue components (dumb and smart)
├── locales/             # i18n JSON files (pt, en, es)
├── pages/ (or views/)   # Route components (Pages)
├── router/              # Vue Router configuration
├── composables/              # Composables state management
├── styles/              # Global SCSS variables, mixins, Tailwind config
├── types/               # TypeScript interfaces and global types
├── App.vue              # Root component
└── main.ts              # Application entry point
```

## 2. Component Architecture

We use a flat component structure where possible, but complex features can have their own folders:

```
components/
├── ButtonPrimary.vue         # Shared/UI component
├── InputText.vue             # Shared/UI component
└── ComuneroDetails/          # Feature-specific component
    ├── ComuneroDetails.vue
    └── ComuneroDetails.spec.ts
```

### Key Principles:
- **Design System First**: Always check if a component exists (e.g., `ButtonPrimary`, `ModalMulti`) before creating a new one.
- **Dumb vs. Smart**: UI components should be "dumb" (rely entirely on props/emits). Feature components can be "smart" (access Composables or API).
- **Single File Components (SFC)**: All components use the `.vue` extension with `<script setup lang="ts">`.

## 3. Routing Architecture

Routing is explicitly defined in `src/router/index.ts` using **Vue Router**.

### Key Rules:
- **No Auto-Routing**: Unlike frameworks like Nuxt, routes must be manually defined.
- **Route Guards**: Used for authentication and Role-Based Access Control (RBAC).

**Example configuration:**
```typescript
{
  path: '/comuneros',
  name: 'Comuneros',
  component: () => import('@/pages/Comuneros.vue'),
  meta: { requiresAuth: true }
}
```

## 4. State Management (Composables)

**Composables** is used exclusively for global state that needs to persist across pages or be shared widely.

- **Location**: `composables/`
- **Pattern**: Composition API syntax (`defineStore('name', () => { ... })`) is preferred over the options API syntax.
- **Usage**:
  - Global UI state (sidebar open/close)
  - User session and roles
  - Caching API results (if needed globally)

## 5. Styling Architecture

We use a hybrid approach: **SCSS** for scoped component styles and variables, combined with **Tailwind CSS v4** for utility classes.

- **Variables**: Global colors and mixins are in `src/styles/` or `src/assets/`.
- **Importing**: Always use `@use '@/styles/colors.scss' as *;` inside `<style scoped lang="scss">`. **Never** use `@import`.
- **Tailwind**: Used for layout, spacing, and responsive design (grids, flexbox, padding, margin).

## 6. Integrations & Tooling

- **Build Tool**: Vite (configured in `vite.config.ts`).
- **i18n**: `vue-i18n` is used. Translations are stored in `src/locales/`. The setup is done in `src/i18n.ts` (or similar).
- **Form Validation**: `vee-validate` + `Zod` schema validation. Client-side validation is mandatory.
- **Testing**:
  - **Unit**: Vitest
  - **E2E**: Cypress

## 7. Security & API
- **Environment Variables**: Only variables prefixed with `VITE_` are exposed to the client.
- **API Calls**: Handled via `axios` or native `fetch` in the `src/api/` directory. No credentials or secrets in source code.
