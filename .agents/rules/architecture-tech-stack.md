---
trigger: always_on
description: Dita a pilha tecnológica explícita utilizada no projeto, garantindo conformidade. Consultar para confirmar versões de pacotes e a lista fechada de bibliotecas oficiais permitidas.
---

# Descrição do Contexto para Agentes
**Propósito:** Define a stack de tecnologias aceita do repositório. O agente deve recusar a sugestão ou instalação de qualquer framework / pacote arquitetural / padrão CSS ou motor de estado que fuja do escopo aqui definido.

---

## Architecture & Tech Stack
- **Library/Framework**: Nuxt 3 (com Vue 3 Composition API)
- **Language**: TypeScript
- **Build Tool**: Nuxt (Nitro / Vite)
- **State Management**: Nuxt Composables (useState / ref)
- **Routing**: Nuxt Routing (File-based routing em `pages/`)
- **Form Management Validation**: vee-validate + Zod
- **Internationalization**: @nuxtjs/i18n
- **Styling**: SCSS como primário/majoritário + Tailwind CSS v4 (apenas para renderização dos componentes padrão do NUXT UI). Qualquer customização extra deve usar SCSS.
- **Testing**: Cypress (E2E), Vitest (Unit)
- **Package Manager**: npm
