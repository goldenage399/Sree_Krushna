---
description: Unified debugging workflow for backend issues - Firestore rules, Cloud Functions, service layer, and auth/claims
---

# Backend Debugging Workflow

**Purpose**: End-to-end debugging process for Task-Dashboard's Firebase backend
**Scope**: Firestore (rules, queries, indexes), Cloud Functions (`functions/`), Service Layer (`src/services/`), Auth/Custom Claims
**Version**: 2.0

> **Key Insight**: A `permission-denied` error almost always means `firestore.rules` has no matching block for that collection (P87), not that the user's role is wrong — check the rules file before the auth logic. A Cloud Function that silently "does nothing" crashed before its write, or never fired at all — check Firebase Console → Functions → Logs, not client-side network tab.

> [!IMPORTANT]
> **Incident & Knowledge Query Gate**: Run `node tools/query-cli/cli.cjs --backend "<symptom/action keywords>"` before diagnosing to surface matching INC-XXX case studies and backend invariants (P59, P87, P92, P94, P97, ARCH-INV-002, ARCH-INV-012, etc.) from [docs/backend/backend-knowledge-index.jsonl](../../docs/backend/backend-knowledge-index.jsonl).

> **Master Workflow**: [/debug](./debug.md) — Routes to the appropriate track based on symptom
>
> > [!IMPORTANT]
> > **Investigation Gate (IVP-001)**: All debugging and troubleshooting sessions MUST consume and apply the **[ivp-001.md](../../.agent/patterns/ivp-001.md)** protocol. Initialize a Hypothesis Ledger before editing code.
>
> **Cross-Reference**: For UI/State issues, use [/debug-frontend](./debug-frontend.md)

---

## Quick Decision Tree (< 2 min)

```
START: What is the symptom?
│
├─[A] permission-denied on read/write
│   └─→ firestore.rules missing a block for this collection (see Section 1)
│
├─[B] Cloud Function doesn't fire, times out, or throws
│   └─→ Check Firebase Console → Functions → Logs (see Section 2)
│
├─[C] Data was written but nothing downstream reflects it
│   └─→ Write-without-reader OR missing lifecycle event (see Section 3)
│
├─[D] Service behaves inconsistently / circular-dependency-shaped bug
│   └─→ ServiceRegistry wiring violation (see Section 4)
│
├─[E] Role/permission looks stale right after login or a level change
│   └─→ Custom claims race condition or string/number type mismatch (see Section 5)
│
├─[F] Query returns zero results despite matching docs existing
│   └─→ Status-vocabulary casing OR missing composite index (see Section 6)
│
└─[G] UI shows wrong value but backend data is correct
    └─→ Use /debug-frontend → Data Divergence Preflight
```

---

## Section 1: Firestore permission-denied (Rules Gap)

> **Root Cause (P87)**: Every client-side `db.collection('X')` reference must have a matching named block in `firestore.rules`. A new collection referenced from the client with no rules block fails closed — every read/write on it is `permission-denied`. See [INC-019](../../docs/incidents/INC-019-archivedprofiles-missing-firestore-rule.md), [INC-032](../../docs/incidents/INC-032-auditlogs-collection-missing-firestore-rule.md).

### Diagnosis

```
1. IDENTIFY the failing collection from the error/stack trace.
2. grep -n "match /<collection>" firestore.rules
   → No match found?  This is the bug (P87 gap). Add a named rules block.
3. Match found but still denied?
   → Check P83: does the rule call resource.data on a doc that might not exist?
     (`get()`/`exists()` must be null-safe — see the helper pattern at the top
     of firestore.rules, e.g. getUserData()).
   → Check whether the read is a `get` (single doc) vs `list` (query) — rules
     for the two can diverge; a `list` rule missing is a common miss.
4. Verify locally before redeploying:
   firebase emulators:start --only firestore
```

### Common Fixes

| Symptom | Root Cause | Fix |
|---|---|---|
| New collection, all ops denied | No rules block (P87) | Add `match /{collection}/{doc} { ... }` block |
| Denied only on `list`, `get` works | Rules diverge between get/list | Add/align the `list` rule |
| Denied intermittently | `resource.data` accessed before doc exists | Null-safe pattern: check `exists()` before `get()` (P83) |
| Denied for one role only | Helper function (`isOwner()`, level check) wrong | Trace the helper, not the leaf rule |

---

## Section 2: Cloud Function Fails Silently, Times Out, or Isn't Deployed

> **Root Cause**: `functions/` uses Firebase Functions v2 (`onCall`, `onRequest`, `onSchedule`, `onDocumentCreated/Updated/Deleted` — see [functions/index.js](../../functions/index.js), [functions/multiProjectFunctions.js](../../functions/multiProjectFunctions.js)). A function that "does nothing" either crashed before completing its write, or was never actually deployed/triggered.

### Diagnosis

```
1. CHECK LOGS
   firebase functions:log --only <functionName>
   → Or Firebase Console → Functions → Logs, filter by function name and time.

2. CONFIRM IT'S DEPLOYED
   firebase functions:list
   → Not listed? It was added to functions/*.js but never deployed.

3. CHECK BILLING PLAN GATE
   → Scheduled functions (onSchedule) and most triggers require Blaze plan.
   → See docs/FIREBASE-CLI-OPERATIONS-GUIDE.md § Billing Plan Constraints —
     several functions in functions/index.js are already commented
     "DISABLED: Requires Cloud Scheduler billing".

4. DEPLOY TIMEOUT?
   FUNCTIONS_DISCOVERY_TIMEOUT=60000 firebase deploy --only functions
```

### Common Fixes

| Error | Fix |
|---|---|
| Function not in `functions:list` | Deploy: `firebase deploy --only functions:<name>` |
| Deploy hangs/times out | `FUNCTIONS_DISCOVERY_TIMEOUT=60000 firebase deploy --only functions` |
| `onSchedule` never fires | Requires Blaze plan + Cloud Scheduler — check billing plan first |
| Trigger fires but exits early | Check `maxInstances`/rate limiter (`FirebaseFunctionsRateLimiter` in `multiProjectFunctions.js`) isn't silently dropping the call |
| Callable (`onCall`) throws on client | Check for `HttpsError` thrown server-side — client sees generic error, real reason is in Functions logs |

Full deployment reference: [FIREBASE-CLI-OPERATIONS-GUIDE.md](../../docs/FIREBASE-CLI-OPERATIONS-GUIDE.md)

---

## Section 3: Write Succeeded But Nothing Downstream Reflects It

> **Root Cause**: Two distinct patterns, both documented incidents:
> - **Write-without-reader (P59)** — a field or document gets written but no code path ever reads it. See [INC-059](../../docs/incidents/INC-059-write-without-reader-pattern.md).
> - **Missing lifecycle event (P92 / ARCH-INV-012)** — any write to `tasks/` must call `EnhancedTaskService.appendTaskEvent()` in the same file, or Activity Dashboard / effort telemetry silently omits it. See [INC-045](../../docs/incidents/INC-045-activity-dashboard-event-metadata-field-name-drift.md), [INC-049](../../docs/incidents/INC-049-effort-telemetry-status-priority-omission.md).

### Diagnosis

```
1. Is the write actually against `tasks/`?
   → grep the write call: updateDoc/setDoc/deleteDoc/addDoc
   → Does the SAME FILE also call EnhancedTaskService.appendTaskEvent()?
   → If not: run npm run check:event-coverage — it will flag this file (R22 gate).

2. Is this a non-tasks write with no visible effect?
   → Find every reader of the field/collection you just wrote (grep both name forms —
     camelCase and any legacy snake_case alias).
   → Zero readers found → this is P59. Confirm a reader exists before shipping,
     don't assume "it'll be read eventually."

3. Is metadata being written under the wrong key?
   → Free-text note/work-description content MUST use meta.comment (P97).
   → grep all appendTaskEvent call sites before adding a new consumer that reads
     event.metadata.X — confirm the key is actually written somewhere.

4. Is this a migration/backfill write?
   → Check P28: did the script verify the target field ISN'T already populated
     before writing an empty default? See INC-061 (data loss from skipping this).
```

### Common Fixes

| Symptom | Root Cause | Fix |
|---|---|---|
| Task write missing from Activity Dashboard | No `appendTaskEvent()` call in the writing file | Add the call, same file, same function (P92/ARCH-INV-012) |
| Work note text vanishes | Written under a made-up key (`remarks`, `progressNotes`) | Use `meta.comment` (P97) |
| Field written, feature has no effect | No reader exists (P59) | Confirm/add a reader before shipping the write |
| Migration wiped existing data | Script didn't check occupancy first (P28) | Verify field/document isn't already populated before writing defaults |

---

## Section 4: Service Layer Wiring (ServiceRegistry Pattern)

> **Root Cause (ARCH-INV-002)**: Services must be registered in `ServiceInitializer.registerBusinessServices()`, never via `ServiceRegistry.register()` called directly from a page or component — that creates circular-dependency risk and inconsistent service state. See [INC-017](../../docs/incidents/INC-017-arch-inv-002-service-registration-page-component.md), [INC-027](../../docs/incidents/INC-027-blocker-sync-service-import-without-write-wiring.md).

### Diagnosis

```
1. grep -rn "ServiceRegistry.register(" src/pages/ src/components/
   → Any hits = ARCH-INV-002 corollary violation. Move to ServiceInitializer.js.

2. grep -rn "ServiceRegistry.get(" <the failing feature's files>
   → Confirm the service is actually being looked up, not directly imported
     (direct service-to-service imports are the ARCH-INV-002 base violation).

3. Feature "looks wired" (import present) but never actually runs?
   → grep for real CALL SITES of the imported service's methods, not just the
     import line. An import with zero call sites is dead wiring (INC-027).

4. Run the automated gates:
   npm run sg:inv002   # service-to-service imports in src/services/
   npm run sg:inv002b  # ServiceRegistry.register() in pages/components
```

### Common Fixes

| Symptom | Root Cause | Fix |
|---|---|---|
| New service breaks unrelated pages on load | Registered in a page/component, not ServiceInitializer | Move `.register()` call to `ServiceInitializer.registerBusinessServices()` |
| Service imported, feature does nothing | Import present, no actual call site | Wire the real invocation, verify with a log/breakpoint that it fires |
| Circular import error | Direct service-to-service import | Route through `ServiceRegistry.get('ServiceName')` instead |

---

## Section 5: Auth / Custom Claims Issues

> **Root Cause**: Two distinct incidents cover most of this space:
> - **JWT claims race (INC-030)** — claims don't reflect immediately after a level/role change because the ID token wasn't force-refreshed.
> - **Type coercion (P94 / INC-038)** — `level` from `useAuth()` is a Firestore **string**. `level === 1` is always `false`; must `parseInt(level)`/`Number(level)` first.

### Diagnosis

```
1. Symptom is "stale" permission right after a change?
   → Check whether the client forces a token refresh (getIdToken(true)) after
     the claims-sync Cloud Function (syncCustomClaimsOnLevelChange) completes.
   → Claims propagate server-side immediately; the CLIENT's cached token does not
     update until it's force-refreshed.

2. Symptom is "superadmin feature hidden despite correct level"?
   → grep -n "level ===" or "level >" or "level <" in the failing file.
   → Any raw comparison without parseInt(level)/Number(level) first = the bug (P94).
   → Fix at the source in AuthContext's setLevel() if this recurs across files.

3. Confirm claims sync functions are actually deployed and firing:
   firebase functions:log --only syncCustomClaimsOnLevelChange
```

### Common Fixes

| Symptom | Root Cause | Fix |
|---|---|---|
| Permission stale right after login/role change | Client token not force-refreshed | Call `getIdToken(true)` after claims sync |
| `level === 1` always false | Firestore string vs numeric literal | `parseInt(level)`/`Number(level)` before comparing (P94) |
| Claims never update at all | Cloud Function not deployed/firing | Check `firebase functions:log --only syncCustomClaimsOnLevelChange` |

---

## Section 6: Query Returns Zero Results / Missing Index

> **Root Cause**: Either a status-vocabulary casing mismatch (P-CASE) against legacy seeded data, or Firestore requires a composite index for the query's exact filter+sort combination and none exists yet.

### Diagnosis

```
1. Status/vocabulary field involved (status, priority, etc.)?
   → Query must match BOTH the canonical lowercase value AND any legacy
     capitalized value with a Firestore `in` operator (P-CASE).
   → See INC-048 for the exact shape of this failure.

2. Console error mentions "The query requires an index"?
   → Firestore gives you the exact composite index definition and a direct
     console link in the error message — click it, or add manually to
     firestore.indexes.json and run:
   firebase deploy --only firestore:indexes

3. Query uses where() on a field that might be absent/null on older docs?
   → where() silently EXCLUDES documents missing that field — this isn't a
     bug, it's how Firestore works. Confirm the field is actually present on
     the documents you expect to match (check a raw doc first, don't assume).
```

---

## Section 7: Verification & Automated Gates

| Layer | Check | Command |
|---|---|---|
| **Firestore Rules** | Collection has a matching rules block | `grep -n "match /<collection>" firestore.rules` |
| **Rules (local)** | Rules behave as expected before deploy | `firebase emulators:start --only firestore` |
| **Service Registration** | No `.register()` outside ServiceInitializer | `npm run sg:inv002 && npm run sg:inv002b` |
| **Query Memoization** | No unmemoized Firestore query in render/effect | `npm run sg:inv003` |
| **Profile Writes** | Assignment writes route through the lockdown service | `npm run sg:inv008` |
| **Task Event Coverage** | Every `tasks/` write calls `appendTaskEvent` | `npm run check:event-coverage` |
| **Functions Deploy** | Function is live | `firebase functions:list` |
| **Functions Logs** | What actually happened server-side | `firebase functions:log --only <name>` |

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND DEBUGGING PATTERNS (Firebase / Firestore / Functions)   │
├─────────────────────────────────────────────────────────────────┤
│ permission-denied:        No rules block → firestore.rules (P87)│
│ Function does nothing:    Check Functions logs, not network tab │
│ Write, no downstream effect: Write-without-reader (P59) or      │
│                            missing appendTaskEvent (P92)         │
│ Stale permission post-login: Force ID token refresh             │
│ level === N always false: Coerce with parseInt()/Number() (P94) │
│ Zero results, data exists: Status casing (P-CASE) or missing    │
│                            composite index                       │
├─────────────────────────────────────────────────────────────────┤
│ RED FLAGS: Guessing rules cause without grepping firestore.rules│
│            Blaming client code before checking Functions logs   │
│ ACTION:    Query --backend gate → grep firestore.rules → logs   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cross-References

| If you need... | Go to... |
|---|---|
| UI/State debugging | [/debug-frontend](./debug-frontend.md) |
| Full deployment operations (Spark vs Blaze, timeouts, rollback) | [FIREBASE-CLI-OPERATIONS-GUIDE.md](../../docs/FIREBASE-CLI-OPERATIONS-GUIDE.md) |
| Security rules architecture | [FIREBASE-SECURITY-ARCHITECTURE-ANALYSIS.md](../../docs/FIREBASE-SECURITY-ARCHITECTURE-ANALYSIS.md) |
| Firestore query safety (memoization) | [QUERY-MEMOIZATION-PROTOCOL.md](../../docs/development-guidelines/QUERY-MEMOIZATION-PROTOCOL.md) |
| Task lifecycle/event architecture | [TASK-MANAGEMENT.md](../../docs/TASK-MANAGEMENT.md) |
| Performative council & telemetry gate | [.agent/patterns/performative-council-and-telemetry-gate.md](../patterns/performative-council-and-telemetry-gate.md) |
| General 6-step methodology | [SYSTEMATIC_DEBUGGING.md](../../docs/ssot/testing-hub/SYSTEMATIC_DEBUGGING.md) |
| Full backend case studies | [DEBUGGING_HANDBOOK.md](../../docs/ssot/testing-hub/DEBUGGING_HANDBOOK.md) |

---

## Reference

- [docs/backend/backend-knowledge-index.jsonl](../../docs/backend/backend-knowledge-index.jsonl) — queryable via `node tools/query-cli/cli.cjs --backend <terms>`
- [CLAUDE.md](../../CLAUDE.md) — Architectural Invariants Cache (ARCH-INV-002, 003, 008, 009, 010, 012) and P-standard registry (P28, P59, P83, P87, P92, P94, P97, P-CASE)
- [INC-068](../../docs/incidents/INC-068-multi-theme-typography-override-and-css-edit-boundary.md) — the retrospective that surfaced this file was silently unusable (referenced a GAS/Sheets backend that doesn't exist in this repo)

---

**Last Updated**: 2026-07-30
**Origin**: Rewritten from scratch — the prior version was copy-pasted from a different project's Google Apps Script + Google Sheets backend (`02_Router.js`, `clasp`, `deploy.ps1`, `SHEET_SCHEMAS.md`) and referenced files that never existed in this repo. This version is scoped to Task-Dashboard's actual backend: Firebase Cloud Functions (`functions/`), Firestore rules/queries, and the Service Layer (`src/services/`).
