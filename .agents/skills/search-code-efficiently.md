# Skill: Search Code Efficiently (Zero Token Waste)

## Objective

Learn exactly where code lives and what it does **without reading entire files**. Use targeted grep patterns and strategic reads to minimize token consumption.

---

## Rule 1: Never Grep the Entire Project

**❌ Bad**:
```
Tool: grep_search (Query: "MyComponent", SearchPath: ".") # Searches node_modules too → 1000s of hits
Tool: grep_search (Query: "defineProps", SearchPath: ".") # Every component matches → worthless
```

**✅ Good**:
```
Tool: grep_search (Query: "MyComponent", SearchPath: "src/components/", Includes: ["*.vue"]) # Only src code
Tool: grep_search (Query: "ComuneroModel", SearchPath: "src/")                  # Specific area
Tool: grep_search (Query: "defineProps", SearchPath: "src/components/ComuneroDetails/") # Specific component
```

---

## Rule 2: Use Hot Paths List First

From `.agents/rules/project-context-cache.md` and `.agents/memory/03-hot-paths.md`:

**Know these file groups**:
```
🏠 Home & Layout:
  src/App.vue
  src/main.ts
  src/components/Layout/

👥 Membros (Comuneros):
  src/pages/Comuneros.vue
  src/components/ComuneroDetails/

📦 Ativos (Assets):
  src/pages/Assets.vue
  src/components/AssetForm/
```

→ **Start with the hot path list, not blind grep**

---

## Rule 3: Component Structure Pattern

Components usually follow this structure:
```
components/
├── ComuneroDetails.vue
├── Header/
│   └── index.vue
```

**To find a component**:
```
# ✅ Exact path
Tool: list_dir (Path: "src/components/Header/")

# ✅ List all components
Tool: grep_search (Query: "", SearchPath: "src/components/", Includes: ["*.vue"])

# ✅ Find specific component
Tool: grep_search (Query: "Comunero", SearchPath: "src/components/")
```

---

## Rule 4: Page Structure Pattern

Every page route corresponds to a file in the views or pages folder:
```
pages/ (ou views/)
├── index.vue                          → / (home)
├── Comuneros.vue                      → /comuneros
```

**To find a page**:
```
# ✅ List all pages
Tool: list_dir (Path: "src/pages/")

# ✅ Find page by route name
Tool: grep_search (Query: "Comuneros", SearchPath: "src/pages/")

# ✅ Check page structure
Tool: view_file (AbsolutePath: "src/pages/Comuneros.vue", StartLine: 1, EndLine: 30) # Top section (usually template)
```

---

## Rule 5: State & Composable Naming Pattern

Composables use Composables and start with `use`:
```
composables/
├── useComunero.ts
└── useAuth.ts
```

**To find a store/composable**:
```
# ✅ List all stores
Tool: list_dir (Path: "composables/")

# ✅ Find specific logic
Tool: grep_search (Query: "useComunero", SearchPath: "src/")

# ✅ See what's exported
Tool: grep_search (Query: "export const useAuth", SearchPath: "composables/useAuth.ts")
```

---

## Rule 6: i18n Key Location Pattern

All translations in `src/locales/`:
```
locales/
├── pt.json   # Portuguese
├── en.json   # English
└── es.json   # Spanish
```

**To find i18n keys**:
```
# ✅ Search across all languages
Tool: grep_search (Query: "home.title", SearchPath: "src/locales/")

# ✅ Find all keys in a section
Tool: grep_search (Query: "home", SearchPath: "src/locales/pt.json")
```

---

## Rule 7: Test File Location Pattern

Tests are usually co-located or in a `cypress` folder:
```
cypress/e2e/
└── comuneros.cy.ts  # E2E test

src/components/
└── ComuneroDetails.spec.ts  # Unit test
```

**To find a test**:
```
# ✅ List all unit tests
Tool: grep_search (Query: "", SearchPath: "src/", Includes: ["*.spec.ts"])

# ✅ List E2E tests
Tool: list_dir (Path: "cypress/e2e/")

# ✅ Find test for specific feature
Tool: grep_search (Query: "Comunero", SearchPath: "cypress/", Includes: ["*.cy.ts"])

# ✅ Check test syntax
Tool: view_file (AbsolutePath: ".../comuneros.cy.ts", EndLine: 20)  # See imports and describe block
```

---

## Rule 8: Type Definition Location

Global types or models:
```
src/types/
└── models.ts
```

Component-specific types go in the component file.

**To find types**:
```
# ✅ Check global types
Tool: grep_search (Query: "interface\|type", SearchPath: "src/types/")

# ✅ Find component types
Tool: grep_search (Query: "defineProps<\|defineEmits<", SearchPath: ".../ComuneroDetails.vue")

# ✅ Check TypeScript config
Tool: grep_search (Query: "strict\|noUnusedLocals", SearchPath: "tsconfig.json")
```

---

## Rule 9: Asset Location Pattern

```
src/assets/
├── css/ or styles/
│   └── colors.scss             # Global variables
└── img/
    └── [logos, images...]
```

**To find assets**:
```
# ✅ Check SCSS imports
Tool: grep_search (Query: "@import\|@use", SearchPath: "src/styles/")
```

---

## Rule 10: API Services Location

```
src/api/
└── comunerosService.ts
```

**To find API calls**:
```
# ✅ List API services
Tool: list_dir (Path: "src/api/")

# ✅ Find specific endpoint
Tool: grep_search (Query: "axios.get\|api.get", SearchPath: "src/api/")
```

---

## Rule 11: Strategic Full-File Reads (Small Files Only)

✅ **SAFE to read entire file** (<100 lines):
```
Tool: view_file (AbsolutePath: "src/App.vue")              # Root component
Tool: view_file (AbsolutePath: "src/main.ts")              # Entry point
Tool: view_file (AbsolutePath: "vite.config.ts")           # Config
Tool: view_file (AbsolutePath: "tsconfig.json")            # TS config
```

❌ **NOT safe to read entire file** (>200 lines):
```
Tool: view_file without EndLine on src/components/ComuneroDetails.vue  # Don't read whole
Tool: view_file without EndLine on src/pages/Comuneros.vue             # Don't read whole
```

**For large files**:
```
# ✅ Instead of reading entire file:
Tool: view_file (AbsolutePath: "src/pages/Comuneros.vue", StartLine: 1, EndLine: 50)  # Read top part
Tool: grep_search (Query: "defineProps\|defineEmits", SearchPath: "src/pages/Comuneros.vue")  # Find key patterns
```

---

## Rule 12: Search Patterns for Native Tools

### Find all component definitions
```
Tool: grep_search (Query: "", SearchPath: "src/components", Includes: ["*.vue"])
```

### Find all pages
```
Tool: list_dir (Path: "src/pages/")
```

### Find all stores
```
Tool: list_dir (Path: "composables/")
```

### Find component usage
```
Tool: grep_search (Query: "MyComponent", SearchPath: "src/", Includes: ["*.vue"])
```

### Find i18n usage
```
Tool: grep_search (Query: "\$t(\|useI18n", SearchPath: "src/components/")
```

### Find prop definitions
```
Tool: grep_search (Query: "defineProps<", SearchPath: "src/components/")
```

### Find emits
```
Tool: grep_search (Query: "defineEmits<", SearchPath: "src/components/")
```

### Find style imports
```
Tool: grep_search (Query: "@use\|@import", SearchPath: "src/styles/")
```

### Find test files for component
```
Tool: grep_search (Query: "Comunero", SearchPath: "src/", Includes: ["*.spec.ts"])
Tool: grep_search (Query: "Comunero", SearchPath: "cypress/", Includes: ["*.cy.ts"])
```

---

## Rule 13: Use Git to Understand Changes

**Instead of reading code**, use git to understand what changed:

```bash
# ✅ See what changed in a file
git log --oneline src/locales/pt.json | head -5

# ✅ See specific change
git show HEAD~1:src/pages/Comuneros.vue

# ✅ See who changed what
git blame src/components/Header.vue | grep -A2 "defineProps"

# ✅ See recent commits
git log --oneline -15
```

---

## Rule 14: Line-Number-Based Reads (Ultra-Efficient)

When you know the line, read only that using native tools:

```
# ❌ Read whole file
Tool: view_file without EndLine

# ✅ Read just what you need
Tool: view_file (StartLine: 1, EndLine: 30)   # Template
Tool: view_file (StartLine: 31, EndLine: 70)  # Script setup
Tool: view_file (StartLine: 71, EndLine: 100) # Styles
```

**To find line numbers**:
```
Tool: grep_search (Query: "defineProps\|<template>\|<style", MatchPerLine: true)
```

---

## Rule 15: Config Files (Read Smart, Not Hard)

**Key config files** (read strategically):
```
# ✅ Vite config
Tool: grep_search (Query: "plugins:\|resolve:", SearchPath: "vite.config.ts")

# ✅ Package.json
Tool: view_file (AbsolutePath: "package.json")

# ✅ TypeScript
Tool: grep_search (Query: "strict\|lib\|target", SearchPath: "tsconfig.json")

# ✅ Vitest / Cypress
Tool: view_file (AbsolutePath: "vitest.config.ts")
Tool: view_file (AbsolutePath: "cypress.config.ts")
```

---

## Efficiency Checklist

Before reading a file:

- [ ] Is this in the cache (architecture.md, conventions.md, hot_paths.md)?
- [ ] Can I grep instead of read?
- [ ] Can I read just the top 50 lines instead of whole file?
- [ ] Can I use git log to understand the change?
- [ ] Is this a massive file (>500 lines)? If yes, use head/tail/grep only.
- [ ] Have I seen this pattern before? If yes, skip the example.

---

## Example: "I need to understand ComuneroDetails"

**❌ Inefficient (150K tokens)**:
```
1. Read entire ComuneroDetails.vue (500 lines)
2. Read ComuneroDetails.spec.ts (300 lines)
3. Read parent page (400 lines)
4. Read stores used (200 lines)
Total: 1400 lines, 150K tokens
```

**✅ Efficient (3K tokens)**:
```
1. Check conventions.md: component pattern
2. Grep for defineProps in ComuneroDetails: Tool: grep_search
3. Read lines 1-30: Tool: view_file (StartLine: 1, EndLine: 30)
4. Grep for usage: Tool: grep_search
5. Check test structure: Tool: grep_search
6. If specific bug: grep for exact error, then read 5-10 relevant lines
Total: 30 lines strategically read, 3K tokens
```

→ **50x fewer tokens, same understanding**

---

## Performance Tips

**Token per action**:
- Full file read (500 lines): 50K tokens
- Head/tail (50 lines): 5K tokens
- Grep (10 matches): 1K tokens
- Git log (5 commits): 2K tokens

**Always prefer** (in order):
1. Cache/memory files
2. Git history
3. Grep output
4. Head/tail selective read
5. Full file read (last resort)

---

## Quick Reference Commands

Use native AI tools instead of shell pipelines:

```
# List structure
Tool: list_dir

# Find files
Tool: grep_search (Includes: ["*.vue"])

# View key parts
Tool: view_file (StartLine: X, EndLine: Y)
Tool: grep_search (Query: "defineProps\|defineEmits\|<template>\|<style")

# Check i18n
Tool: grep_search (Query: "home.title", SearchPath: "src/locales/")

# See changes (using bash is OK here)
git log --oneline FILE
git diff HEAD~1 FILE
```

---

**Remember**: Every line you read costs tokens. Read strategically, grep aggressively, cache first.
