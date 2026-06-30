# Descrição do Contexto para Agentes
**Propósito:** Define as regras rígidas para a criação e manutenção da Landing Page do Design System. Serve como template gerador para futuros Design Systems. Após a aprovação deste arquivo, todos os agentes geradores de código Frontend devem NECESSARIAMENTE seguir tudo o que estiver documentado aqui para toda e qualquer criação de código.

---

## Template Builder: Questionário de Geração
Para gerar o Design System completo deste projeto a partir desta regra, o agente deve inicialmente fazer as seguintes perguntas ao usuário para definir as fundações do design:

1. **Cores**: Quais são as cores primárias, secundárias, de aviso e de erro originais (hex/rgba)? *(Elas deverão ser mapeadas para variáveis SCSS)*.
2. **Tipografia**: Qual a família de fonte principal e secundária do projeto?
3. **Estilo de Botões**: Qual o estilo base para os botões do sistema (ex: qual o `border-radius`, estilo de `box-shadow` e tamanho de `padding` padrão)?
4. **Espaçamento**: Qual a escala matemática do espaçamento (ex: base em 4px, 8px, etc)?
5. **Títulos**: Quais os pesos (font-weight) e tamanhos base (font-size) exigidos para Títulos de H1 a H6 e Corpo de texto?
6. **Z-Index**: Como o sistema lida com o Z-Index para elementos flutuantes (ex: nível de navbars, modais, tooltips)?
7. **Bordas e Elevação**: Quais são as diretrizes para bordas (border-width e color) e sombras (level 1, 2, 3)?

Com base nas respostas, o agente será capaz de montar as propriedades CSS do Design System com exatidão.

---

## Estrutura Funcional da Landing Page
A página que hospeda o Design System reside em `src/pages/ds/` e é gerida modularmente. Regras OBRIGATÓRIAS:

- **Componentização:** O arquivo `index.vue` funciona **apenas** como um Container e Roteador visual. Cada seção do Design System deve obrigatoriamente ser separada em um componente na pasta `components/ds/` (ex: `DsColors.vue`, `DsComponents.vue`).
- **Navegação Inteligente e ScrollSpy:** O menu lateral de navegação deve aplicar a classe `.active` baseado no elemento que está em exibição na viewport via IntersectionObserver.
- **Busca Global Integrada:** O `index.vue` compartilha a string de busca para seus componentes filhos via props, e cada componente filho oculta seus blocos caso eles não batam com a pesquisa.
- **Componentes Vivos e Exemplos de Código:** Todas as menções a botões, modais ou forms devem usar os componentes reais instalados no projeto, acompanhados de seu código via o helper `DsCodeBlock.vue` que fornece a função "Copiar Código".

---

## Tópicos Obrigatórios na Documentação Visual

### 1. Dos and Don'ts (`DsDosDonts.vue`)
- Deve conter exemplos visuais de contraste de cor ruim vs bom, alinhamento quebrado vs alinhamento do grid, e uso de classes SCSS permitidas vs estilos CSS injetados manualmente.
- Botões nos exemplos devem usar **Slots** para labels, nunca a prop `text=""`. Exemplo correto: `<ButtonPrimary>Salvar</ButtonPrimary>`.

### 2. Cores (`DsColors.vue`)
- Regra Magna: Exigir o uso EXCLUSIVO de variáveis SCSS declaradas no arquivo `src/styles/_colors.scss` e dos Helpers do Tailwind onde aplicável.
- Deve renderizar as swatches das paletas primárias (`$primary` = `#64040d`), secundárias e de estado (`$success`, `$danger` = `#dc3545`, etc).
- PROIBIÇÃO ABSOLUTA: O uso de Hexadecimal cru (como `#FFF`) ou RGBA diretamente nos arquivos `.vue`.

### 3. Tipografia e Cores de Texto (`DsTypography.vue`)
- Demonstrar as escalas reais do projeto para as tags H1 a H6.
- Ensinar o uso de `line-height` para parágrafos.
- **Obrigatório incluir a cor padrão de cada nível tipográfico:**
  - **H1**: `text-3xl`, `font-bold` (700), cor `$red_dark7` / `#dc3545`.
  - **H2**: `text-2xl`, `font-semibold` (600), cor `$dark` / `#333333`.
  - **H3**: `text-xl`, `font-medium` (500), cor `$dark` / `#333333`.
  - **H4**: `text-lg`, `font-medium` (500), cor `$secondary` / `#6c757d`.
  - **Body**: `text-base`, `font-normal` (400), cor `text-gray-700`.
  - **Small/Hints**: `text-sm`, cor `text-gray-500`.

### 4. Componentes Globais (`DsComponents.vue`)
O projeto possui diversas bibliotecas próprias criadas sob medida. Todas elas devem estar documentadas no DS:
- **Botões:** `ButtonPrimary.vue`, `ButtonSecondary.vue`, `ButtonPrimaryOutline.vue`. Botões usam **Slots** para texto, NÃO props `text=""`. Exemplo: `<ButtonPrimary>Salvar Alterações</ButtonPrimary>`.
- **Formulários:**
  - `InputText.vue` — Props: `type`, `id`, `name`, `modelValue`, `required`, `label`, `labelSuffix`, `placeholder`, `disabled`, `errorMessage`.
  - `SelectOption.vue` — Props: `id`, `name`, `label`, `required`, `disabled`, `errorMessage`, `options` (array de `{ value, label }`).
  - `CheckboxGroup.vue` — Props: `name`, `options` (array de `{ label, value }`), `modelValue`, `errorMessage`.
  - `TextArea.vue` — Props: `id`, `name`, `label`, `modelValue`, `required`, `placeholder`, `disabled`, `rows`, `cols`, `errorMessage`.
  - `InputFile.vue` — Props: `accept`, `id`, `name`, `required`, `label`, `placeholder`, `disabled`, `errorMessage`, `modelValue`, `index`.
  - `InputButton.vue` — Props: `type`, `id`, `name`, `modelValue`, `required`, `label`, `placeholder`, `disabled`, `errorMessage`, `btnLabel`.
  - `TooltipComponent.vue` — Props: `tooltip` (string, required).
- **Mocks (Componentes que não existem nativamente):** `Radio Button`, `Toggle Switch` e `Date Time Picker` (via `InputText type="datetime-local"`). Estes devem ser documentados como mocks visuais até que componentes dedicados sejam criados.

A documentação de cada componente DEVE listar **TODAS** as props disponíveis. É desnecessário mostrar blocos de importação manual no `<script setup>`, pois o Nuxt já realiza o auto-import nativo de componentes da pasta `components/`.

### 5. Imagens e Ícones (`DsMedia.vue`)
- Documentar o componente `Avatar` e outros elementos visuais reutilizáveis.

### 6. Loading (`DsLoading.vue`)
- Documentar o `LoadingSign.vue` com um botão interativo que demonstra o comportamento real (fullscreen overlay com gif de loading).
- Props do `LoadingSign.vue`: `show` (boolean, required).

### 7. Modais (`DsModals.vue`)
- Documentar usando os **componentes reais** do projeto, NÃO mocks estáticos.
- **`ModalComponent.vue`** — Props: `show` (boolean). Emits: `close`. Usa Slot default para conteúdo interno. Deve ter um botão "Abrir" que dispara o modal real.
- **`ModalMulti.vue`** — Props: `type` (`'warning' | 'info' | 'success' | 'danger' | 'approve' | 'reject' | 'default'`), `title`, `subTitle`, `instructions`, `isModalOpen`, `btnQuantity`, `ifTrueLabel`, `ifFalseLabel`, `ifTrueAction`, `ifFalseAction`. Emits: `close`. Deve ter um botão "Abrir" que dispara o modal real.
- **`AbsenceJustificationModal.vue`** — Modal específico de negócio (documentação informativa apenas).

### 8. Estrutura Visual (`DsLayouts.vue`)
- **`DashboardLayout.vue`**: Wireframe com sidebar + header + content area. Deve residir em `layouts/`.
- **`login.vue`**: Wireframe com background de imagem, container centralizado com símbolo, título, formulário (e-mail + senha), link de reset e logo.
- **Nota:** O `PublicLayout.vue` NÃO deve ser incluído nesta seção, mas sim na pasta raiz `layouts/`.

---

## Regras Adicionais Obrigatórias

- **Autoatualização após layouts:** Sempre que um agente criar ou alterar um layout, ele deve revisar e atualizar as especificações relevantes deste Design System e das regras de sistema aplicáveis para manter a documentação alinhada ao que foi implementado.
- **Alinhamento visual obrigatório:** Ao criar telas ou componentes, o agente deve priorizar alinhamento consistente dos elementos HTML tanto em largura quanto no eixo horizontal, usando grids/flex responsivos e dimensões estáveis quando necessário.
- **Sempre prefira SCSS ao Tailwind**: O Tailwind CSS deve ser utilizado somente em tarefas básicas de layout (flex, grid, spacing). A prioridade absoluta é usar as variáveis e classes SCSS do projeto e os tokens definidos em `_colors.scss`.
- **Documentação Completa**: Adicione no Design System TODOS os componentes existentes neste projeto localizados dentro da pasta `/components`.
- **Listagem de Props**: Liste TODAS as props de cada componente na documentação (com funcionalidade de copiar o código). Nunca omita props — a documentação deve ser a fonte da verdade.
- **Labels nos Botões via Slots**: Os botões do projeto usam **Slots** para conteúdo textual, NÃO a prop `text=""`. Exemplos no DS devem refletir isso fielmente: `<ButtonPrimary>Texto</ButtonPrimary>`.
- **Cores Oficiais**: Respeite estritamente as cores definidas no `src/styles/_colors.scss` e garanta que elas estejam atualizadas no Design System. Valores de referência atuais: `$primary` = `#64040d`, `$danger` = `#dc3545`.
- **Modais Reais**: A seção de modais deve renderizar os componentes reais (`ModalComponent`, `ModalMulti`) com botões de trigger, nunca usar mocks HTML estáticos.
- **Componentes Vivos**: Sempre que possível, use os componentes reais importados do projeto em vez de mocks. Mocks visuais em CSS só devem ser usados para componentes que ainda não existem no projeto.

> **Aviso Final a todos os Agentes**: A partir da oficialização dos tokens e componentes neste Design System, eles formam a LEI para qualquer geração de tela. É expressamente proibido "inventar" inputs HTML puros quando já possuímos `InputText.vue` ou botões puros `<button>` quando possuímos `ButtonPrimary.vue`. Verifiquem o DS sempre!
