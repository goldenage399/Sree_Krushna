---
name: protocol-enforcer-pre-code
description: >
  Validate proposed changes against mandatory protocols via specific checks (COREFUNCTIONINDEX, DOCUMENTATION_HUB, correct Router file, SheetWriter audit trail).
  Use when planning to add functions, edit SSOT, modify backend, or change UI.
  Prevents router placement bugs (PIO-040), hardcoded configs, financial sheet violations.
---

## Goal

Block protocol violations BEFORE implementation wastes time.

## The 6 Pre-Code Questions (Mandatory Validation)

### 1️⃣ Creating new utility function?

**Protocol 4: Core Function Index Pre-Creation Check**

```
MUST: Open docs/CORE_FUNCTION_INDEX.md
MUST: Search for similar functions (validation, normalization, error handling)
MUST: If exists → extend, don't duplicate
MUST: Describe what's new and why
```

### 2️⃣ Editing SSOT documentation?

**Protocol 5: SSOT Classification Pre-Edit Check**

```
MUST: Open docs/DOCUMENTATION_HUB.md
MUST: Search by concept domain (NOT recency)
MUST: Find correct file from Semantic Domain Index
MUST: Quote the domain to show you looked it up
```

### 3️⃣ Adding backend API action?

**Protocol 10 & 46: Router Standards (Deploy Safety + Timing)**

```
MUST: Add wrapper to ModuleRouter.js (deployed file)
MUST: Return `durationMs` in response (Protocol 46 / PIO-093)
MUST NOT: Add to Module.js (stale, excluded from deploy.ps1)
MUST: Verify function name matches CONTRACT.json
Merged Check: `const startTime = Date.now(); return { ...res, durationMs: Date.now() - startTime }`
```

### 4️⃣ Writing to financial sheets?

**Protocol 14: WriteJournal Audit Trail**

```
MUST: Use writeRowsToSheet (Expense) or writeLedgerEntry (Ledger) or writeAccountsEntry (Accounts)
MUST NOT: Use direct sheet.setValues() or sheet.appendRow()
Target Sheets: Master_Expense, Master_Ledger, Input_Accounts, Receivables
Exempt: Debug_Log, Draft_Bills
```

### 5️⃣ Using location-specific operations?

**Protocol 8: Location Config Source**

```
MUST: Use getLocationConfig(locationId) for docId
MUST NOT: Use hardcoded EXPENSE_LOCATIONS, LEDGER_LOCATIONS
```

### 6️⃣ Adding code to large file?

**Protocol 11: File Growth Threshold**

```
MUST: Check current file line count
IF file > 600 lines AND change adds 100+ lines:
  MUST: Extract to new Service/Component module

### 7️⃣ Accessing sheet columns?

**Protocol 32: Dynamic Mapping Mandate**

```

MUST: Use dynamic column map (e.g., `row[colMap.Amount]`)
MUST NOT: Use hardcoded indices (e.g., `row[5]`, `row[0]`)
Reason: Prevents data corruption when sheet columns are reordered.
Ref: `00_AggregatorUtils.js` -> `AGG_buildColMap`

```


## Output Format

### ✅ If ALL checks pass:

```

✅ PROTOCOL VALIDATION PASSED

Checks:
✓ Protocol 4 — Function: Checked COREFUNCTIONINDEX.md
✓ Protocol 5 — SSOT: Found correct doc via Domain Index
✓ Protocol 8 — Location: Using getLocationConfig()
✓ Protocol 10 — Router: Editing *\_Router.js (Deployed)
✓ Protocol 46 — Timing: Added durationMs instrumentation
✓ Protocol 14 — Audit: Using write*Entry() wrapper

🎯 SAFE TO IMPLEMENT

```

### ⚠️ If violation detected:

```

🚨 PROTOCOL VIOLATION DETECTED

Protocol [X] Violation:
❌ [Specific failure reason]

🔧 FIX:
[Specific instruction to resolve]

Cannot proceed until confirmed.

```

## ❌ Example Violation

**User**: "I want to add a new `calculateTax` utility function."

**Agent (Bad)**: Starts writing code immediately.

**Agent (Good)**: "Let me check `CORE_FUNCTION_INDEX.md` first... Found `calculateWithTax()` already exists. We should extend it instead."

## ➡️ What's Next?

After this skill passes, run:

- **`ssot-domain-mapper`** → Find all affected documentation
- **`contract-api-validator`** → If API changes are involved
```
