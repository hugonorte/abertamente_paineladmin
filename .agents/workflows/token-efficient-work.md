# Workflow: Token-Efficient Work

This workflow guides agents through every task while minimizing token consumption. Follow this for **every interaction** with the codebase.

---

## Phase 1: Context Setup (5-10 min)

### Step 1.1: Load Cache Files
**What**: Read the minimal files needed for your role

**Time**: 2-3 min

| Role | Read This | Size |
|------|-----------|------|
| @pm | `.agents/rules/project-overview.md` + `tech_decisions.md` | 8KB |
| @engineer | `.agents/rules/project-overview.md` + `conventions.md` + `hot_paths.md` | 9KB |
| @qa | `conventions.md` testing section + `hot_paths.md` | 5KB |
| @devops | `.agents/rules/developer-workflow-environment.md` + `tech_decisions.md` build section | 5KB |

**Token cost**: ~10K tokens (one time per session)

### Step 1.2: Understand Your Constraints
**What**: Read the constraint section for your role from `tech_decisions.md`

**Token cost**: Included in Step 1.1

### Step 1.3: Identify Your Working Directory
**What**: Know which folder you'll modify:

- @engineer: `src/components/` or `src/pages/` or `composables/`
- @qa: `src/` or `cypress/`
- @devops: `vite.config.ts`, `.github/workflows/`

**No token cost** — you already know from cache

---

## Phase 2: Task Analysis (5-15 min)

### Step 2.1: Read the Requirement
**What**: Understand what you need to build/fix/test

**How**:
```
Task: "Add i18n support to ComuneroDetails component"

✅ Do:
1. Read the requirement twice
2. List what needs to change:
   - Add $t() calls in template
   - Add i18n keys to locales/*.json
   - Update test if exists
3. Estimate lines of code
```

### Step 2.2: Find Similar Examples
**What**: Locate existing code that does similar work

**How**:
```
# Task: "Add form validation to a component"
# Search pattern:
Tool: grep_search
Query: "vee-validate\|zod\|handleSubmit"
SearchPath: "src/components"
Includes: ["*.vue"]

# Check AssetForm as example (you know it exists from hot_paths.md)
Tool: list_dir (Path: "src/components/AssetForm/")
Tool: view_file (AbsolutePath: ".../AssetForm.vue", StartLine: 1, EndLine: 50)
```

**Token cost**: ~3K tokens (targeted grep + 50 lines)

### Step 2.3: Check Dependencies
**What**: Verify tools you need are installed

**How**:
```
# Task uses Vee-Validate?
Tool: grep_search (Query: "vee-validate", SearchPath: "package.json")

# Check version
Tool: view_file (AbsolutePath: "package.json")
```

**Token cost**: <1K tokens

---

## Phase 3: Planning (No Code Yet)

### Step 3.1: List Exact Changes
**What**: Write down every file you'll touch

**Example**:
```
Task: Add i18n to ComuneroDetails

Files to modify:
□ src/components/ComuneroDetails/ComuneroDetails.vue
  └─ Replace 3 hardcoded strings with $t() calls
□ src/locales/pt.json
  └─ Add 3 keys under comunero section
□ src/locales/en.json
  └─ Add same 3 keys with English translation
□ src/locales/es.json
  └─ Add same 3 keys with Spanish translation
□ src/components/ComuneroDetails.spec.ts
  └─ Update test if it checks for hardcoded text
```

### Step 3.2: Check Hot Paths for Impact
**What**: From `hot_paths.md`, understand what breaks if you change this

**Example**:
```
Changing: src/components/ComuneroDetails/ComuneroDetails.vue

Hot Paths check:
✓ This is in "High-Frequency Zones" → Recent change, safe to modify
✓ No critical dependencies listed → Low impact zone
✓ Component is small (< 100 lines) → Safe to refactor
✓ Only used in 1 page (Comuneros.vue)
✓ Test coverage: Check if ComuneroDetails.spec.ts exists
  → If yes, must update test
  → If no, write test first (TDD approach)
```

### Step 3.3: Read the Files You'll Modify (Exactly)
**What**: Now read ONLY the files on your modification list

**How**:
```
# File 1: Component
Tool: view_file (AbsolutePath: ".../ComuneroDetails.vue", EndLine: 100) # See structure
Tool: grep_search (Query: "defineProps\|<template>\|<style", SearchPath: ".../ComuneroDetails.vue")

# File 2: i18n sample
Tool: grep_search (Query: "comunero", SearchPath: "src/locales/pt.json")

# File 3: Test
Tool: view_file (AbsolutePath: ".../ComuneroDetails.spec.ts", EndLine: 50)
```

**Token cost**: ~5K tokens (selective reads, not full files)

### Step 3.4: Ask for Approval (if @pm involved)
**What**: If task impacts architecture, get green light before coding

**Do NOT ask**: "Ready to start coding?" ← Too vague

**Do ask**: 
```
This task will:
1. Add 3 i18n keys to all language files
2. Replace hardcoded strings in 1 component
3. Update 1 test file
4. No new dependencies needed

Should I proceed?
```

**Token cost**: <1K tokens

---

## Phase 4: Implementation

### Step 4.1: Follow the Pattern (No Exploration)
**What**: Use the pattern you already know

**From conventions.md**, you know:
```
i18n pattern:
- Template: {{ $t('section.key') }}
- Script: const { t } = useI18n(); const text = t('section.key')
- File: src/locales/{pt,en,es}.json with matching keys
```

→ **Write code. Don't explore for examples. You have the pattern.**

**Token cost**: 0 tokens (all known patterns)

### Step 4.2: Write Each File
**What**: Touch exactly the files you listed, in order

```
File 1: src/components/ComuneroDetails/ComuneroDetails.vue
├─ Find hardcoded string: grep "Title text"
├─ Replace with: {{ $t('comunero.details.title') }}
└─ Verify no other changes

File 2: src/locales/pt.json
├─ Add section or keys
└─ Validate JSON syntax: jq . src/locales/pt.json

File 3: src/locales/en.json
├─ Add same keys with English
└─ jq . src/locales/en.json

File 4: src/locales/es.json
├─ Add same keys with Spanish
└─ jq . src/locales/es.json

File 5: Test
├─ Update test string expectations (if test exists)
└─ Or create new test
```

**Check**: 
```
# Verify JSON valid
Tool: view_file (Check src/locales/*.json formats visually or run a quiet test)

# Verify keys exist across all languages
Tool: grep_search (Query: "comunero.details.title", SearchPath: "src/locales/")

# Verify component uses new keys
Tool: grep_search (Query: "\$t(", SearchPath: "src/components/ComuneroDetails/")
```

**Token cost**: 0 tokens (writing, not reading)

### Step 4.3: Stop Reading Code
**What**: Once you start writing, stop exploring

**Why**: Reading more = more tokens = less time coding

**If you get stuck**:
1. Check the cache pattern again (0 tokens)
2. Grep for exact error (1K tokens)
3. Read only the relevant line (1K tokens)
4. Don't read entire file for context

**Token cost**: Keep this phase under 5K total

---

## Phase 5: Validation

### Step 5.1: Run Tests and Linters
**What**: Verify your changes don't break anything

```bash
# Type check (mandatory)
npm run type-check -- --silent

# If you modified component (Unit)
npm run test:unit -- --silent

# If you modified pages (E2E)
npx cypress run --quiet

# Check specific test
npm run test:unit -- ComuneroDetails.spec.ts --silent
```

**Token cost**: 0 tokens (commands, not reading)

### Step 5.2: Quick Code Review (Yourself)
**What**: Before committing, check:

- [ ] TypeScript strict: `grep_search "as any" in [YOUR_FILES]` — 0 matches?
- [ ] i18n complete: `grep_search "comunero" in src/locales/` — Consistent count?
- [ ] Imports correct: `grep_search "^import" in [YOUR_FILE]` — All from `@/` alias?
- [ ] Props typed: `grep_search "defineProps<" in [YOUR_FILE]` — No `any`?

**Do NOT**: Open files for review unless test fails

**Token cost**: <1K tokens (grep only)

### Step 5.3: Git Diff
**What**: See exactly what changed

```bash
git diff src/components/ComuneroDetails/
git diff src/locales/
```

**Token cost**: <1K tokens

---

## Phase 6: Commit & Report

### Step 6.1: Write Commit Message
**Pattern** (from Conventional Commits):
```
<type>: <description>

Types: feat, fix, refactor, test, docs, chore

Examples:
- fix(i18n): add translations for Comunero Details page
- feat: internationalize ComuneroDetails component
```

### Step 6.2: Create Pull Request
**What**: Link task to PR

**Pattern**:
```
Title: fix(i18n): add Comunero Details translations

Body:
## Changes
- Added i18n support to ComuneroDetails component
- Added 3 keys to pt.json, en.json, es.json
- Updated component test

## Test Plan
- [x] Type check passes
- [x] i18n keys verified in all languages
- [x] Component renders with translated text
```

### Step 6.3: Report Success
**What**: Tell the user what was done

**Format**:
```
✅ Task complete:
- Modified: src/components/ComuneroDetails/ComuneroDetails.vue
- Updated: src/locales/{pt,en,es}.json
- Tests: All passing
- PR: #XXX (link)

Token usage: 28K
- 10K cache load
- 5K code reading
- 8K implementation & validation
- 5K overhead
```

**Token cost**: <1K tokens

---

## Token Budget by Phase

| Phase | Time | Tokens | Notes |
|-------|------|--------|-------|
| 1. Cache Setup | 5 min | 10K | One time per session |
| 2. Analysis | 10 min | 3K | Grep + selective read |
| 3. Planning | 5 min | 5K | Full files to modify only |
| 4. Implementation | 30 min | 0 | Writing, not reading |
| 5. Validation | 10 min | 2K | Grep + git diff |
| 6. Commit & Report | 5 min | 1K | Git & commit message |
| **Total per task** | **65 min** | **~21K** | **Budget: 30K** |

**Target**: Stay under 30K tokens per task
**Actual**: Average 21K tokens (30% buffer)

---

## Common Mistakes (Don't Do These)

| ❌ Mistake | 💰 Cost | ✅ Instead |
|-----------|--------|----------|
| Read entire codebase to understand | 200K | Read cache files + grep (15K) |
| Explore similar components | 50K | Grep for pattern + read 50 lines (5K) |
| Read full pages/components | 100K | Head/tail or grep + read sections (10K) |
| Ask for clarification without trying | 5K | Try first, ask only if stuck (0K) |
| Run tasks without cache | 50K | Load cache first (10K) |
| Write tests then find test pattern | 30K | Find pattern first (5K), write (0K) |
| Check old code for examples | 20K | Check conventions.md (0K) |

---

## Role-Specific Workflows

### @engineer: Fastest Path
1. ✅ Read `conventions.md` (3KB)
2. ✅ Read `hot_paths.md` (4KB)
3. ✅ Grep for 1 example (1KB)
4. ✅ Write code (0KB)
5. ✅ Test/Type-check (0KB)
6. ✅ Commit (0KB)
**Total: ~10K tokens + time**

### @qa: Test-First Path
1. ✅ Read test conventions (1KB)
2. ✅ Grep for existing tests (1KB)
3. ✅ Write test (0KB)
4. ✅ See test fail (0KB)
5. ✅ Ask @engineer to fix (0KB)
6. ✅ Verify test passes (0KB)
**Total: ~5K tokens + time**

### @pm: Spec-Only Path
1. ✅ Read `.agents/rules/project-overview.md` (3KB)
2. ✅ Read `tech_decisions.md` (5KB)
3. ✅ Write spec (0KB)
4. ✅ Ask for approval (0KB)
5. ✅ Iterate on feedback (5KB max)
**Total: ~13K tokens + time**

---

## Emergency: Something's Wrong

**If tests fail**:
1. ❌ Don't explore code
2. ✅ Read error message exactly
3. ✅ Grep for error pattern
4. ✅ Check 1 example that works
5. ✅ Fix your code

**If task unclear**:
1. ❌ Don't read codebase for context
2. ✅ Ask user for clarification
3. ✅ Propose 2-3 approaches
4. ✅ Wait for approval

**If branch has conflicts**:
1. ✅ Use git to understand conflicts
2. ✅ Read only the conflict markers
3. ✅ Resolve with cache patterns

---

## Success Criteria

✅ **You succeeded if**:
- Task is complete
- Type-check and tests pass
- Token usage under 30K (ideally 20K)
- No code exploration
- Pattern-based implementation

❌ **You failed if**:
- Token usage over 50K
- You read entire files for pattern matching
- You explored codebase unnecessarily
- Task incomplete or tests fail

---

## Quick Checklist

Before starting any task:

- [ ] Read cache (.agents/rules/project-overview.md, conventions.md, hot_paths.md)
- [ ] Understand requirement
- [ ] Find 1 similar example (grep)
- [ ] Plan exact files to modify
- [ ] Check constraints from tech_decisions.md
- [ ] Get approval if task impacts architecture
- [ ] Start coding (stop exploring)
- [ ] Run type-check and tests
- [ ] Commit and report

---

**Remember**: The goal is maximum progress with minimum tokens.

Use this workflow every time. Your future self will thank you.
