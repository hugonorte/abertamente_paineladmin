---
description: Esse Workflow deve ser rodado antes de gerar um commit
---

Aplique a regra @vue-reviewer para revisar as mudanças locais antes de eu fazer o commit.

Além disso, verifique sempre se há testes Cypress cobrindo as modificações locais analisadas. Caso não exista um arquivo de teste correspondente à funcionalidade ou fluxo de usuário criado/modificado, crie um novo teste ou atualize o teste existente no diretório `cypress/e2e/`.