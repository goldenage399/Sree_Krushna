---
name: contract-first-api-validator
description: >
  Validate API changes against CONTRACT.json schema.
  Use when adding/modifying Router actions or FieldSchemas.
  Prevents undocumented fields and type mismatches (PIO-060).
---

## Goal

Ensure zero drift between Code and Contract.

## Validation Steps

### 1. Check the Contract

Open `docs/{Module}_Module_SSOT/CONTRACT.json`.
Does the new Action/Field exist?

- **NO**: 🛑 STOP. Add to `CONTRACT.json` first.
- **YES**: Proceed to Step 2.

### 2. Verify Data Types

Check:

- `CONTRACT.json` type (e.g., "number")
- `FieldSchemas.js` parser (e.g., `parseNumber`)
- Input validation (e.g., `typeof val === 'number'`)

### 3. Verify Test Coverage

Open `backend/src/99_TestScripts_{Module}.js`.
Is there a test case for this specific Action?

## Usage Output

```markdown
## 📜 Contract Validation

1. **Schema Check**: [Pass/Fail] - `CONTRACT.json` matches code
2. **Type Check**: [Pass/Fail] - `parser` aligns with schema
3. **Test Check**: [Pass/Fail] - `TEST_Contract_{Action}` exists

RECOMMENDATION: [Proceed / Update Contract First]
```

## ❌ Example Violation

**User**: "Add a new `paidBy` field to the `saveAccountsStep4` action."

**Agent (Bad)**: Adds field to `14_00_FieldSchemas.js` without updating `CONTRACT.json`.

**This skill catches it**: "🛑 STOP. `paidBy` not in CONTRACT.json. Add it first."

## ➡️ What's Next?

After this skill passes, run:

- **`backend-test-generator`** → Create `TEST_Contract_Accounts()` test case
