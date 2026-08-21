---
pattern: db-inspect-fleet
activation_tier: routed              # reference | routed | guarded  (PACT-001)
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "inspect firestore"
  - "check task data"
  - "lookup user assignments"
  - "who can see task"
  - "db inspect"
  - "verify assignments"
  - "task visibility check"
portability: repo-specific           # pi-ops service account key required
canonical_source: task-dashboard
---

# Pattern: db-inspect-fleet

## Purpose

When you need to read live Firestore data outside the browser (no authenticated user session), use the Admin SDK script fleet. The Firebase CLI cannot read data; the client SDK is blocked by security rules without auth. The Admin SDK bypasses both constraints via `serviceAccountKey.prod.json`.

## Environment

**Single environment: pi-ops (production)**. `pi-tasks-dev` was retired (ADR-002 D7, 2026-05-09). Never use `serviceAccountKey.dev.json`.

## Command Fleet

| npm Command | Primary Use |
|---|---|
| `npm run db:overview` | First look — collection counts + all projects, profiles, users |
| `npm run db:task -- <id>` | Full task details + history + audit + who-can-see-it analysis |
| `npm run db:user -- <email\|uid>` | User + all active profileAssignments + live visible-task query |
| `npm run db:profile -- <id>` | Profile doc + assigned users + tasks under that profile |
| `npm run db:project -- <id>` | Project doc + all profiles + tasks + users with project profiles |
| `npm run db:search -- <keyword>` | Keyword search across tasks and archivedTasks |
| `npm run db:verify:assignments` | Full 5-section linkage audit: users ↔ profiles ↔ tasks |
| `npm run db:verify:assignments:user -- <email>` | Scoped audit for one user |
| `npm run db:verify:assignments:profile -- <id>` | Scoped audit for one profile |
| `npm run db:simulate -- <email\|uid>` | ⭐ **Gap detector** — mirrors `createUserContext` + `buildScopedTaskQuery`, executes the exact query the app would emit, diffs vs raw profile-match ground truth |
| `npm run db:audit-roles` | Audits all users for the legacy `role: 'admin'` field |
| `npm run db:clean-roles` | Removes the legacy `role` field from all users who have `role: 'admin'` |

## Source Files

- `src/scripts/db-inspect.cjs` — unified CLI for all inspection + simulate commands
- `src/scripts/db-verify-assignments.cjs` — assignment linkage verifier
- `src/scripts/db-audit-roles.cjs` — user legacy roles auditor
- `src/scripts/db-clean-roles.cjs` — user legacy roles cleaner
- `src/scripts/inspectFirestore.js` — original collection-count inspector (`npm run db:inspect`)

## Key Resolution (never `.dev.json`)

```
serviceAccountKey.prod.json  →  serviceAccountKey.json  →  SA_KEY env var
```

## Known Good Task IDs (prod reference)

- `hNFF0wU6WDMnnU2V51M8` — "Delta Marketing CLip On Frames on Windows" (ffc_delta, profile: ffc_delta_admin_01)

## Known Gap Patterns (discovered via db:simulate)

### Gap 1 — createUserContext strips profileAssignments (INC-003)
**Symptom**: `simulate` shows `🔴 MISSING` tasks. Ground truth > simulated count.  
**Cause**: Call site passes `createUserContext({ uid, level })` stub instead of full `userData`. Empty `profileAssignments` → `buildScopedTaskQuery` emits `WHERE assignedTo.profileId == "__no_profile__"` sentinel. Conflicts with any additional `in` constraint → zero results.  
**Fix**: Always pass full `userData` object to `createUserContext`.

### Gap 2 — systemRole over-privilege vs profile entitlement (discovered 2026-06-16)
**Symptom**: `simulate` shows `🟡 EXTRA` tasks. Simulated count >> ground truth.  
**Cause**: User doc has `systemRole: 'super_admin'` set directly in Firestore. `createUserContext` reads it → `buildScopedTaskQuery` takes the no-WHERE super_admin path → returns ALL tasks in the collection. But the user's actual profile entitlement is only 1 task.  
**Who affected**: `operations.excutive.pe@gmail.com` — 12 tasks returned, ground truth = 1.  
**Action needed**: Verify whether this user should truly be `super_admin` system-wide, or whether `systemRole` should be removed/downgraded and access governed purely by their 7 `profileAssignments`.

## Related Standards

- P53: `docs/ssot/dev-workflow-hub/FIREBASE-INSPECTION-STANDARD.md`
- ADR-002 D7–D8: `docs/adr/ADR-002-FIREBASE-PROJECT-ARCHITECTURE.md`
- INC-003: `docs/incidents/INC-003-profile-dashboard-linkage-divergence.md`
