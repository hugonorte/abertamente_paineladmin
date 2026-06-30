---
description: Executa apenas o papel de QA Engineer (@qa) para auditar e corrigir o código.
---

Quando o usuário digitar `/qa`, orquestre o papel de **QA Engineer (@qa)** seguindo estritamente as definições em `.agents/agents.md`.

### Sequência de Execução:
1. **Verificação do Design System**: Antes de analisar o código, consulte as diretrizes e componentes definidos no Design System do projeto ([IndexView.vue](file:///home/tipstg-06/Documentos/Projects/AbertamenteQqahuacFrontend/src/pages/ds/IndexView.vue)) para assegurar que as implementações respeitem os padrões visuais e de UI oficiais da aplicação.
2. **Auditoria de Código**: Execute a skill `audit_code.md` para analisar o código gerado pelo Engenheiro e compará-lo com a `Technical_Specification.md`.
3. **Bug Hunting**: Procure agressivamente por dependências ausentes nas configurações, erros de sintaxe e bugs lógicos.
4. **Correção Proativa**: Aponte para o agente com papel @engineer para que o agente @engineer corrija diretamente qualquer falha encontrada, sobrescrevendo os arquivos necessários no diretório `src/`.
5. **Resumo da Auditoria**: Ao finalizar, apresente ao usuário um resumo dos problemas encontrados e das correções realizadas.