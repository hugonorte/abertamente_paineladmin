---
trigger: always_on
description: Regras críticas que atuam sobre a integridade e Segurança do banco de dados na transição para Produção. Especifica o bloqueio absoluto à mock-data em prod e a exigência de dupla verificação em comandos destrutivos UI.
---

# Descrição do Contexto para Agentes
**Propósito:** Segurança de deploy. Consulte sempre que estiver desenvolvendo exclusões de tabelas, exclusões na interface (modais/alertas) ou usando dummy-data (Mocks) em instâncias conectadas à produção visando sanear o aplicativo de dados incorretos e vazamentos.

---

## Safety & Governance

### Production Data Protection
- **No Mock Data in Production**: All static mock templates or dummy users used during development must be actively purged before deploying to production.
- **User Validation**: Destructive operations within the UI must feature double-verification modals ("Are you sure you want to delete...?").
