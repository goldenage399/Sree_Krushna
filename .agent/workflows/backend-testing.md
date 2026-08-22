---
description: Standardized workflow for creating, running, and managing backend tests.
---

# Backend Testing Workflow

**When to use**:
- User asks to "Write a test", "Verify backend", "Check schema".
- Before wiring any frontend component to backend.
- When diagnosing "Silent Failures" or "Zero Data" issues.

## 1. Governance Check

**Stop & Check**:
- **NO** disposable scripts (`99_temp.js`).
- All tests **MUST** reside in `backend/src/99_TestScripts_[Module].js` or `tests/playwright/`.
- Function names **MUST** properly prefix the module: `TEST_[Module]_[Feature]`.
- For Playwright E2E Auth tests, see `.agent/patterns/playwright-indexeddb-auth-session-capture.md` for IndexedDB session persistence, `.agent/patterns/playwright-spa-e2e-testing-best-practices.md` for SPA wait strategies, and `.agent/patterns/playwright-e2e-testing-protocol.md` for Modal Automation & Strict-Mode Disambiguation.

## 2. Test Selection Strategy

Use the **Error Handling First** principle:

| Priority | Test Type | Purpose | Function Pattern |
| :--- | :--- | :--- | :--- |
| **1 (Critical)** | **Error Handling** | Validates the engine catches bad inputs. | `TEST_[Module]_ErrorScenarios` |
| 2 | **Config & Router** | Verifies wiring exists before data flows. | `TEST_[Module]_Config` |
| 3 | **Schema (Invariant)** | Ensures columns match code expectations. | `TEST_[Module]_Schema` |
| 4 | **Integration** | Full end-to-end data flow. | `TEST_[Module]_SubmitFlow` |

## 3. Execution Steps

1.  **Locate Target File**:
    *   Expense -> `99_TestScripts_Expense.js`
    *   Accounts -> `99_TestScripts_Accounts.js`
    *   Receivables -> `99_TestScripts_Receivables.js`
    *   *New Module* -> Create `99_TestScripts_[Name].js`

2.  **Scaffold Test**:
    *   Use `backend-test-generator` skill or copy from `docs/BACKEND_TESTING_STANDARD.md`.
    *   Ensure strict dependency checks (Config -> Sheet -> Permission).

3.  **Run & Verify**:
    *   Execute via GAS Editor.
    *   **Pass**: Proceed to Implementation/Wiring.
    *   **Fail**: Run `TEST_Diagnose...` scripts (if available) or check Logs.

## 4. Maintenance

- **Consolidation**: If you created a specific diagnostic script (e.g., for a bug), **MERGE** it into the main suite header or helper section before closing the task.
- **Documentation**: Ensure `PIRR` checks that new tests are documented in the module SSOT.

## Reference
- **Constitution**: `docs/BACKEND_TESTING_STANDARD.md`
- **Playwright E2E Pattern**: `.agent/patterns/playwright-e2e-testing-protocol.md`
