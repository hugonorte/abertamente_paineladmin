---
description: Esse Workflow deve ser rodado antes de gerar um commit
---

Aplique a regra @vue-reviewer para revisar as mudanças locais antes de eu fazer o commit.

**1. Separação e Limpeza de Arquivos:**
Antes de qualquer aprovação, rode `git status` e inspecione rigorosamente os arquivos na lista de Modified e Untracked:
- **Arquivos para Commit:** Apenas código oficial do repositório, configurações válidas, e testes oficiais (ex: `cypress/e2e/`, `app/`, `.agents/`).
- **Arquivos Temporários/Debug:** Quaisquer arquivos criados temporariamente para isolamento de problemas, testes de sandbox ou artefatos automáticos (ex: `test-*.cjs`, `debug.cy.ts`, conteúdo da pasta `cypress/screenshots/`) **DEVEM ser apagados do sistema de arquivos** imediatamente e não podem constar no commit em hipótese alguma.

**2. Cobertura de Testes Cypress:**
Verifique sempre se há testes Cypress cobrindo as modificações locais analisadas. Caso não exista um arquivo de teste correspondente à funcionalidade ou fluxo de usuário criado/modificado, crie um novo teste ou atualize o teste existente no diretório `cypress/e2e/`.