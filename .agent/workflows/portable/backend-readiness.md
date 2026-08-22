---
pattern: backend-readiness
origin_cap: PIOps-Testing
tier: gas+firebase
applies_to:
  - "Google Apps Script backend"
  - "Schema migrations"
  - "API wiring"
prereqs:
  - "GAS Executions access"
porting_effort: medium
canonical_source: GEMINI.md
last_reviewed: 2026-04-21
description: "Surgical schema migration and backend testing."
---

# Portable Workflow: Backend Readiness & Schema Migration

**Purpose:** Ensure GAS backend changes are robust, tested, and safely migrated without data loss.

---

## 1. The Decision Tree (Protocol #59)

| Task | Required Phases |
|------|-----------------|
| **New Module** | Schema Definition → Action Registration → Dry Run → Rollback |
| **New Columns** | Discover Schema → Plan Migration → Execute → Verify |
| **Wiring Frontend** | Contract Check → Field Mapping → API Smoke Test |

---

## 2. Schema Migration Protocol (Surgical Mode)

**Constraint:** NEVER add columns blindly. Use the **Discover → Plan → Execute** loop.

1. **Discover**: Read Row 1 of the live sheet and log the exact current headers.
2. **Plan**: Compare current headers against the target schema. Identify exactly which columns to append.
3. **Execute**: Use `sheet.getRange(1, lastCol + 1, 1, newHeaders.length).setValues([newHeaders])` to append surgically.
4. **Verify**: Immediately run a `read` operation to ensure the new columns are mapped correctly in the `colMap`.

---

## 3. Testing Standard

- **Test Files**: Create `99_TestScripts_[Module].js` for each module.
- **Rollback Function**: Every module MUST have a `rollbackLast[Module]Test()` function that deletes the test rows generated during dry runs.
- **Proof of Success**: A backend test is only "Passed" if the `Logger.log` shows the exact JSON response expected by the frontend.
