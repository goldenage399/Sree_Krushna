---
description: Git commit workflow for Windows/PowerShell environment
---

# Git Commit Workflow

// turbo-all

## ⚠️ CRITICAL POWERSHELL REMINDER

**THIS PROJECT RUNS ON WINDOWS WITH POWERSHELL!**

**NEVER use `&&` to chain commands!** PowerShell uses `;` as the command separator.

❌ WRONG: `git add . && git commit -m "message"`
✅ CORRECT: `git add .; git commit -m "message"`
✅ ALSO CORRECT: Run commands separately

## Standard Git Commit Steps

1. Check status first:

```powershell
git status --porcelain
```

2. Stage files (run SEPARATELY from commit):

```powershell
git add <files>
```

3. Commit (run as SEPARATE command):

```powershell
git commit -m "type(scope): description"
```

## Commit Message Format

Use conventional commits:

- `feat(scope):` - New feature
- `fix(scope):` - Bug fix
- `style(scope):` - Styling/CSS changes
- `docs:` - Documentation only
- `refactor(scope):` - Code refactoring
- `test(scope):` - Test changes

## Multi-file Commits

Stage and commit in SEPARATE commands:

```powershell
# Step 1: Stage
git add src/file1.js src/file2.js

# Step 2: Commit (separate command!)
git commit -m "feat(module): add new feature"
```

## 📋 Pre-Commit Checklist

Before committing, verify:

- [ ] No console errors in browser
- [ ] `npm run build` succeeds (if major changes)
- [ ] If changed shared code → Ran [PRE_CHANGE_CHECKLIST.md](../../docs/PRE_CHANGE_CHECKLIST.md)
- [ ] **ast-grep invariant scan** (conditional — run the relevant command):
  - Changed `src/services/` → `npm run sg:inv002` (ARCH-INV-002: no direct service imports)
  - Changed Firestore query/subscription code → `npm run sg:inv003` (ARCH-INV-003: useMemo required)
  - Changed `AuthContext.jsx` or `ProfileContext.jsx` → `npm run sg:inv005 && npm run sg:inv006`
  - Changed anything else structural → `npm run sg:check` (all 4 rules, one pass)

## 🛠️ Handling Hook Failures on Unrelated Changes (INC-043)

If the pre-commit hook fails due to pre-existing, unstaged modifications (e.g., file-size ceilings or warnings in other files), **DO NOT** use `--no-verify`. Instead, temporarily stash the unstaged changes, commit, and then restore them:

```powershell
# 1. Stash all unstaged changes (including untracked files) while keeping the staged index
git stash --keep-index -u -m "temp-preflight-stash"

# 2. Run the commit command normally (the hook will now run only on clean, staged files)
git commit -m "type(scope): description"

# 3. Restore the unstaged workspace files
git stash pop
```

## 🔄 Post-Commit: Run PIRR?

**Ask yourself**: Did this session touch multiple docs or make subtle fixes?

If YES → Run Phase C (PIRR) via `/aos-session`:

```powershell
git diff HEAD~1 > changes.txt
```

Then invoke PIRR prompt from [aos-session.md](./aos-session.md#phase-c--ending-work-pirr)

## 🔑 Registered Knowledge Items (FKL)

<details>
<summary>🔑 FKL Item Header (FKL-WI-001)</summary>

```yaml
---
fkl_id: FKL-WI-001
fkl_type: WorkflowImprovement
source:
  - eur-001/m6-ingestion
  - WT-08
promoted_from: ""
applies_to:
  - tailwind-semantic-bridge.css
workflow_activation:
  - WT-04
  - WT-08
promotion_status: Active
superseded_by: ""
content_ref: .stylelintrc.dhcp-001.json
---
```
</details>

### FKL-WI-001: Stylelint Pre-Commit Overrides for Escaped Utility Classes
During commit validation of hybrid utility-to-semantic bridge files (`tailwind-semantic-bridge.css`), the pre-commit Stylelint hook will throw syntax/pattern violations on Tailwind-escaped class names (e.g. colons, backslashes, underscores). Adding overrides to `.stylelintrc.dhcp-001.json` for the bridge file disables styling/formatting rules (`selector-class-pattern`, `declaration-block-single-line-max-declarations`, `custom-property-pattern`) while retaining crucial value validation for hardcoded color/pixel values.

