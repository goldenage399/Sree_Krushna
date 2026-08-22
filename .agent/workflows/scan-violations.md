---
description: Scan the codebase for violations of registered standards and update the technical debt register
---

# Scan Violations Workflow

> **Purpose**: Run registered violation patterns against the codebase, find non-compliance, and update `.agent/technical-debt.md`.
> **Input**: `.agent/standards-catalog.json` (definitions) + `.agent/violation-patterns.json` (detection) + codebase files
> **Output**: Updated `.agent/technical-debt.md` (new violations added, resolved ones marked)

---

## Trigger Conditions

Invoke this workflow when:

- A **new standard is registered** via `/register-standard`
- During **PIRR** (Post-Implementation Reconciliation Review)
- **On-demand** when user asks to check compliance
- Before **major releases** or after large refactors

---

## Step 1 — Load Standards & Patterns

// turbo
```powershell
Get-Content ".agent\standards-catalog.json" | ConvertFrom-Json
Get-Content ".agent\violation-patterns.json" | ConvertFrom-Json
```

Review the patterns. Each pattern has a `standardId` linking to the catalog. Identify which ones to scan (all, or a specific pattern ID).

> [!TIP]
> The catalog tells you **WHAT** the standard requires. The pattern tells you **HOW** to detect violations.
> Use the catalog's `severity` and `lifecycle.sunsetDate` to prioritize scanning.

---

## Step 2 — Scan Each Pattern

For each pattern in `violation-patterns.json`:

### 2a-0. Run ast-grep structural scan (ARCH-INV patterns first)

For the four invariants that have registered ast-grep rules, run the structural scan **before** regex fallback. These are faster, AST-aware, and produce fix-ready output:

```powershell
# All 4 ARCH-INV rules in one pass (exit code 1 if any error-severity match)
npm run sg:check

# Per-invariant targeted runs:
npm run sg:inv002   # ARCH-INV-002: service-to-service imports (src/services/)
npm run sg:inv003   # ARCH-INV-003: query() inside useEffect (src/)
npm run sg:inv005   # ARCH-INV-005: missing else on .exists() (src/contexts/)
npm run sg:inv006   # ARCH-INV-006: deleteField() in auth path (src/contexts/)
```

Rules live in `.claude/sg-rules/`. Each finding includes the exact file:line, the matched code, and an inline fix suggestion with the captured variable names.

> [!TIP]
> `sg:check` exits 0 when clean. Wire it into CI as a pre-merge gate alongside `npm run build`.

### 2a. Run regex scan (if pattern has `regex`)

```powershell
# Example for P22_HARDCODED_COLUMNS
Select-String -Path "backend\src\**\*.js" -Pattern "row\.length\s*[!=]=\s*\d+" -Recurse |
  Where-Object { $_.Path -notmatch "99_TestScripts|99_SchemaMigration" }
```

### 2b. Manual check (if pattern has `manualCheck` instead of `regex`)

- Read the `manualCheck` description
- Grep for related code patterns
- Use judgement to identify violations

### 2c. Apply Exception Filters

For each match, check against the pattern's `exceptions` list:
- File path matches an exception glob? → Skip
- Line contains `@compliance-ignore P{XX}`? → Skip
- Otherwise → **VIOLATION**

---

## Step 3 — Cross-Reference Existing Debt

// turbo
```powershell
Select-String -Path ".agent\technical-debt.md" -Pattern "TD-\d+"
```

For each violation found:
- **Already in debt register?** → Update `Status` if needed, skip adding duplicate
- **New violation?** → Assign next `TD-{NNN}` ID, add to Active Debt table
- **In register but not found in scan?** → Mark as **RESOLVED** with date

---

## Step 4 — Update Technical Debt Register

Add new violations to `.agent/technical-debt.md` Active Debt table:

```markdown
| TD-{NNN} | {module} | P{XX} | {file} | {description} | {severity} | {PIO if exists} | {today} | PENDING |
```

Move resolved violations to the Resolved Debt table:

```markdown
| TD-{NNN} | {module} | P{XX} | {file} | {description} | {severity} | PIO-{XXX} | {today} |
```

Update `Next ID` counter at bottom of file.

---

## Step 5 — Report Summary

Present findings to user:

```
## Scan Results: {pattern_name or "All Patterns"}

### New Violations Found: {N}
| ID | Module | Protocol | File | Severity |
|...

### Previously Known (Still Active): {N}
### Resolved Since Last Scan: {N}

### Recommended Actions:
- [ ] Create PIO for {cluster description} ({count} violations, {severity})
- [ ] Review {file} — {count} violations in one file
```

---

## Step 6 — Create PIOs (If Warranted)

| Condition | Action |
|-----------|--------|
| 3+ CRITICAL violations in same module | Create PIO immediately |
| 5+ HIGH violations with same pattern | Create PIO, link all debt IDs |
| MEDIUM/LOW scattered violations | Track in debt register only |

When creating a PIO:
1. Use `/enhancement-scaffolder` skill
2. Link all related `TD-{NNN}` IDs in the PIO description
3. Update each linked debt entry's `PIO_Link` column

---

## Quick Reference: Common Scan Commands

```powershell
# ARCH-INV (all 4 rules, structural AST scan)
npm run sg:scan       # colored, human-readable
npm run sg:check      # CI-safe, exit code 1 on errors
npm run sg:inv002     # service-to-service imports only
npm run sg:inv003     # unmemoized Firestore queries only
npm run sg:inv005     # missing else on .exists() only
npm run sg:inv006     # deleteField() in auth contexts only
```

```powershell
# P22: Hardcoded column counts
Select-String -Path "backend\src\**\*.js" -Pattern "row\.length\s*[!=]=\s*\d+" -Recurse

# P14: Direct sheet writes (financial sheets)
Select-String -Path "backend\src\**\*.js" -Pattern "sheet\.(setValues|appendRow)\(" -Recurse |
  Where-Object { $_.Path -notmatch "Writer\.js|WriteJournal|99_" }

# P43: GAS API calls (check if inside loops manually)
Select-String -Path "backend\src\**\*.js" -Pattern "(Utilities\.formatDate|Session\.getScriptTimeZone|SpreadsheetApp\.getActiveSpreadsheet)" -Recurse
```
