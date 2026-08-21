# INC-012 — Profile-Assignment Over-Remediation & Task `project` Query-Path Mismatch

**Date**: 2026-06-17
**Severity**: High (reported task invisible to a real user; remediation effort disproportionate to data reality; a deeper systemic query bug surfaced)
**Status**: Partially Resolved — TASK-176 (schema unification) done & 2 real users repaired; **TASK-177 raised** for the true root cause (open); process lesson institutionalized as `triage-anomalies-first`
**Affected**: `users.profileAssignments[]` schema, `src/utils/access.ts` query routing, `task.project` field, `src/pages/MyTasksPage.jsx`; real users `operations.excutive.pe@gmail.com`, `pratimaenterprises0402@gmail.com`  
**Keywords**: field-mismatch, display-name-vs-id, task.project, query-path, schema-drift, isActive, profileAssignments, zero-results, over-remediation
**Topology Layer**: Data Layer
**Ownership Type**: field-semantic
**Symptom Tags**: zero-results, display-name-vs-id, field-type-drift

---

## What Happened

A real user (`operations.excutive.pe@gmail.com`, 7 profiles / 6 projects) could not see an assigned task ("Delta Marketing CLip On Frames on Windows", `hNFF0wU6WDMnnU2V51M8`, profile `ffc_delta_admin_01`). The investigation diagnosed **profile-assignment schema drift** and produced TASK-176: a full schema-unification + migration system (canonical `normalizeAssignment`, CF-as-sole-writer, `firestore.rules` lockdown, `ARCH-INV-008`, a backfill script, a reconciler, fail-closed handling).

Two problems emerged:
1. **Over-remediation.** The "population" of affected records was **2 real users** plus ~4 disposable `@taskdashboard.test` seed accounts. A migration *system* was built for what manual correction + seed deletion would have solved in minutes. A first-pass of the broad backfill would also have **wiped `projectLevels` → `{}`** for legacy seed accounts (collateral task-visibility loss), caught only by a dry-run.
2. **The schema fix did not fix the reported symptom — and exposed the real cause.** After correctly restoring `projectLevels` (`operations.excutive` → global level 2), the task became *more* definitively invisible. Root cause: **`task.project` stores a display name** (`"FFC Delta"`), while the **level-≤2 query scopes by project ID** (`where("project","in",["ffc_delta",…])`) → 0 matches. Verified systemic: **all 12 prod tasks** store display-name `project` (`"FFC GNP"`×10, `"FFC Delta"`×1, `undefined`×1); none store an ID.

## Root Cause(s)

1. **Data/schema (TASK-176, resolved):** three-way `profileAssignments` drift (`isActive` bool / `"ACTIVE"` / `"active"`) + missing `projectId`/`level` from legacy writers and migration scripts.
2. **Query/data (TASK-177, open):** `task.project` holds a display name; query + `projectLevels` use IDs. `getGlobalLevel` (cross-project `Math.min`) routes any L≤2-in-any-project user through the project-scoped path globally, and `MyTasksPage`'s `level:5` override is dead code (`getGlobalLevel` ignores legacy `level` when `projectLevels` is populated). Fixing the schema *triggered* this regression for the reported user.
3. **Process:** a data anomaly was treated as systemic before its blast radius / real-vs-disposable population was validated with the user → disproportionate engineering.

## Resolution

- **TASK-176 (done):** canonical schema helpers (`AssignmentUtils.js` + mirrored `functions/utils/profileAssignmentSchema.cjs`), CF-as-sole-writer, `firestore.rules` lockdown of client `profileAssignments` writes, `ARCH-INV-008` (ast-grep). The **prevention layer is kept**; the **migration scripts/reconciler are retired** as over-built for the data reality.
- **Real users repaired (scoped, manual):** `operations.excutive` and `pratima` corrected via scoped `--apply`. `pratima` (global L3 → profile-centric path) is fully working; `operations.excutive` (global L2) remains blocked pending TASK-177.
- **TASK-177 raised** for the `project`-field/query-path root cause (the actual unblock). Broad backfill (TASK-176 P-2) and deploy (P-3) held.
- **Process lesson captured** as `.agent/patterns/triage-anomalies-first.md`.

## Architectural Surface Mapping (Full 6-Surface — multi-surface incident)

1. **UI Surface**: "My Tasks" (`MyTasksPage.jsx`) showed zero tasks for an L2 admin; "My Tasks" presentation for multi-position users deferred to post-EUR-001 (swimlane reuse vs. quick-wins flat list) — captured in TASK-177.
2. **Data Surface**: `profileAssignments[]` schema drift (TASK-176); `task.project` stores display names not IDs (TASK-177); `firestore.rules` now blocks client `profileAssignments` writes.
3. **Reactive Surface**: `MyTasksPage` builds context with a `level:5` override that `getGlobalLevel` ignores once `projectLevels` is populated — ineffective routing control (TASK-177 Phase B).
4. **Service Surface**: write path consolidated onto Cloud Functions (`assignUserToProfile`/`removeUserAssignment`); legacy scalar→array migration ported server-side; reconciler intentionally **not** deployed (retired).
5. **Module Surface**: ESM (`src/`) vs CommonJS (`functions/`) boundary forced a mirrored helper copy (`profileAssignmentSchema.cjs`) — guarded by mirror headers; ARCH-INV-008 covers client writes only.
6. **Governance Surface**: `ARCH-INV-008` added; **`triage-anomalies-first` pattern created but under-wired** (no `skill-router` trigger) — remediated in this workflow (Phase 3).

## Structural Invariants

- **ARCH-INV-008 (established, TASK-176):** client code must never write `users.profileAssignments` directly — all writes route through Cloud Functions. Enforced via `.claude/sg-rules/arch-inv-008-profile-writes.yml` + `firestore.rules`.
- **INV (to be enforced by TASK-177):** `task.project` MUST store the project **ID**, not a display name; project-scoped task queries match IDs. ADR-001 covers profile-centric assignment but is silent on the `task.project`=ID requirement → **ADR gap; address in TASK-177.**
- **Process pattern (established):** `triage-anomalies-first` — validate anomaly population (blast radius + real-vs-disposable) with the user before building migration tooling.

## Litmus
- *Same mistake impossible without violating a written protocol?* Partly — ARCH-INV-008 + rules make the write-path drift impossible; the `task.project`=ID invariant is pending TASK-177; the process trap is now wired (Phase 3) so it surfaces mid-session, not only at session-open.
