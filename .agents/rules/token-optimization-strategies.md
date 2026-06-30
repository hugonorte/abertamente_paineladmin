# Token Optimization Strategies

Practical techniques to minimize token consumption when working on this Abertamente Vue 3 project.

---

## Strategy 1: Cache-First Approach

**Rule**: Always read cache before exploring code.

```
Context needed? → Read .agents/rules/project-overview.md (3KB)
├─ Understand tech stack ✓
├─ Know key commands ✓
└─ See quick patterns ✓

Need more detail? → Read specific memory file (2-5KB)
├─ architecture.md for structure
├─ conventions.md for patterns
├─ hot_paths.md for file locations
└─ tech_decisions.md for rationale
```

**Token savings**: ~90K per conversation by avoiding full codebase reads

---

## Strategy 2: Grep-First Code Location

**Rule**: Use grep patterns to locate code, not full file reads.

### Instead of:
```
# ❌ Reading entire src/components/ComuneroDetails/ (10KB)
# → Reads whole component, composables, tests
# → 50K tokens
```

### Do this:
```
# ✅ Use native grep_search tool
Tool: grep_search
Query: "defineProps"
SearchPath: "src/components/ComuneroDetails/"
# → Returns 2 matches (50 lines)
# → 1K tokens
```

**Patterns to search** (from `hot_paths.md`):
```
# Find component structure
grep_search: "defineProps\|defineEmits" in src/components/[NAME]/

# Find i18n usage
grep_search: "\$t(" in src/pages/[PAGE_NAME].vue

# Find composable usage
grep_search: "use[A-Z]" in src/composables/

# Find tests
grep_search: "[NAME]" in "*.spec.ts" or "*.cy.ts" files

# Find page routes
list_dir: src/pages/ (ou src/views/)
```

**Token savings**: ~40K per code location by targeted grep

---

## Strategy 3: Layered Reading (Not Full File Reads)

**Rule**: Use native `view_file` tool with StartLine and EndLine to read files in layers, not whole files at once. Avoid using bash commands like `head` or `tail` as they consume structural tokens.

### Antipattern:
```
# ❌ Read entire ComuneroDetails.vue (500 lines)
# → Includes template, script, styles all at once
# → 20K tokens
```

### Better:
```
# ✅ Read only relevant section using native tools
Tool: view_file
AbsolutePath: src/components/ComuneroDetails/ComuneroDetails.vue
StartLine: 1
EndLine: 50    # Template only
```

**Token savings**: ~60% reduction by reading only needed sections

---

## Strategy 4: Pattern Reuse (Don't Repeat Discovery)

**Rule**: If you've seen the pattern, don't read another example.

### Pattern Examples (read ONCE):
```
✓ Component structure: Read one, apply to all
✓ Page structure: Read one, apply to all
✓ Store pattern (Composables): Read one, apply to all
✓ Test pattern: Read one, apply to all
✓ i18n usage: Read one, apply to all
```

**From conventions.md**, you know:
- **Component**: `components/[NAME].vue` or `components/[NAME]/index.vue`
- **Page**: `pages/[kebab-case].vue`
- **Store**: `composables/use[PascalCase].ts`
- **Test**: Vitest (Unit) and Cypress (E2E)
- **i18n**: `$t('key.path')` in templates, `useI18n()` in script

→ **You know the pattern. Don't re-read it.**

**Token savings**: ~30K per task by reusing patterns

---

## Strategy 5: Git History Instead of Code Reading

**Rule**: Use git log/blame to understand decisions, not code exploration.

```bash
# ✅ Understand why i18n changed
git log --oneline src/locales/ | head -5

# ✅ Understand recent changes
git log --oneline -10

# ✅ Understand who did what
git blame src/components/Header/Header.vue | grep -A2 "defineProps"

# ✅ See exact diff
git diff HEAD~5 src/components/Header/Header.vue
```

**Token savings**: ~15K per decision by avoiding code analysis

---

## Strategy 6: Selective Test/Spec Reading

**Rule**: Read test files (not component files) to understand behavior.

```
# ✅ Instead of reading ComuneroDetails.vue:
Tool: view_file
AbsolutePath: src/components/ComuneroDetails.spec.ts

# Tests show:
# - What inputs are expected
# - What outputs are generated
# - What edge cases exist
# - All in 50 lines (vs 500 for component)

# Then read only component's 5 relevant lines using StartLine/EndLine
```

**Token savings**: ~80% when learning component behavior from tests

---

## Strategy 7: Block Patching (Never Rewrite Full Files)

**Rule**: Always use block-level editing tools (`replace_file_content` or `multi_replace_file_content`) to modify code. Never generate the entire file content in your response or use tools that overwrite the whole file for small changes.

### Antipattern:
```
# ❌ Writing a 300-line file to change 2 lines
# → Consumes massive output tokens
# → Slow and expensive
```

### Better:
```
# ✅ Use surgical native replacement tools
Tool: multi_replace_file_content
TargetContent: "old line"
ReplacementContent: "new line"
```

**Token savings**: Reduces output tokens by up to 90% per edit.

---

## Strategy 8: Constraint-Based Filtering

**Rule**: Know the constraints, filter out non-applicable code.

From `tech_decisions.md` and user rules, you know:
- ✅ Only `<script setup lang="ts">` (no Options API) → Skip reading `setup()` patterns
- ✅ Only `defineProps<{}>()` (not `prop:` syntax) → Skip reading old-style props
- ✅ Only `@use` in SCSS (no `@import`) → Skip reading `@import` blocks
- ✅ Composables for global state → Skip Vuex or custom state managers

**Token savings**: ~20K by skipping irrelevant code patterns

---

## Strategy 9: Dependency-First Approach

**Rule**: Check package.json FIRST before exploring code that uses a library.

```bash
# When you need to understand "vue-i18n" usage:

# ✅ Step 1: Check if it's installed
grep "vue-i18n" package.json

# ✅ Step 2: Check version
grep -A1 "vue-i18n" package.json

# ✅ Step 3: Check i18n setup file
grep -A20 "createI18n" src/i18n.ts

# ✅ Step 4: ONLY THEN grep component usage if needed
grep -r "useI18n\|\$t(" src/components/ | head -3
```

**Token savings**: ~25K by understanding deps before code

---

## Strategy 10: State Pruning via Artifacts

**Rule**: The best way to save context is to forget what is no longer needed. Summarize your progress in a temporary file instead of keeping it in the chat history.

```
# ✅ When task becomes long:
1. Create/Update: .agents/scratch/task-status.md
2. Write current progress, remaining steps, and key decisions.
3. Ask user to start a NEW conversation providing only that file.
```

**Token savings**: Prunes 100% of the useless log pollution from previous attempts.

---

## Strategy 11: Quiet Mode Flags for Terminal

**Rule**: Suppress verbose terminal outputs to prevent logs from polluting the context window.

### Antipattern:
```bash
# ❌ Generates thousands of lines of logs and ANSI escapes
npm run test
```

### Better:
```bash
# ✅ Use quiet flags and suppress unnecessary errors
npm run type-check -- --silent
```

**Token savings**: Saves thousands of tokens by ingesting fewer irrelevant errors.

---

## Strategy 12: Conversation Reset (Start Fresh)

**Rule**: At conversation start, read ONLY the cache files strictly necessary for the immediate task. Do not load the entire 15KB cache suite preventatively. Mid-conversation, assume cache is loaded.

---

## Quick Reference: By Agent Role

### @pm (Product Manager)
1. Read `.agents/rules/project-overview.md` (3KB) — understand tech
2. Read `tech_decisions.md` (5KB) — understand constraints
3. Write spec with confidence
4. **Never explore code** — not your job

**Total**: ~8K tokens per task

### @engineer (Full-Stack Developer)
1. Read `conventions.md` (3KB) — coding rules
2. Read `hot_paths.md` (4KB) — file locations
3. Grep for patterns from conventions
4. Write code following patterns
5. Read ONLY the specific file you're modifying
6. **Don't explore**, don't read tests just for learning

**Total**: ~12K tokens per feature

### @qa (QA Engineer)
1. Read `conventions.md` testing section (1KB)
2. Read `hot_paths.md` (4KB) — test locations
3. Grep for existing test patterns
4. Write tests following patterns
5. Run tests, validate
6. **Read only test files, not component files**

**Total**: ~10K tokens per test suite

### @devops (DevOps Master)
1. Read `.agents/rules/developer-workflow-environment.md` (3KB)
2. Read `tech_decisions.md` build section (2KB)
3. Run commands from rules
4. Check `.github/workflows/` for CI patterns
5. **Don't read application code**

**Total**: ~5K tokens per deployment task

---

## Measuring Success

Track token usage:
- **Before cache**: ~100K tokens per conversation
- **After cache**: ~20-30K tokens per conversation
- **Savings target**: 70-80% reduction

If you're reading more than:
- **Architecture**: 5KB → You're exploring too much
- **Code files**: 50KB → You're reading full files instead of grep
- **Config files**: 10KB → Check cache first, read only needed section
