---
trigger: always_on
description: Guia as operações de linha de comando base para executar, testar e versionar a aplicação. Contém os mandamentos E2E (cypress run/open) e a forte Estratégia de Branches adotada (baseando no dev sempre e consolidando na master).
---

# Descrição do Contexto para Agentes
**Propósito:** Workflow obrigatório. Ensina o agente a como rodar testes de Type-Check, Cypress e define a topologia estrita de GitFlow (criar PRs apenas baseados na branch dev e focar deploys nela).

---

## Developer Workflow & Environment

### Environment Setup
- **Dependencies Installation**: 
  ```bash
  npm install
  ```
- **Local Development Server**: 
  ```bash
  npm run dev
  ```
- **TypeScript Compilation Check**: 
  ```bash
  npm run type-check
  # or
  npx nuxi typecheck
  ```

### Cypress Testing Workflow
- **Headless E2E Execution**:
  ```bash
  npx cypress run
  ```
- **Interactive E2E Execution**:
  ```bash
  npm run cy:open
  ```

### Git Flow & Branching Strategy
- **Base Branch**: The `dev` branch is the primary integration branch for all development.
- **Development Process**: All new features, refactors, and bug fixes must branch off from `dev`.
- **Pull Requests**: After development is complete, a Pull Request must be opened targeting the `dev` branch for review and integration.
- **Production Releases**: Merges to `master`/`main` are reserved for stable, production-ready releases (typically via `dev` -> `master`).
