---
title: "Hot Paths"
description: Frequently modified files vs. stable code, and feature breakdown
---

# Hot Paths (Abertamente)

This document helps agents quickly locate relevant code without searching blindly. It maps domains to their physical locations in the Vue 3 application.

## High-Frequency Zones (Where most work happens)

- `src/components/` — New components or UI updates.
- `src/pages/` (or `views/`) — Adding new screens or routes.
- `src/locales/` — Updating i18n keys for any new text.
- `src/api/` — Connecting new backend endpoints.
- `cypress/e2e/` — Adding/fixing E2E tests for new features.

## Critical Impact Zones (Modify with extreme caution)

- `vite.config.ts` — Build system and Vite plugins. Breaks the build if misconfigured.
- `src/main.ts` — App entry point. Adding global plugins here affects the entire app.
- `src/router/index.ts` — Route definitions and Navigation Guards. Breaks access control.
- `src/i18n.ts` — i18n initialization.
- `src/styles/colors.scss` — Global design tokens. Modifying this changes the look of the whole app.

## By Feature Area (Domain Mapping)

### 👥 Comuneros (Community Members)
- **Pages**: `src/pages/Comuneros.vue`, `src/pages/ComuneroForm.vue`
- **Components**: `src/components/ComuneroDetails/`, `src/components/FamilyLinks/`
- **Store**: `composables/useComunero.ts`
- **API**: `src/api/comunerosService.ts`

### 📦 Assets & Properties (Terrains, Livestock, etc.)
- **Pages**: `src/pages/Assets.vue`, `src/pages/TerrainMap.vue`
- **Components**: `src/components/AssetForm/`, `src/components/LivestockList/`
- **Store**: `composables/useAsset.ts`

### 📜 Books & Meetings (Governance)
- **Pages**: `src/pages/Assemblies.vue`, `src/pages/Books.vue`
- **Components**: `src/components/MeetingMinutes/`, `src/components/AttendanceTracker/`

### 💰 Transactions
- **Pages**: `src/pages/Transactions.vue`
- **Components**: `src/components/TransactionLedger/`

### ⚙️ Core / Shared Layout
- **Layout components**: `src/components/Header/`, `src/components/Sidebar/`, `src/components/Footer/`
- **Shared UI**: `src/components/ButtonPrimary.vue`, `src/components/InputText.vue`, `src/components/ModalMulti.vue`
- **Auth**: `composables/useAuth.ts`, `src/api/authService.ts`

## Where Things Usually Break

1. **i18n Keys Missing**: Modifying a template but forgetting to update `src/locales/*.json`.
2. **TypeScript Types**: Changing an API response format in `src/api/` without updating the corresponding interface in `src/types/`.
3. **Form Validation**: Updating a `Zod` schema but forgetting to handle the error states in the UI component.
4. **Router Guards**: Adding a new page but forgetting to add `meta: { requiresAuth: true }` in `src/router/index.ts`.
