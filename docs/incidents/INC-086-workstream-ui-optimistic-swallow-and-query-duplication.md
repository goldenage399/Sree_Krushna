# Incident Report: INC-086 — Workstream UI Integration: Optimistic Swallow, Timestamp Clobbering, Query Duplication & Unimplemented Cycle Detection

**Date**: 2026-09-18  
**Status**: RESOLVED  
**ID**: INC-086  
**Track**: Frontend UI / Error Handling / Data Integrity / Governance Tooling  
**Governing Standards**: Protocol P20 (Audit Trail Invariants), Protocol P92 / ARCH-INV-012 (Event Coverage), Protocol P33 (O(1) I/O Guardrail), Protocol P-EDL (Enhancement Dependency Linkage)  
**Affected Components**:
- `src/components/TaskDetailsModal.jsx`
- `src/services/EnhancedTaskService.js`
- `src/components/workstream/WorkstreamSelector.jsx`
- `scripts/verify-enhancement-dependencies.cjs`
- `.agent/patterns/subcomponent-cache-propagation.md`

---

## 1. Executive Summary

During the initial implementation of **TASK-251** (Workstream UI Integration — Task Creation Wizard & Task Details Modal), four distinct defects were detected during adversarial code review (Review 1.9) prior to production merge:

1. **Swallowed Failure in Optimistic Update (`TaskDetailsModal.jsx`)**:  
   `handleWorkstreamChange` invoked `EnhancedTaskService.updateTaskWorkstream(task.id, newWsId)`. Because `EnhancedTaskService` wraps mutations in `ErrorHandler.handleOperation`, failure returned `{ success: false, error }` instead of throwing synchronously. The calling modal did not test `result.success`, thereby swallowing the failure and optimistically updating the local state as if the reassignment succeeded.

2. **Timestamp Field Clobbering (`EnhancedTaskService.js`)**:  
   `updateTaskWorkstream` wrote `lastActivityAt: serverTimestamp()` directly to the task document. However, `appendTaskEvent` was executed immediately downstream, which automatically updates `lastActivityAt` as part of the canonical activity pipeline. Writing `lastActivityAt` directly violated the established mutation contract (where task doc updates set `lastUpdatedAt: serverTimestamp()`).

3. **Duplicate Firestore Query Ingestion (`WorkstreamSelector.jsx` inside `TaskDetailsModal.jsx`)**:  
   `TaskDetailsModal` already fetched `useProjectWorkstreams(task.projectId)` to construct the `Project / Workstream / Task` breadcrumb. However, the embedded `<WorkstreamSelector>` independently executed `useProjectWorkstreams(projectId)` again unconditionally, resulting in duplicate Firestore listeners and queries for identical project data.

4. **Nominal Verification without Implementation (`verify-enhancement-dependencies.cjs`)**:  
   The newly introduced script claimed in its CLI output and documentation to perform circular dependency cycle detection across enhancement notes, but only evaluated node existence and self-dependency, lacking any graph traversal algorithm.

All four findings were resolved, tested (34 unit/integration tests green), and codified into repository governance.

---

## 2. Architectural Surface Mapping (6 Surfaces)

| Surface | Status & Impact | Resolution & Verification |
|---|---|---|
| **1. UI Surface** | ✅ AFFECTED | Added explicit `if (!result.success) throw result.error;` inside `handleWorkstreamChange` in `TaskDetailsModal.jsx`. Tested rollback behavior on failure with a dedicated Vitest test case. |
| **2. Data Surface** | ✅ AFFECTED | Aligned `updateTaskWorkstream` in `EnhancedTaskService.js` to write `lastUpdatedAt: serverTimestamp()`, avoiding redundant write collision with `appendTaskEvent`'s `lastActivityAt`. |
| **3. Reactive Surface** | ✅ AFFECTED | Added optional `preloadedWorkstreams` prop to `<WorkstreamSelector>`. When passed from `TaskDetailsModal`, `useProjectWorkstreams` skips the network fetch. Captured pattern in `.agent/patterns/subcomponent-cache-propagation.md`. |
| **4. Service Surface** | ✅ AFFECTED | Verified `EnhancedTaskService.updateTaskWorkstream` properly records `TASK_WORKSTREAM_ASSIGNED` event telemetry with old and new workstream IDs (`check-task-event-coverage.cjs` clean). |
| **5. Module Surface** | ✅ NOT AFFECTED | No third-party dependency additions or route structure alterations. |
| **6. Governance & Tooling Surface** | ✅ AFFECTED | Implemented true 3-color DFS (WHITE/GRAY/BLACK) cycle detection in `scripts/verify-enhancement-dependencies.cjs`. Registered Standard `P-EDL` in `.agent/standards-catalog.json` and wired to PREFLIGHT R42. |

---

## 3. Root Cause Analysis

1. **Service Return Contract Assumption**:  
   Developers commonly assume service mutation methods reject or throw on failure. In this codebase, `ErrorHandler.handleOperation` catches exceptions and returns standardized result objects `{ success: boolean, data?, error? }`. Bypassing a check on `result.success` allows errors to pass silently through `try/catch` blocks.

2. **Mutation Schema Invariance (P20 / ARCH-INV-005)**:  
   Direct task document writes must strictly modify entity fields and `lastUpdatedAt`. `lastActivityAt` is reserved exclusively for activity-producing event logs appended via `appendTaskEvent`. Conflating the two creates unnecessary write overhead and schema confusion.

3. **Subcomponent Query Encapsulation vs. Composition**:  
   Encapsulating data-fetching inside reusable inputs creates great standalone ergonomics, but causes N+1 query proliferation when embedded into composite views. Reusable selectors must support optional parent-provided data props.

4. **Surface-Level Verification Scripts**:  
   Writing governance scripts that check metadata without implementing real graph algorithms creates a false sense of security.

---

## 4. Invariants Established

### Invariant 1: Result Success Verification on Service Mutations
Whenever calling service methods wrapped with `ErrorHandler.handleOperation`, callers MUST explicitly check `result.success`:
```javascript
const result = await EnhancedTaskService.updateTaskWorkstream(taskId, workstreamId);
if (!result.success) {
  throw result.error || new Error('Failed to update workstream');
}
```

### Invariant 2: Mutation Timestamp Separation
Task entity updates set `lastUpdatedAt: serverTimestamp()`. Never write `lastActivityAt` directly during standard mutations; delegate activity timestamps to `appendTaskEvent`.

### Invariant 3: Subcomponent Cache Propagation
Reusable selector components that fetch their own options MUST accept an optional `preloadedData` prop (e.g. `preloadedWorkstreams`) to allow composite parents to pass already-fetched collections.

### Invariant 4: True Algorithmic Graph Verification (Protocol P-EDL)
Dependency checkers must execute real graph traversal (such as 3-color DFS) to assert acyclicity across dependency linkages.

---

## 5. Verification & Regression Tests

1. **Unit & Integration Tests**:  
   - `src/components/TaskDetailsModal.workstream.test.jsx`: Added test confirming error handling and rollback when `updateTaskWorkstream` returns `success: false`.  
   - `src/components/workstream/WorkstreamSelector.test.jsx`: Added tests asserting hook is bypassed when `preloadedWorkstreams` is provided.  
   - All 5 suites (34 tests) pass with Vitest (`npm test`).
2. **Event Coverage**:  
   `node scripts/check-task-event-coverage.cjs` passes cleanly (100% write path coverage).
3. **Graph Integrity**:  
   `npm run check:enhancement-deps` executes 3-color DFS cycle check across 61 valid links without error.
4. **Governance Wiring**:  
   `npm run verify:governance-wiring` exits with code 0.
