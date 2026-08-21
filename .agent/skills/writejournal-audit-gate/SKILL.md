---
name: writejournal-audit-gate
description: >
  Validate financial sheet writes use audit-enabled writers (writeRowsToSheet, writeLedgerEntry, writeAccountsEntry).
  Use before code that modifies Master_Expense, Master_Ledger, Input_Accounts.
  Prevents silent write failures and ensures rollback capability (PIO-044, PIO-055).
---

## Goal

Prevent data loss by ensuring all financial transactions have an audit trail and trace ID.

## Critical Validation Rules

### 1. Mandatory Writer Selection

| Target Sheet       | REQUIRED Function       | File Location                                       |
| :----------------- | :---------------------- | :-------------------------------------------------- |
| **Master_Expense** | `writeRowsToSheet`      | `backend/src/modules/expense/04_07_SheetWriter.js`  |
| **Master_Ledger**  | `writeLedgerEntry`      | `backend/src/modules/ledger/05_04_LedgerWriter.js`  |
| **Input_Accounts** | `writeAccountsEntry`    | `backend/src/modules/accounts/14_AccountsWriter.js` |
| **Receivables**    | `writeReceivablesEntry` | _(Check specific module writer)_                    |

**❌ FORBIDDEN**: `sheet.appendRow()`, `sheet.getRange().setValues()` on verification targets.

### 2. Parameter Injection Requirement

All writers MUST accept `userEmail` as an argument.

- ❌ `Session.getActiveUser().getEmail()` → Unreliable in "Execute as Me"
- ✅ `userEmail` passed from Router → Reliable

### 3. Trace ID Consistency

For multi-sheet writes (e.g., Expense + Ledger), the SAME `traceId` must be passed to all writers to allow atomic rollback.

## Response Template

### If Compliant:

```
✅ WRITE JOURNAL COMPLIANT
- Writer: [Function Name]
- Audit Trail: Enabled
- Trace ID: Shared
- User Propagation: Verified
```

### If Non-Compliant:

```
🚨 AUDIT TRAIL VIOLATION
You proposed: `sheet.appendRow(...)`
Critical Risk: No rollback, no user audit, no modification log.

FIX:
Replace with:
const writer = loadWriter('04_07_SheetWriter.js');
writer.writeRowsToSheet(sheet, data, userEmail, traceId);
```

## ❌ Example Violation

**User**: "Add this new expense entry directly to the sheet."

**Code Proposed**:

```javascript
sheet.appendRow([date, amount, category]); // ❌ No audit trail!
```

**This skill catches it** and requires `writeRowsToSheet()` with `traceId`.

## ➡️ What's Next?

After this skill passes, run:

- **`backend-test-generator`** → Create integration test for the write path
