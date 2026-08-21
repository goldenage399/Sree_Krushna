# INC-027: Blocker Sync — Service Imported Without Write Path Wiring

**Date**: 2026-06-25
**Severity**: Medium (feature silent failure — blocker changes had no effect on task data)
**Branch**: eur-001/m6-ingestion
**Resolution**: Two surgical wiring fixes in `TaskUpdateModal.jsx`

---

## Symptom

Changing the Active Blocker dropdown in the Task Update modal had no observable effect. The dropdown appeared to respond (UI updated locally), but on re-opening the modal the blocker always reset to "none" — even when `task.blockedBy` contained active unresolved blockers. The `task.blockedBy` array in Firestore was never updated by any modal submission.

---

## Root Cause

Two disconnected wiring gaps in `TaskUpdateModal.jsx`:

**Gap 1 — Load**: `formData.currentBlocker` was hardcoded to `'none'` in the `useEffect` initialization block (line 133). It never read from `task.blockedBy` or `task.blockers`, so the modal always opened showing "No Blocker" regardless of actual task state.

**Gap 2 — Write**: `BlockerWorkflowService` was imported at line 47 and its `syncTaskBlockers` method was the correct write interface. However, the submit handler (`handleSubmit`) only wrote `formData.currentBlocker` into `progressUpdate.workSession.blockerType` (timeline metadata) and `auditLog.details.blockerStatus` (audit log). Neither of these paths updates the root `task.blockedBy` array. `syncTaskBlockers` was never called.

The import made the service *appear* wired — any scan of the file's imports would show `BlockerWorkflowService` present. The absence of a write call in the submit path was invisible to a surface scan.

---

## Architectural Surface Mapping

| Surface | Affected? | Detail |
| :--- | :--- | :--- |
| **UI Surface** | ✅ YES | Blocker dropdown showed 'none' on every open; no visual feedback that changes were being discarded |
| **Data Surface** | ✅ YES | `task.blockedBy` array never written to via modal submit; Firestore state never reflected user selection |
| **Reactive Surface** | ✅ YES | `formData.currentBlocker` initialized to `'none'` unconditionally; never read from `task.blockedBy`/`task.blockers` |
| **Service Surface** | ✅ YES | `BlockerWorkflowService.syncTaskBlockers()` imported but never invoked from submit path |
| **Module Surface** | ❌ N/A | Routing and module registration not involved |
| **Governance Surface** | ❌ N/A | ARCH-INV-012 (task write → lifecycle event coverage) was not violated — `syncTaskBlockers` calls `appendTaskEvent` internally (line 322 of service). No existing invariant covered import-without-write-wiring. |

---

## Resolution

**Fix 1 — Load** (`TaskUpdateModal.jsx:133`):
```js
// Before
currentBlocker: 'none',

// After
currentBlocker: (task.blockedBy || task.blockers || []).find(b => !b.resolved)?.type || 'none',
```

**Fix 2 — Write** (`TaskUpdateModal.jsx`, before transaction):
```js
if (formData.currentBlocker !== 'none') {
  await BlockerWorkflowService.syncTaskBlockers(task.id, [
    { type: formData.currentBlocker, owner: formData.blockerOwner || null }
  ]);
}
```

`syncTaskBlockers` internally calls `EnhancedTaskService.appendTaskEvent()` — ARCH-INV-012 is satisfied without additional wiring.

---

## Invariant Gap Identified

No existing ARCH-INV or P-standard covered this failure mode. The deceptive element — an import that signals wiring but whose write methods are never called in the submit path — is a recurring trap for any form component that imports a domain service.

Anti-pattern captured in `.agent/patterns/service-import-without-write-wiring.md`.

A new P-standard or ARCH-INV is recommended (see below). Deferred to post-launch hardening given single-surface fix complexity and low blast radius of the corrective code.

---

## ADR-012 Alignment (ssot-reconciliation finding)

During post-fix governance, `ssot-reconciliation` flagged two items from ADR-012:

1. **v8 `.get()` calls**: ADR-012 line 30 warns that `BlockerWorkflowService` contains runtime-broken v8 API calls (`BlockerWorkflowService.js:346,523`). These are in `processAutomatedReminder` — **not** in `syncTaskBlockers` (lines 291–343, which uses v9 modular API throughout). Our fix is safe.

2. **Schema validation trap**: `syncTaskBlockers` validates entries against `{ type, name, reason }` (lines 303–311). The initial fix passed `{ type, owner }` — both `name` and `reason` would fail `typeof x === 'string'`, causing all entries to be silently rejected. Corrected to `{ type, name: blockerOwner || 'Unknown', reason: nextAction || progressNotes || '' }`.

3. **LOCK-DATA-001 tension**: ADR-012 declares `blockers[]` as the canonical field post-MVP, but `syncTaskBlockers` currently writes to `blockedBy`. This pre-existing drift is deferred per ADR-012. Our load fix reads from `task.blockedBy || task.blockers` (both) to remain tolerant of either shape.

---

## Files Changed

- **Modified**: `src/components/TaskUpdateModal.jsx`
  - Line 133: load `currentBlocker` from active task blocker state
  - Before transaction: call `BlockerWorkflowService.syncTaskBlockers()` when blocker is set
