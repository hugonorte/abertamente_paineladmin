---
description: Executa a suíte de testes E2E/Componentes com o Cypress no Frontend.
---

# Workflow: Executar Testes do Sistema (Cypress)

Este workflow automatiza a execução de testes E2E (End-to-End) e/ou componentes para validar a integridade das interfaces e fluxos do usuário após alterações no projeto Frontend.

## Passos:

1. Coleta de Contexto
- **Ação:** Pergunte ao usuário: "Qual é o arquivo Cypress que deseja rodar os testes?"
- **Variável:** Guarde a resposta como `{{cypress_file_name}}`.
- **Respostas possíveis do usuário:** Nome específico de um arquivo ou "todos". Caso o usuário responda 'todos', todos os arquivos da pasta 'cypress/e2e' deverão ser rodados em modo headless.

// turbo

2. Executa o comando de testes em modo headless no diretório raiz:

   ```bash
   npx cypress run
   ```
   *(Nota: Caso existam testes unitários vitest que devam rodar em conjunto, execute `npm run test:unit` primeiro).*

3. Exibe o resultado da execução dos testes (passes, fails, pending) para o usuário.
4. Se houver falhas, sugere a análise dos logs de erro no terminal e vídeos/screenshots (gerados pelo Cypress na pasta `cypress/screenshots` ou `cypress/videos`) para correção do componente.