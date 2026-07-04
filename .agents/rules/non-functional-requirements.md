---
trigger: always_on
description: Contém as restrições estritas Não-Funcionais do projeto focando fortemente em Segurança (Zero-Secret, Sanitização, Logs) e Padrões de Desenvolvimento Absolutos em Vue 3 (Composition API estrita, double-callbacks no Vee-Verify, não ao v-html, entre outros).
---

# Descrição do Contexto para Agentes
**Propósito:** Leitura CRÍTICA. Este arquivo é a lei absoluta de formatação, práticas seguras, segurança cibernética e uso de ecossistema para o Front-end. Respeite cegamente as práticas do Vue 3 e TypeScript aqui ditadas sob pena de falha imperdoável de commit.

---

## Non-Functional Requirements

- **Security**: 
  - **Zero-Secret Policy**: No backend credentials, private API tokens, or server connection strings may be committed to version control. They MUST NEVER be hardcoded.
  - **Nuxt Environment Variables**: Use `NUXT_PUBLIC_` prefixed variables (or `runtimeConfig` in `nuxt.config.ts`) for safe public keys. Secret API keys must remain backend-only.
  - **Data Privacy & Sanitization**: Ensure PII (Personal Identifiable Information) is never leaked in `console.log` statements in production environments.
  - **Observability Order**: Business-required logs (auditing, flow confirmation) MUST be triggered before any blocking user interactions (e.g., `alert()`, `confirm()`, or route changes) to ensure they are captured by logging services or debuggers.
  - **Safe HTML**: Strictly forbid direct DOM injection via `v-html` of user-generated content without prior sanitization.
  - **SSR/SSG Safety**: É estritamente proibido acessar objetos do navegador diretamente no escopo root do `<script setup>` (como `window`, `document` ou `localStorage`) sem antes verificar `import.meta.client` ou utilizar composables nativos como `useCookie()`, evitando quebras durante a geração estática (SSG).

- **Mandatory Development Standards (Vue 3 & TypeScript)**:
  - **Composition API**: All components MUST use `<script setup lang="ts">`. Options API is strictly prohibited.
  - **Strict Typing**: Full TypeScript coverage is mandatory. Use of `any` is forbidden. State, Props (`defineProps<{}>()`), and Emits (`defineEmits<{}>()`) must be strongly typed.
  - **State Management**: Use `Composables` globais (com o hook nativo `useState` do Nuxt) para todos os estados globais da aplicação (e.g., Auth, UI state, shared data). O uso de Pinia está proibido. Keep local component state minimal using `ref` and `reactive`.
  - **Form Validation**: Form inputs must be validated client-side using `vee-validate` paired with `zod` schemas. 
    - **Broad Failure Handling**: Business rules requiring feedback or logging on "failure" (e.g., Login Failure) must cover all possible failure points: Client-side validation errors, API response errors, and network connectivity issues.
    - **Mandatory Double Callback**: When using `handleSubmit` from `vee-validate` in flows with auditing or business logs, developers MUST implement both the success and error callbacks to ensure logging parity.
    - **Cleanliness**: Extracted schemas should reside outside the main component file when appropriate to maintain code cleanliness.
  - **Internationalization (i18n)**: Hardcoded user-facing strings are strictly prohibited. The system must support PT, ES, and EN. Every text node must use `$t('key')` or `t('key')` linked to `src/locales/`.
  - **Styling**: SCSS (Scoped `<style scoped lang="scss">`) must be utilized. Global variables must be imported via `@use`. The project also integrates modern atomic CSS (TailwindCSS) where standard scaling applies.
  - **Responsive Architecture**: You MUST implement a "Mobile First" approach. Raw media queries with static pixels (e.g. `@media (max-width: 600px)`) are strictly forbidden. Always import the breakpoints system (`@use '@/styles/abstracts/breakpoints' as *;`) and use the official SCSS mixins (`@include media-up('md')`) to handle responsiveness.
  - **Component Structure**: PascalCase for component filenames, camelCase for JavaScript variables/methods, and kebab-case for component props/attributes in the HTML template.
  - **API Networking (SSG e Caching)**: O uso de funções fetch manuais (`customFetch.ts`) é proibido.
    - **Padrão Nativo**: Todas as requisições ao backend DEVEM utilizar o padrão nativo do Nuxt (`$fetch` / `ofetch`, ou composables como `useFetch` / `useAsyncData`).
    - **Atenção ao Cache de Autenticação**: O composable `useFetch` do Nuxt armazena a resposta em cache agressivo usando a URL como chave. **Nunca** utilize `useFetch` dentro de funções dinâmicas que buscam dados pós-login (como um método `getUser()` após o login ou mudança de conta). Em arquiteturas SPA, o cache manterá os dados oxidados do usuário anterior. Nestes cenários específicos de mudança de contexto dinâmico de autenticação, é OBRIGATÓRIO utilizar o `$fetch` nativo para garantir uma requisição de rede real buscando os dados atualizados sem interferência do cache do Nuxt.
    - **Interceptors**: Interceptors (ex: 401 Unauthorized e JWT refresh tokens) devem ser configurados via Nuxt Plugin para estender o `$fetch` globalmente.

- **Maintainability & Testing (Eficiência TDD)**: 
  - **E2E & Component Testing (Cypress)**: Utilize para testar fluxos reais de usuário, formulários completos e integração com rotas (`cypress/e2e`).
  - **Unit Testing (Vitest)**: Utilize exclusivamente para lógicas isoladas, utilities e composables globais.
  - **Obrigatoriedade TDD Absoluta**: O desenvolvimento orientado a testes (TDD) é **mandatório** e não negociável. O agente @engineer e @qa **DEVEM, obrigatoriamente, criar testes** para **toda e qualquer nova página ou funcionalidade**, independentemente de sua complexidade. Não existem "testes desnecessários". Antes de codificar qualquer componente ou tela, a suite de testes (Vitest ou Cypress) correspondente deve ser criada e falhar (RED) para só depois ser implementada (GREEN). Omissão de testes resultará em rejeição imediata da entrega.
