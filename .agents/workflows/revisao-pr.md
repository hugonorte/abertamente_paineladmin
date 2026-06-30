---
description: Este workflow automatiza a revisão de código em repositórios GitHub seguindo os padrões sênior de Vue 3, TypeScript e Tailwind CSS v4 / SCSS.
---

# Workflow: Review Automático de Pull Request Vue 3 Frontend

Este workflow automatiza a revisão de código em repositórios GitHub seguindo os padrões sênior de Vue 3 e TypeScript.

## 🏁 Trigger

Comando: "Iniciar revisão de PR" ou "Simular CodeRabbit"

## 📝 Passos do Workflow

### Passo 1: Coleta de Contexto

- **Ação:** Pergunte ao usuário: "Qual é o ID do Pull Request que você deseja revisar?"
- **Variável:** Guarde a resposta como `{{PR_ID}}`.

### Passo 2: Listagem de Arquivos

- **Ação:** Use a ferramenta `github-mcp.list_pull_request_files` ou equivalente (`pull_request_read` com o método `get_files`) informando o `{{PR_ID}}`.
- **Filtro:** Identifique os arquivos modificados do frontend, priorizando arquivos com extensão `.vue`, `.ts`, `.js` e `.json` (dicionários de tradução).

### Passo 3: Análise e Crítica

- **Ação:** Para cada arquivo identificado:
  1. Leia o conteúdo do diff/arquivo.
  2. Aplique rigorosamente a regra `@vue-reviewer`.
  3. Identifique violações de: Composition API (uso obrigatório de `<script setup lang="ts">`), Tipagem Estrita (ausência de `any`), Gerenciamento de Estado (uso do Composables para estados globais), Validação de Formulários (uso de `vee-validate` + `zod` com callback duplo no `handleSubmit`), Internacionalização (uso obrigatório de `vue-i18n` com as chaves inseridas em `pt.json` e `es.json`), Estilos (uso de SCSS scoped com `@use` ou Tailwind CSS v4) e Segurança (sanitização de `v-html` e zero secrets).
  4. Caso exista alguma revisão pendente, o agente deve ser interrompido imediatamente e avise o usuário para que ele finalize a pendência.

### Passo 4: Publicação de Comentários

- **Ação:** É **obrigatório** deixar um comentário no PR.
  - Se encontrar problemas: Use as ferramentas do GitHub (ex: `add_comment_to_pending_review`) para postar cada sugestão diretamente na linha correspondente no GitHub e submeta a revisão.
  - Se o código estiver perfeito: Poste um comentário geral no PR parabenizando o desenvolvedor e confirmando que tudo está correto.
- **Tratamento de Erros de Autenticação:** Caso ocorra qualquer erro de autenticação ou permissão (por exemplo, erros de token, permissões negadas ou falta de escopo na API do GitHub) que impeça a postagem dos comentários no PR:
  1. Informe de maneira explícita no chat para o usuário que houve um problema de autenticação/permissão com a API do GitHub.
  2. Apresente um passo a passo detalhado do que o desenvolvedor deve fazer para configurar ou corrigir as credenciais do GitHub (por exemplo, gerar um Personal Access Token com escopo de escrita em repositórios, configurar variáveis de ambiente e ajustar as configurações do MCP server).

### Passo 5: Verificar necessidade de ajustes

- **Ação:** Havendo necessidade de ajustes:
  - Acionar o agente @pm conforme o arquivo agents.md, que deverá montar um Implementation-plan para aprovação do usuário
  - Caso o usuário aprove o implementation-plan do passo anterior, acionar o agente @engineer conforme o arquivo agents.md para implementar os ajustes
  - Após o @engineer efetuar os ajustes, acionar o agente @qa
- **Ação:** Não havendo necessidade de ajustes:
  - Prosseguir para o passo 6 (finalização)

### Passo 6: Finalização

- **Ação:** Informe ao usuário: "Revisão concluída no PR #{{PR_ID}}. Você pode conferir os comentários diretamente no GitHub."
