---
trigger: always_on
---

# Padrões Vue 3 e TypeScript

Sempre que escrever, editar ou analisar código Vue neste projeto, deve seguir estritamente as seguintes regras:

- **Composition API (Script Setup):** Usa sempre a sintaxe `<script setup lang="ts">`. Evita a Options API ou o `defineComponent` clássico a menos que seja estritamente necessário para compatibilidade.
- **Tipagem Estrita (TypeScript):** Define sempre interfaces ou tipos para Props, Emits e estados complexos. Usa `defineProps<{ ... }>()` e `defineEmits<{ ... }>()`. Evita o uso de `any` em qualquer circunstância.
- **Formulários e Validação:** Utiliza sempre `vee-validate` em conjunto com esquemas `zod` para gerir formulários. Define o schema separadamente para manter o código limpo. **Mandatory Double Callback:** Sempre que utilizar `handleSubmit` em fluxos que exigem auditoria, logs de negócios ou ações em caso de "falha" (ex: falha no login, falha de validação), é OBRIGATÓRIO implementar o segundo callback do `handleSubmit` (o *onInvalidSubmit*) para capturar erros de validação do lado do cliente (Zod), e não depender apenas do `catch` na chamada de API.
- **Internacionalização (I18n):** Nunca escrevas texto diretamente (hardcoded) no template. Usa sempre a função `t()` ou `$t()` do `@nuxtjs/i18n`. **Regra obrigatória:** Sempre que uma nova chave i18n for utilizada, você DEVE obrigatoriamente adicionar a chave e o valor traduzido nos arquivos de locale correspondentes. Nunca referencie uma chave i18n sem garantir que ela existe em todos os arquivos de locale.
- **Reuso e Auto-imports (Nuxt):** Antes de criar qualquer elemento de UI, verifique se já existe um componente correspondente em `components/`. É OBRIGATÓRIO priorizar o uso de componentes como `InputText.vue`, `ButtonPrimary.vue`, etc. **Importante:** O Nuxt realiza o auto-import nativo de componentes (`components/`) e composables (`composables/`); é proibido utilizar `import MyComponent from...` manualmente no `<script setup>` a menos que haja um conflito de nomes explícito.
- **Estilização (SCSS/CSS):** Dá preferência ao uso de SCSS com o padrão `@use` para importar variáveis e mixins globais (ex: `@use '@/styles/colors.scss' as *;`). Evita estilos inline e propriedades CSS mágicas fora do sistema de design.
    - **Mobile First e Responsividade:** É OBRIGATÓRIO utilizar a abordagem *Mobile First* para qualquer nova tela ou componente. Nunca utilize "Magic Numbers" ou media queries manuais (`@media (max-width: 768px)`). Você DEVE importar o arquivo de breakpoints (`@use '@/styles/abstracts/breakpoints' as *;`) e utilizar os mixins oficiais (`@include media-up('md')`, `@include media-down('sm')`) para definir o comportamento responsivo a partir da base mobile.
- **Nomenclatura:** 
    - **Componentes:** PascalCase (ex: `MyComponent.vue`).
    - **Variáveis/Funções:** camelCase (ex: `const myValue = ...`).
    - **Propriedades (Props):** camelCase no JavaScript, kebab-case no template (padrão Vue).
- **Gerenciamento de Estado:** Usa Composables customizados na pasta `composables/` com o hook `useState` do Nuxt para estados globais que precisam de persistência ou partilha entre páginas, garantindo segurança no SSR. Mantém estados locais dentro do componente usando `ref` ou `reactive`. O uso de Pinia está expressamente proibido neste projeto.
- **Roteamento (Nuxt):** O roteamento no Nuxt é baseado em sistema de arquivos. Sempre que criar uma nova página, adicione-a diretamente na pasta `pages/`. A rota correspondente será gerada automaticamente. Não há necessidade de atualizar arquivos de roteador manualmente.