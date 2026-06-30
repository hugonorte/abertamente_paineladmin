---
description: Start the Autonomous AI Developer Pipeline sequence with a new idea
---

When the user types `/startcycle`, orchestrate the development process strictly using `.agents/agents.md` and `.agents/skills/`.

### Execution Sequence:
1. Certifique-se de estar na branch `dev` ou em uma feature branch derivada de `dev`.
2. Read the task content/idea from the file `task.md`.
3. **Avaliação de Regras de Negócio**:
   - Ler o arquivo `.agents/rules/business-rules.md`.
   - Como **Product Manager**, avaliar se a tarefa em `task.md` conflita com alguma regra existente.
   - **Atualizar Documentação**: Adicionar as novas regras de negócio da funcionalidade em `business-rules.md` antes de prosseguir.
4. Act as the **Product Manager** and execute the `write_specs.md` skill using the idea from `task.md`.
   *(Wait for the user to explicitly approve the spec. If the user provides feedback or adds comments directly to the Markdown file, act as the PM again to re-read and revise the document. Loop this step until they type "Approved").*
5. Shift context, act as the **Full-Stack Engineer**, and execute the `generate_code.md` skill.
6. Shift context, act as the **QA Engineer**, and execute the `audit_code.md` skill.