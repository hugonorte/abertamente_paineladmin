# Descrição do Contexto para Agentes
**Propósito:** Define o padrão de implementação de paginação a ser utilizado no projeto, em alinhamento com a arquitetura do backend.

---

## Padrão de Paginação (Keyset / Cursor Pagination)

O sistema deve adotar preferencialmente o modelo de Keyset Pagination (Cursor Pagination) ao consumir endpoints de listagem paginados.

### Contrato Padrão da API
- **Requisição:** Os endpoints de listagem devem aceitar os parâmetros opcionais na query string:
  - `cursor` (number/string | nulo)
  - `pageSize` (number, com valor default, por exemplo 5 ou 10)
- **Resposta:** O payload retornado deve estar encapsulado em um formato similar a:
  ```typescript
  interface PagedResponse<T> {
      data: T[];
      nextCursor: number | null;
      hasNextPage: boolean;
  }
  ```

### Lógica de Navegação no Frontend (Stores/Componentes)
Para possibilitar a navegação bidirecional ("Próximo" e "Anterior") utilizando um único `nextCursor` e mantendo a performance do keyset, o store deve implementar um histórico de cursores.

- **Estado Recomendado:**
  - `cursorHistory: number[]` (Pilha de cursores passados)
  - Variável para o `cursor` da requisição atual.
- **Botão Próximo (Next):**
  - Só deve estar habilitado se `hasNextPage` for `true`.
  - Ao ser acionado, o `nextCursor` retornado da requisição atual deve ser adicionado ao final do `cursorHistory`.
  - A próxima requisição usará este `nextCursor`.
- **Botão Anterior (Previous):**
  - Só deve estar habilitado se a pilha `cursorHistory` não estiver vazia.
  - Ao ser acionado, remove-se o último item da pilha `cursorHistory`.
  - A requisição será feita com o novo último item da pilha, ou `null` se a pilha estiver vazia (primeira página).
- **Reset de Paginação:**
  - Sempre que houver uma alteração em filtros de busca, ordenação ou re-montagem crítica da lista, o `cursorHistory` e o cursor atual devem ser reiniciados/limpos.
