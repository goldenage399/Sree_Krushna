---
name: backend-test-generator
description: >
  Scaffolds tests into correct module files, preventing 99_temp.js clutter (Protocol 21).
  Use when user asks to "Write test", "Create test script", or "Verify backend".
  Enforces "No Disposable Scripts" rule.
---

## Goal

Keep the backend test suite clean, organized, and permanent.

## Rules of Engagement

### 1. No "Temp" Files

**Trigger**: User asks for "a quick test script" or `99_temp.js`.
**Action**: REFUSE.
**Correction**: "I will add this as a permanent test function to the module's test suite."

### 2. Routing Logic

Map the request to the correct file:

- **Expense** -> `backend/src/99_TestScripts_Expense.js`
- **Ledger** -> `backend/src/99_TestScripts_Ledger.js`
- **Accounts** -> `backend/src/99_TestScripts_Accounts.js`
- **Receivables** -> `backend/src/99_TestScripts_Receivables.js`

### 3. Naming Convention

**Rule**: Function MUST start with `TEST_[Module]_[Feature]`.

- ❌ `function testSubmit()`
- ✅ `function TEST_Expense_SubmitBill()`

## Execution Pattern

1. Read existing test file (to check for duplicates).
2. Append new function at the bottom.
3. Print the execution command (`TEST_Expense_SubmitBill()`).
4. **Log Event**: `[TEST] Created {TEST_Function_Name} in {Filename}` (via `memory-event-logger`).

## ❌ Example Violation

**User**: "Create a quick test script to check the schema."

**Agent (Bad)**: Creates `99_temp_schema_check.js`.

**This skill REFUSES**: "I will add `TEST_Accounts_SchemaCheck()` to `99_TestScripts_Accounts.js` instead."

## ➡️ What's Next?

After this skill passes (test created):

- Run test in GAS Editor
- Run **`pirr-compliance`** to ensure test is documented
- Verify `[TEST]` event logged in `event_stream.md`
