# INC-082: Checklist Telemetry Security Rules Gap, Orphaned Aggregation Layer, and Council Top-Down Verification Failure

**Incident ID**: `INC-082`  
**Date**: 2026-08-18  
**Severity**: Medium (Silent Data Drop & Architectural Gap)  
**Status**: Institutionalized / Invariant Established  
**Surfaces Affected**: UI, Data, Reactive, Service, Module, Governance (6-Surface Multi-Surface Audit)  
**Governing Documents**: [`ADR-015`](file:///d:/GitHub_Repo/Task-Dashboard/docs/adr/ADR-015-POSITION-CENTRIC-CHECKLISTS.md), [`ADR-029`](file:///d:/GitHub_Repo/Task-Dashboard/docs/adr/ADR-029-UNIFIED-DAILY-ROUTINE-AGGREGATION-AND-SECTIONED-CHECKLIST-LIFECYCLE.md), [`ADR-028`](file:///d:/GitHub_Repo/Task-Dashboard/docs/adr/ADR-028-TASK-EXECUTION-REFERENCE-ARCHITECTURE.md), `P-VAT`, `P-POS-ROUTINE`  
**Affected Components**: `src/pages/MyDayPage.jsx`, `src/services/RecurringChecklistService.js`, `src/services/ActivityLogService.js`, `firestore.rules`, `src/components/checklists/PositionRoutinesTab.jsx`, `src/components/myday/MyDayComponents.jsx`  

---

## 1. Summary of Incident

During the Architecture Council investigation for **Query 1.0** (End-of-Day Cross-Profile Role Coverage), an initial Council review (`ARCH-REV-260818-EOD-COVERAGE`) declared that the existing system possessed a 100% reusable aggregation layer (`RecurringChecklistService.getUnifiedDailyAgendaForUser`), verified progress calculation utilities, and a secure audit trail for checklist telemetry.

Subsequent technical review (`Review 1.1`, `Review 1.6`) and forensic codebase verification revealed four underlying defects:
1. **Orphaned Aggregation Function**: `getUnifiedDailyAgendaForUser` had **0 production callers in `src/pages/` and `src/components/`**. `MyDayPage.jsx` actually called `listPendingForUser`, which filtered for `status === 'pending'`, causing partially-saved routines (`status: 'partial'`) to disappear on page reload.
2. **Duplicated Progress Mathematics**: Calculation of routine progress (`sections ? flatMap : items` -> checked count -> percentage) was copy-pasted and hand-rolled across **9 separate call sites** in 7 files without a shared canonical utility.
3. **Security Rules Write-Deny on Checklist Telemetry**: `ActivityLogService.logChecklistActivity` attempted to write to `users/{userId}/events`. In `firestore.rules`, the `events` subcollection was only authorized under `match /tasks/{taskId}` (line 462), with the collection-group rule at line 495 being read-only. Consequently, all checklist item toggles and submissions were rejected by Firestore's default-deny rule, and the errors were silently swallowed by `try/catch` with `console.error`.
4. **Sibling Method Query Blindness**: Sibling function `RecurringChecklistService.listPendingForPosition` (consumed by `PositionWorkspacePage.jsx:29`) harbored the exact same `status === 'pending'` bug as `listPendingForUser`, surviving the initial remediation pass because static checks were focused on the single reported function rather than sweeping the entire service class.
5. **Council Governance Process Gap**: The initial architecture review suffered from **Surface-Existence Confirmation Bias**—verifying that a method and unit test existed in isolation without executing static call-graph greps (`grep -r`) or walking the full AST rule hierarchy in `firestore.rules`.

---

## 2. Architectural Surface Mapping

| Surface | Status | Impact / Root Cause in Incident |
| :--- | :--- | :--- |
| **1. UI Surface** | **AFFECTED** | `MyDayPage.jsx` filtered routines through client-side `localStorage` (`committedRoutineIds`) and `pendingChecklist`, displaying only an opt-in subset rather than complete positional obligations. Progress bars re-implemented progress math inline. |
| **2. Data Surface** | **AFFECTED** | `firestore.rules` lacked a `match /events/{eventId}` rule under `match /users/{userId}`. Checklist telemetry writes to `users/{userId}/events` failed silently on default-deny. |
| **3. Reactive Surface** | **AFFECTED** | In-memory item checking patched `pendingChecklist` in React state (`MyDayPage.jsx:207-219`), creating an illusion of persistence during an active session that broke upon browser refresh or role switch. |
| **4. Service Surface** | **AFFECTED** | `RecurringChecklistService.getUnifiedDailyAgendaForUser` was implemented and tested as part of ADR-029 / TASK-246, but was never wired to caller pages. `listPendingForUser` and `listPendingForPosition` suffered from a status filtering bug (`i.status === 'pending'`). |
| **5. Module Surface** | **AFFECTED** | `ActivityLogService.js` swallowed Firestore permission rejection in `logChecklistActivity()` (`try/catch` with `console.error` returning `null`), masking security rule failures from the caller and mock-backed unit test suites. |
| **6. Governance Surface** | **AFFECTED** | Architecture Council review declared "100% reuse" based on top-down ADR alignment and unit test presence, failing to execute mandatory bottom-up call-graph and rule-AST validation checks. |

---

## 3. Root Cause Analysis

### Root Cause 1: Surface-Existence Bias in Architectural Evaluation
The agent saw the function `getUnifiedDailyAgendaForUser` in `RecurringChecklistService.js` and saw its passing test in `RecurringChecklistService.test.js`. It assumed the production UI consumed this function, without running a static grep across `src/pages/` to verify callers.

### Root Cause 2: Lexical Pattern Matching on Firestore Security Rules
The agent grepped `firestore.rules` for `match /events/{eventId}` and saw a match with `allow create`. It failed to observe that the match was nested exclusively within `match /tasks/{taskId}`. The collection group rule `match /{path=**}/events/{eventId}` only granted `allow read, list`, not `create`.

### Root Cause 3: Swallowed Asynchronous Errors in Telemetry Services
Because `ActivityLogService.logChecklistActivity()` caught and logged errors to `console.error` rather than re-throwing or failing visibly, and because unit tests mocked Firebase, write-permission failures produced zero runtime crashes or test failures.

### Root Cause 4: Lack of Canonical Routine Math Helper
No single utility function existed in `src/utils/` or `src/services/` for routine item/section evaluation, leading every authoring developer to write custom inline `.reduce()` or `.flatMap()` loops.

### Root Cause 5: Narrow-Scope Defect Remediation
When fixing `listPendingForUser`, the remediation pass targeted only the specific method named in the finding without executing a service-wide query sweep for identical filtering logic on sibling methods (`listPendingForPosition`).

---

## 4. Remediation & Invariants Established

### Invariant 1: Mandatory Caller Verification (Anti-Orphan Architecture Gate)
Before any Council Review or architectural proposal declares an existing function or layer "reusable (100%)", the author MUST run a static grep for callers (`grep_search` across `src/pages/` and `src/components/`). If caller count is 0, it must be declared as **Unwired Specification Stub requiring New Integration**, not "Existing Reuse".

### Invariant 2: Full-Path Security Rule Verification
When auditing database write permissions, security rules MUST be evaluated against the full document path (`/users/{userId}/events/{eventId}`), validating all enclosing parent `match` blocks and HTTP verbs (`create`, `update`, `delete`), never matching leaf collection names in isolation.

### Invariant 3: Single-Source Routine Progress Evaluation
All checklist progress percentages, checked counts, and item tallies MUST consume a single shared pure utility (`calculateChecklistProgress(instance)`), prohibiting inline `flatMap` or `.reduce` duplication across UI components.

### Invariant 4: Telemetry Security Rule Parity
Any subcollection written by `ActivityLogService` (`users/{userId}/events`, `tasks/{taskId}/events`, `auditLogs`) MUST have explicit `allow create` authorization declared in `firestore.rules` matching the authenticated actor's UID.

### Invariant 5: Sibling Method Query & Filter Sweep
When fixing a query or filter defect in a service method, the author MUST perform a static sweep of all sibling methods in the same class/module to verify that identical filtering patterns (such as excluding partial records) do not survive in parallel APIs.

---

## 5. Case Study Discoverability & Back-Links

- **Pattern Captured**: [`.agent/patterns/call-graph-and-rules-ast-verification-gate.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/patterns/call-graph-and-rules-ast-verification-gate.md)
- **Workflow Wired**: [`.agent/workflows/architecture-council.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/architecture-council.md) § "Phase 0: Evidence Collection"
- **Governing SSoT**: [`GEMINI.md`](file:///d:/GitHub_Repo/Task-Dashboard/GEMINI.md) § "Mandatory Tooling Protocols"
