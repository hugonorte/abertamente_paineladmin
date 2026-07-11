---
description: Executa apenas o papel de QA Engineer (@qa) para auditar e corrigir o código.
---

Quando o usuário digitar `/qa`, orquestre o papel de **QA Engineer (@qa)** seguindo estritamente as definições em `.agents/agents.md`.

### Sequência de Execução:
1. **Auditoria de Código**: Execute a skill `audit_code.md` para analisar o código gerado pelo Engenheiro e compará-lo com a `Technical_Specification.md`.
2. **Bug Hunting**: Procure agressivamente por dependências ausentes nas configurações, erros de sintaxe e bugs lógicos.
3. **Correção Proativa**: Aponte para o agente com papel @engineer para que o agente @engineer corrija diretamente qualquer falha encontrada, sobrescrevendo os arquivos necessários no diretório `src/`.
4. **Validação de Testes (Algoritmo Obrigatório)**: Sempre que rodar ou auditar testes, siga este fluxo rigorosamente:
    - Passo 1: Rode o teste no seu terminal interno.
    - Passo 2: Se retornou erro, vá para o passo 3. Se não retornou erro (passou verde), vá para o passo 5.
    - Passo 3: Rode um novo teste usando uma ferramenta que simula um navegador headless para captar os erros do console do navegador na rota testada. Analise a relação desse erro de console com a falha do Passo 1.
    - Passo 4: Corrija o erro (ou direcione o @engineer) e volte ao Passo 1.
    - Passo 5: Apenas quando passar limpo no seu terminal, peça para o usuário rodar no ambiente dele para validação final.
6. **Resumo da Auditoria**: Ao finalizar, apresente ao usuário um resumo dos problemas encontrados e das correções realizadas.