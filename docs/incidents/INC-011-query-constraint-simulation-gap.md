# INC-011: Query Constraint Simulation Gap — Access Path Opacity

**Status**: Resolved  
**Date**: 2026-06-16  
**Severity**: Process (tooling gap, no immediate data loss)  
**Related**: [INC-010](./INC-010-multi-profile-task-visibility-query-shadowing.md) · [INC-003](./INC-003-profile-dashboard-linkage-divergence.md)

---

## Incident Description

After resolving INC-010 (multi-profile task visibility), verification relied solely on unit tests (`npm run test:unit:run` — 245 passing). No tooling existed to simulate the exact Firestore query constraints the React app emits for a given user and diff those results against the raw profile-based entitlement. This opacity caused two residual issues to go undetected:

1. **Gap 1 (INC-003 regression risk)**: The original INC-010 fix initially passed a `createUserContext({ uid, level })` stub rather than the full `userData` object, stripping `profileAssignments`. This caused `buildScopedTaskQuery` to emit a `WHERE assignedTo.profileId == "__no_profile__"` sentinel that conflicted with the `in` constraint — returning zero results for all level 3/4/5 users. This was caught by the data-layer review in INC-010 but was not automatable before today.

2. **Gap 2 (Architectural tension surface)**: `operations.excutive.pe@gmail.com` had a legacy `role: 'admin'` field in their Firestore user doc. In `createUserContext` (`src/utils/access.ts`), this legacy field was mapped to `super_admin`, routing the user down the no-WHERE super_admin path (seeing all 12 tasks) instead of their profile assignment entitlement (which is 1 task). This legacy mapping and stale field have now been removed.

---

## Architectural Surface Mapping

### 1. UI Surface
- **Impact**: None directly. `MyTasksPage.jsx` and `AssociateDashboard.jsx` render whatever the query returns; no UI-layer symptoms are visible until a user reports missing/excess tasks.

### 2. Data Surface
- **Impact**: The `systemRole` field in Firestore user documents acts as a query-path override that bypasses the `profileAssignments[]` access model (ADR-001). Both fields exist in the same document but govern mutually exclusive code paths in `buildScopedTaskQuery`. No schema constraint enforces that only one path governs a given user.

### 3. Reactive Surface
- **Impact**: None from this incident. The context hydration path (`createUserContext`) is the point of failure — not React state or hook behavior.

### 4. Service Surface
- **Impact**: `buildScopedTaskQuery` in `src/utils/access.ts` (lines 184–221) contains the forked access logic. The two paths (`systemRole === 'super_admin'` → no WHERE; level 3/4/5 → profile `in` query) are structurally sound but cannot be exercised or verified without a runtime-equivalent simulation outside the browser.

### 5. Module Surface
- **Impact**: None. No new file or dependency changes required; the fix was adding a simulation command to the existing `db-inspect.cjs` script.

### 6. Governance Surface
- **Impact**: ADR-003 mandates `createUserContext(userData)` with the full user object. The INC-010 fix initially violated this by passing `{ uid, level }`. ADR-003 enforcement was manual-only (PR review). No automated detection mechanism existed for this class of error. This incident establishes the requirement for P85 (below).

---

## Root Cause

The core process failure was the **absence of a query-constraint simulation tool**, combined with a legacy **`role === 'admin'` → `super_admin` fallback** mapping in `src/utils/access.ts`. 

The user `operations.excutive.pe@gmail.com` had a stale `role: 'admin'` field on their Firestore document. Although their `systemRole` and `level` fields were correctly configured for an admin (Level 2), the legacy check in `createUserContext` promoted them to `super_admin` under the hood.

This gap was invisible because the Admin SDK script fleet could read Firestore data but could not trace which path `buildScopedTaskQuery` would take or execute the simulated query logic. This made it impossible to verify fixes for access-control bugs without a logged-in browser session.

---

## Corrective Actions

### Immediate (completed this session)
1. Added `cmdSimulate` to `src/scripts/db-inspect.cjs` — a 6-phase engine that mirrors `createUserContext` + `buildScopedTaskQuery` logic, executes the simulated query against live Firestore, and produces a gap report (missing + extra tasks).
2. Added `npm run db:simulate -- <email|uid>` npm alias in `package.json`.
3. Updated `.agent/patterns/db-inspect-fleet.md` with the new command and two documented gap patterns.

### Structural (this session)
1. New protocol P85 registered: **`createUserContext` Full-Object Contract** — call sites must always pass the complete `userData` object; stub objects are prohibited.
2. Removed the legacy `userData?.role === 'admin'` mapping check in `src/utils/access.ts` so that it no longer resolves to `super_admin`.

### Governance & Database Clean (completed this session)
1. Audited all users in production Firestore (`pi-ops`). Found two users with legacy `role: 'admin'` fields: `goldenage399@gmail.com` and `testadmin@taskdashboard.test`.
2. Cleaned all stale `role: 'admin'` fields by deleting them from the Firestore user documents. 
3. Under the updated architecture, `super_admin` access is strictly resolved via `level === 1` (reserved exclusively for `goldenage399@gmail.com` and `testadmin@taskdashboard.test` under test configurations), `isOwner === true`, or `designation === 'super_admin'`. Legacy `role` fields are no longer read.

---

## Verification Evidence

Running `npm run db:simulate -- <target_user>` against prod (`pi-ops`) after removing the legacy mapping and Firestore field produces:

```
systemRole:        user
level (legacy):    2
projectLevels:     {"fcit":4}
profileAssignments (active): 7 → [fcit_admin_01, ffc_delta_admin_01, ...]
Constraint: ✅ lvl 3/4/5 path → WHERE assignedTo.profileId IN [fcit_admin_01, ffc_delta_admin_01, ...]
Simulated query returns: 1
Ground truth (should):   1
Missing (gap):           0
Extra:                   0

✅ CLEAN — simulated query matches ground truth. No gap.
```

The tool successfully validates that the user is no longer over-privileged and sees exactly the 1 task they are entitled to. All unit tests (`npm run test:unit:run`) also pass.

---

## References

- [INC-010](./INC-010-multi-profile-task-visibility-query-shadowing.md) — parent incident (multi-profile visibility)
- [INC-003](./INC-003-profile-dashboard-linkage-divergence.md) — profile-dashboard linkage divergence
- [ADR-001](../adr/ADR-001-PROFILE-CENTRIC-TASK-ARCHITECTURE.md) — profile-centric task architecture
- [ADR-003](../adr/ADR-003-HYBRID-AUTHORIZATION-MODEL.md) — hybrid authorization model (mandates `createUserContext(userData)`)
- [access.ts](file:///d:/GitHub_Repo/Task-Dashboard/src/utils/access.ts) — `createUserContext` and `buildScopedTaskQuery` implementation
- [db-inspect.cjs](file:///d:/GitHub_Repo/Task-Dashboard/src/scripts/db-inspect.cjs) — simulation command added
- [db-inspect-fleet.md](file:///d:/GitHub_Repo/Task-Dashboard/.agent/patterns/db-inspect-fleet.md) — gap patterns documented
