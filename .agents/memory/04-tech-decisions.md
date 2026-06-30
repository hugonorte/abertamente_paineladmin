---
title: "Technical Decisions"
description: Why each tech was chosen, constraints, rationale, and recent decisions
---

# Technical Decisions (Abertamente)

This document explains the *why* behind our technology choices and architectural constraints. Do not deviate from these tools without explicit architectural approval.

## 1. Core Framework & Build Tool

**Vue 3 (Composition API)**
- **Why**: Offers the best balance of performance, reactivity control, and ecosystem maturity. The Composition API allows for cleaner logic reuse (composables) compared to the Options API.
- **Constraint**: Options API is strictly prohibited to maintain codebase consistency.

**Vite**
- **Why**: Extremely fast HMR (Hot Module Replacement) and build times.
- **Constraint**: All environment variables must be prefixed with `VITE_` to be exposed to the client.

## 2. State Management

**Composables**
- **Why**: The official, type-safe state management solution for Vue 3. It's lighter and more intuitive than Vuex.
- **Constraint**: Use Composables only for *global* state (auth, cached data, shared UI state). Local component state should remain in `ref` or `reactive` within the component to avoid polluting the global store.

## 3. Form Validation

**vee-validate + Zod**
- **Why**: Zod provides a type-first schema declaration that integrates perfectly with TypeScript. `vee-validate` provides the Vue bindings to handle form state, touched status, and errors efficiently without manual boilerplate.
- **Constraint**: Schemas should ideally be decoupled from the UI logic (often in separate files or outside the `setup` block) to allow testing and reuse. Client-side validation is non-negotiable.

## 4. Internationalization (i18n)

**vue-i18n**
- **Why**: The standard for Vue applications. Required because the system needs to support multiple communities (Portuguese, English, Spanish).
- **Constraint**: No hardcoded strings in templates. All text must go through `$t()` or `t()`.

## 5. Styling

**Tailwind CSS v4 + SCSS**
- **Why Tailwind**: Rapid UI development using utility classes. Guarantees consistency in spacing, typography, and colors without inventing new CSS classes.
- **Why SCSS**: For complex, component-specific styles or animations where utility classes become too verbose or unmanageable.
- **Constraint**: SCSS must use `@use` instead of `@import` to avoid duplicate CSS generation and scoping issues. Use `<style scoped lang="scss">`.

## 6. Testing

**Vitest**
- **Why**: Native Vite integration makes it lightning fast. API is compatible with Jest, lowering the learning curve. Used for unit testing components and composables.

**Cypress**
- **Why**: Industry standard for E2E testing. Runs in a real browser to ensure the application flows (like creating a Comunero or Asset) actually work from the user's perspective.

## 7. Security & Governance

**Zero-Secret Policy**
- **Why**: Frontend code is visible to the user. Putting secrets in the bundle is a critical security vulnerability.
- **Constraint**: Never commit API keys or hardcode passwords.

**Soft Deletes & Modification History**
- **Why**: As a governance and ledger system (managing community assets and meetings), auditing is critical. Data must never be permanently lost.
- **Constraint**: Destructive actions must have double-verification in the UI. Ensure any "failure" in API calls is gracefully handled and presented to the user.
