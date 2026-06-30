---
trigger: always_on
---

# Proteção de Informações Sensíveis (Frontend)

Esta regra visa prevenir o vazamento de dados sensíveis para o repositório Git e garantir que segredos não sejam expostos indevidamente no bundle final enviado ao navegador.

## Regras de Segurança:

- **Não incluir Credenciais:** Nunca escreva senhas, tokens de API privados, segredos de clientes ou chaves de criptografia diretamente no código-fonte.
- **Uso de Variáveis de Ambiente (Vite):** 
    - Utilize o arquivo `.env` para armazenar URLs de API e outras configurações.
    - No Vite, apenas variáveis prefixadas com `VITE_` são expostas ao código do cliente. **Nunca** use este prefixo para segredos que devem permanecer privados ao servidor ou ambiente de build.
    - Acesse as variáveis via `import.meta.env.VITE_NOME_DA_VARIAVEL`.
- **Verificação Proativa:** Antes de finalizar qualquer tarefa que envolva criação ou edição de arquivos de configuração, componentes de autenticação ou serviços de API, verifique se campos como `Password`, `Secret`, `Token` ou `Key` não possuem valores padrão expostos no código.
- **Sanitização de Logs e UI:** 
    - Garanta que `console.log` não capture informações sensíveis dos usuários (PII) ou tokens de autenticação em ambiente de produção.
    - Não exiba mensagens de erro detalhadas do backend (stack traces, erros de SQL) diretamente na interface do usuário.
- **Armazenamento Local:** Evite armazenar informações altamente sensíveis (como senhas em texto puro) em `localStorage` ou `sessionStorage`. Prefira o uso de cookies `HttpOnly` (gerenciados pelo backend) sempre que a arquitetura o permitir.
- **Dados de Teste:** Use apenas dados fictícios/mockados para testes e exemplos. Nunca use dados reais de usuários ou chaves de produção em arquivos de teste ou documentação.
- A autenticação do usuário é feita utilizndo JWT com refresh token, nenhuma informação sensível deve ficar armazenada no local storage do navegador, nem em cookies de usuário. Caso precise verificar alguma especificação de backend, use o MCP Server do github e acesse `https://github.com/pstgorg/AbertamenteQqahuacDevelopment.git`.
