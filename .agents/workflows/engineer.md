---
description: Orchestrate the implementation phase of the development cycle for Frontend tasks.
---

# Workflow: Engineer Implementation

When acting as the **Full-Stack Engineer**, follow this sequence to translate the approved **Technical Specification** into production-ready frontend code.

### 1. Analysis and Setup
- **Read Specification**: Open `production_artifacts/Technical_Specification.md` and identify all required views, components, and data structures.
- **Review Conventions**: Re-read `.agents/rules/vue-typescript-conventions.md` to ensure project-specific standards (Composition API, I18n, Scoped SCSS) are applied.
- **Security Check**: Review `.agents/rules/security.md` to prevent accidental inclusion of secrets or unsafe data handling.
- **Branching**: Ensure you are on the `dev` branch or creating a feature branch rooted in `dev` before starting work. All PRs must target `dev`.
- **Type safety**: Verifique sempre o uso correto de interfaces e tipos, para que não ocorra erro de validação de Typescript.

### 2. Physical Implementation (TDD Rigoroso)
- **Desenvolvimento Orientado a Testes**:
    - Antes de criar a implementação visual, defina os testes.
    - **Escolha da Ferramenta**: Selecione `Vitest` para lógica/Composables/composables ou `Cypress` para fluxos E2E/interações de UI. **Nunca crie testes que não refletem erros reais.**
    - Siga o fluxo RED -> GREEN -> REFACTOR e exija que os testes passem.
    - **Algoritmo Obrigatório de Validação de Testes**: Todo teste criado ou modificado deve passar pelo seguinte fluxo:
        1. Rode o teste no seu terminal interno.
        2. Se retornou erro, vá para o passo 3. Se não retornou erro (passou verde), vá para o passo 5.
        3. Rode um novo teste (ou adapte o atual) usando uma ferramenta que simula um navegador headless para captar os erros do console do navegador na rota testada. Se der erro no console, capte-o e analise a relação desse erro com a falha original.
        4. Corrija o erro no código fonte e volte ao passo 1.
        5. Apenas após o teste passar no seu terminal (e no console clean), peça para o usuário rodar o teste no ambiente dele.
- **Execute generate_code Skill**: Trigger the `generate_code.md` skill to scaffold and populate the requested features.
- **Component Drafting**:
    - Use **PascalCase** for new components (e.g., `BookForm.vue`).
    - Use `<script setup lang="ts">` for all logic.
    - Implement **Zod schemas** for all form validations.
    - Ensure all user-facing strings use the `$t()` or `t()` i18n functions.
- **Styling**:
    - Use **Scoped SCSS** or **TailwindCSS** as defined in the spec.
    - Import global variables using `@use '@/styles/colors.scss' as *;`.

### 3. Localization and Assets
- **Update Locales**: Ensure all new keys are added to `src/locales/es.json` and `pt.json`.
- **Asset Management**: If the spec requires new icons, add them via `oh-vue-icons`.

### 4. Self-Audit and Handover
- **Syntax Check**: Run `vue-tsc --build` to ensure no TypeScript errors were introduced.
- **Clean Code Review**: Remove any debugging logs or commented-out code.
- **Handover to QA**: Once implementation is complete, signal readiness for the `audit_code.md` skill.