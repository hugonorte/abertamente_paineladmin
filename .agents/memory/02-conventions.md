---
title: "Coding Conventions"
description: Naming patterns, import rules, TypeScript usage, and testing rules
---

# Coding Conventions (Abertamente)

This document outlines the strict coding standards required for this project.

## 1. Vue 3 & Composition API

- **Mandatory**: Use `<script setup lang="ts">`.
- **Prohibited**: Options API (`export default { data() { ... } }`).
- **Reactivity**: Use `ref` for primitives, `reactive` for complex objects.

## 2. TypeScript Strictness

- **Mandatory**: Full TypeScript coverage.
- **Prohibited**: Use of `any`.
- **Props**: Must be strictly typed using `defineProps<{ ... }>()`.
  ```typescript
  const props = defineProps<{
    title: string;
    isActive?: boolean;
  }>();
  ```
- **Emits**: Must be typed.
  ```typescript
  const emit = defineEmits<{
    (e: 'update', value: string): void;
  }>();
  ```

## 3. Naming Conventions

- **Components**: PascalCase (e.g., `ComuneroDetails.vue`).
- **Composables**: camelCase, starting with `use` (e.g., `useAuth.ts`).
- **Composables (Composables)**: camelCase, starting with `use` and ending with `Store` (e.g., `useAsset.ts`).
- **Variables/Functions**: camelCase.
- **Props in Template**: kebab-case (e.g., `<MyComponent :is-active="true" />`).

## 4. Internationalization (i18n)

- **Strict Rule**: Hardcoded user-facing strings are strictly prohibited in templates.
- **Usage**:
  - Template: `{{ $t('common.save') }}`
  - Script: `const { t } = useI18n(); console.log(t('common.save'));`
- **Synchronization**: Every new key must be added to `pt.json`, `en.json`, and `es.json` in `src/locales/`.

## 5. Form Management & Validation

- **Libraries**: `vee-validate` paired with `Zod`.
- **Pattern**:
  - Define Zod schema outside the component or in a separate file.
  - Use `useForm` and `useField` from `vee-validate`.
- **Mandatory Double Callback**: When using `handleSubmit`, you MUST implement both success and error callbacks (e.g., to log validation failures).

## 6. CSS & Styling

- **SCSS**: Scoped styles must use `<style scoped lang="scss">`.
- **Imports**: Always use `@use` to import variables.
  ```scss
  @use '@/styles/colors.scss' as *;
  ```
- **Tailwind**: Prefer Tailwind utility classes for layout (flex, grid, margin) over custom CSS.

## 7. Imports and Aliases

- **Mandatory Alias**: Always use `@/` for absolute imports starting from `src/`.
  ```typescript
  // ✅ Good
  import { useAuth } from '@/composables/useAuth';
  import MyComponent from '@/components/MyComponent.vue';

  // ❌ Bad
  import { useAuth } from '../../composables/useAuth';
  ```

## 8. Testing Conventions

### Unit Tests (Vitest)
- Co-located with components or in a specific `__tests__` folder.
- File naming: `[name].spec.ts`
- Must test props, emits, and conditional rendering.

### E2E Tests (Cypress)
- Located in `cypress/e2e/`.
- File naming: `[feature].cy.ts`
- Tests actual user flows, not implementation details.

## 9. Security & Governance

- **Zero Secrets**: No API keys or credentials in frontend code.
- **Environment Vars**: Only use `VITE_` prefixed variables for safe public keys.
- **No Mock Data in Prod**: Dummy users or templates must be purged before production.
- **Destructive Actions**: Must feature double-verification modals ("Are you sure you want to delete...?").
