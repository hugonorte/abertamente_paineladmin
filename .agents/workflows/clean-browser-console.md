---
description: Avalia e limpa erros e warnings do console do navegador para uma rota específica usando Puppeteer.
---

Quando o usuário digitar `/clean-browser-console`, você deve obrigatoriamente seguir este fluxo passo a passo:

### Sequência de Execução:

1. **Solicitar Rota ao Usuário**: A primeira ação DEVE ser perguntar explicitamente ao usuário qual rota ele quer testar. Peça para o usuário copiar a URL do navegador e colar no chat. **Aguarde a resposta do usuário antes de prosseguir**.
2. **Processar a Rota**: Assim que o usuário informar a rota, você deve limpá-la, removendo domínios como `http://localhost:5173`, mantendo apenas o path absoluto (ex: `/dashboard`, `/membros/lista`).
3. **Navegação e Captura (Puppeteer)**: De forma automática e headless, utilize o script de Puppeteer (como o `capture-console.js`) ajustado para navegar até a rota indicada pelo usuário, passando pelo login se necessário. O script deve avaliar e capturar todos os logs do console do navegador (erros, warnings e falhas de rede).
4. **Análise e Plano (@pm)**: Acione o agente **Product Manager (@pm)** para analisar as saídas do console. O @pm deve identificar os componentes e arquivos causadores dos problemas e elaborar um Plano de Implementação (`implementation_plan.md`) para corrigi-los.
5. **Aprovação do Usuário**: Apresente o resumo do Plano de Implementação ao usuário e **peça permissão explícita** para realizar as edições no código. Pare e aguarde a aprovação.
6. **Execução das Correções (@engineer)**: Após a aprovação do usuário, acione o **Full-Stack Engineer (@engineer)** para fazer as modificações exatas propostas no plano de implementação, garantindo que o console daquela rota fique completamente limpo e livre de falhas ou avisos indesejados.
