---
description: Master debugging workflow - routes to frontend or backend based on symptom classification
---

# Unified Debugging Workflow

**Purpose**: Single entry point that routes to the appropriate debugging track
**Version**: 1.0

> **Golden Rule**: "State is the Single Source of Truth. The DOM is just a reflection."
> 
> > [!IMPORTANT]
> > **Investigation Gate (IVP-001)**: All debugging and troubleshooting sessions MUST consume and apply the **[ivp-001.md](../../.agent/patterns/ivp-001.md)** protocol. Initialize a Hypothesis Ledger before editing code.
> >
> > **Data Verification Gate (Layer 0)**: Before analyzing data-layer issues or writing query/permission fixes, always verify data existence first. See `.agent/patterns/data-layer-verification-first.md`.
> >
> > **Raw Evidence Gate**: On any "present here, absent there" symptom, dump full raw state and check for shadow schemas (same field/collection name, two unrelated stores) BEFORE building a causal narrative. Treat tooling as potentially volatile if another agent session may be active on this repo. See `.agent/patterns/raw-evidence-before-hypothesis.md`.
> >
> > **Anti-Masking Gate**: Never introduce fallback UI formatting layers or swallow Firestore `permission-denied` errors to mask data desynchronization. See `.agent/patterns/anti-masking-fallback-layers.md`.
> >
> > **Call-Graph & Rules-AST Gate**: Never diagnose architectural or service reuse without verifying callers in `src/pages/` and verifying full path authorization in `firestore.rules`. See `.agent/patterns/call-graph-and-rules-ast-verification-gate.md`.


---

## Step 0: Classify the Issue (< 30 seconds)

```
START: What is the primary symptom?
│
├─ FRONTEND SYMPTOMS (→ /debug-frontend)
│  ├─ Button/toggle does nothing
│  ├─ UI shows wrong/zero value
│  ├─ Toggle changes but behavior unchanged
│  ├─ Scroll jumps after save
│  ├─ New input doesn't trigger recalculation
│  └─ Validation shows correct data but wrong display
│
├─ CSS BRIDGE SYMPTOMS (→ check INC-002 FIRST, then /debug-frontend Track F)
│  ├─ sm:/md:/lg: responsive class appears to do nothing
│  ├─ Grid refuses to go multi-column despite grid-cols-N class
│  ├─ Layout not responsive — works on desktop, stacks on mobile (or vice versa)
│  ├─ Tailwind responsive prefix class silently ignored
│  └─ → Read .agent/patterns/css-bridge-specificity-management.md BEFORE touching code
│     → VEA-001: Do NOT attempt a second CSS edit without visual evidence (screenshot)
│
├─ BACKEND SYMPTOMS (→ /debug-backend)
│  ├─ permission-denied on Firestore read/write
│  ├─ Cloud Function doesn't fire, times out, or throws
│  ├─ Data written but nothing downstream reflects it
│  ├─ Role/permission stale right after login or a level change
│  └─ Query returns zero results despite matching docs existing
│
├─ MIXED SYMPTOMS (start backend, then frontend)
│  ├─ Submit succeeds but Firestore doc has wrong/missing fields
│  ├─ Load works but save fails silently
│  └─ Works locally but fails in production
│
└─ INFRASTRUCTURE SYMPTOMS (→ TROUBLESHOOTING docs)
   ├─ Auth/OAuth errors → TROUBLESHOOTING_Decision_Tree.md#auth-flow
   ├─ Storage 403 → TROUBLESHOOTING_Decision_Tree.md#storage-flow
   ├─ Drive permissions → TROUBLESHOOTING_Decision_Tree.md#drive-flow
   ├─ Config mismatch → TROUBLESHOOTING_Decision_Tree.md#config-sync
   └─ **API slow (60s+)** → **API_PERFORMANCE_TROUBLESHOOTING.md**
```

---

## Step 0.5: Locate the Code (If Needed)

> If you know the symptom but **can't find where the relevant code lives**, use [/codebase-navigation](./codebase-navigation.md).

**Quick Navigation Tips**:
- **2-Strike Rule**: After 2 failed greps, switch to `view_file_outline`
- **Check Plugin Matrix**: Where to insert new components
- **Check Dependency Matrix**: What files depend on what

---

## Step 0.6: Raw Evidence Before Hypothesis (Data-Divergence Symptoms)

Applies whenever the symptom is "shows here, not there" / "value differs between two surfaces/screens":

1. **Dump full raw state first** — all top-level keys + full JSON of the record in question — before reading code to decide which fields matter. Don't scope your first query to what you *expect* the schema to contain.
2. **Shadow-schema check** — grep every reader AND writer of the exact field/collection name involved. An identical name can be two structurally unrelated stores written by disjoint code paths (e.g. an inline array field vs. a subcollection). One found writer ≠ the only writer.
3. **Tag causal claims Verified vs. Inferred** (IVP-001 Evidence Hierarchy) — a theory built from git log timestamps or file mtimes is Inferred until the failure mode is directly reproduced. Say so explicitly; don't present it with Verified-level confidence.
4. **Re-check trusted scripts mid-investigation** — if the user may be running another agent session against this repo concurrently, a script you already read/ran can change under you. If a tool's output is inconsistent across two runs with no edit of your own, run `git status --short -- <script>` before concluding your analysis (or the tool) was wrong.

See `.agent/patterns/raw-evidence-before-hypothesis.md` for the full incident writeup.

---

## Quick Decision Questions

| Question | If YES | If NO |
|----------|--------|-------|
| Is the bug visible in the DOM? | Likely Frontend | Likely Backend |
| Does browser console show correct API response? | Frontend issue | Backend issue |
| Does Firebase Functions log show the invocation? | Check backend logic | Deployment issue |
| Does the bug appear only after save/submit? | Mixed (backend first) | Pure frontend |
| Does refreshing the page fix it temporarily? | State management issue | Data persistence issue |

---

## Route to Sub-Workflow

### → Frontend Track

Use when: UI/State/DOM issues, calculation errors, event wiring problems

// turbo
```powershell
# Open frontend workflow
code "D:\GitHub_Repo\Task-Dashboard\.agent\workflows\debug-frontend.md"
```

**Key Sections**:
- Phase 0: Bug Classification
- Phase 1: Investigation by Track (A/B/C/D)
- Appendix A: Known Issue Index
- Appendix B: Turbo Grep Commands

---

### → Backend Track

Use when: Firestore permission-denied, Cloud Function failures, service-layer wiring, auth/claims issues

// turbo
```powershell
# Open backend workflow
code "D:\GitHub_Repo\Task-Dashboard\.agent\workflows\debug-backend.md"
```

**Key Sections**:
- Section 1: Firestore permission-denied (rules gap)
- Section 2: Cloud Function fails/times out/undeployed
- Section 3: Write succeeded but nothing downstream reflects it
- Section 4: Service layer wiring (ServiceRegistry pattern)
- Section 5: Auth / custom claims issues
- Section 6: Query returns zero results / missing index

---

### → Mixed Issues Protocol

When issue spans both frontend and backend:

```
1. START with Backend
   └─→ Verify Firestore doc has correct data (Firebase Console or Admin SDK)
   └─→ Check Firebase Functions logs for errors
   └─→ Confirm firestore.rules isn't silently blocking the write

2. IF Backend is correct, THEN Frontend
   └─→ Check API response in browser DevTools
   └─→ Trace data flow: Response → State → Render
   └─→ Apply S→S→A→C pattern

3. IF both seem correct, CHECK handoff
   └─→ Field names match between API and UI?
   └─→ Data types match (string vs number)?
   └─→ Response structure matches UI expectations?
```

---

## 6-Step Methodology (Always Applies)

```
┌────────────────────────────────────────────────────────────┐
│ 6-STEP SYSTEMATIC DEBUGGING                                │
├────────────────────────────────────────────────────────────┤
│ 1. STOP & DEFINE (Inventory Tools + Question Assumptions)  │
│ 2. REPRODUCE (Verify consistency)                          │
│ 3. TRACE (Layer 0 Check + Bisect)                          │
│ 4. EVIDENCE (Collect actual data inputs/outputs)           │
│ 5. ROOT CAUSE (Hypothesize → Test → Iterate)               │
│ 6. FIX + VERIFY + PREVENT (Automate guardrails)            │
├────────────────────────────────────────────────────────────┤
│ RED FLAGS: Debugging empty DB | "Maybe it's X" | No logs   │
│            Same field name used in >1 place | unconfirmed  │
│            timeline-based causal story                    │
│ ACTION:    STOP → INVENTORY TOOLS → CHECK DATA SOURCE      │
│            → DUMP RAW STATE → ENUMERATE ALL WRITERS         │
└────────────────────────────────────────────────────────────┘
```

---

## Layer Trace (Applies to Both Tracks)

| Layer | What to Verify | Frontend Tool | Backend Tool |
|-------|----------------|---------------|--------------|
| **Layer 0** | Data exists? / DB accessible? (Verify security rules cover collection, list rules comply with P83, and composite indexes exist for filters+sorting) | N/A | Firebase console / firestore.rules / firestore.indexes.json |
| **Layer 1** | Function/query executing? | Network tab | `firebase functions:log` |
| **Layer 2** | State populated? | `stateManager.get*()` | Firestore doc (Console/Admin SDK) |
| **Layer 3** | Render correct? | DOM inspection | Response JSON |

---

## Cross-Cutting Concerns

### Production Data Repair Gate

If root-causing requires a backfill/repair write against production data (not just code):

1. State the exact payload/document to be written, sourced only from already-verified fields (not invented defaults).
2. Stop. Get explicit user confirmation of that exact payload in its own turn.
3. Only then execute the write, in a subsequent turn — never bundle "here's the payload" and the write attempt together, even if the user's prior answer implied approval of the general action.

### When to Escalate

- Issue affects multiple modules → Check shared utilities
- Issue is intermittent → Add structured logging first
- Issue appeared after deploy → Check `firebase deploy` output and `firebase functions:log`
- Issue affects multiple projects/profiles → Check ENH-INFRA-060 multi-project functions (`syncProjectLevelsOnAssignment`, `maintainProfileUsersIndex`)

### When to Create Ticket

- Debugging took > 2 hours
- Root cause was missing guardrail
- Fix requires architectural change
- Issue affects production users

---

## Sub-Workflow Links

| Workflow | Scope | Lines |
|----------|-------|-------|
| [/debug-frontend](./debug-frontend.md) | UI, State, DOM, Calculations | ~500 |
| [FRONTEND-TOPOLOGY-MODEL.md](../docs/frontend/FRONTEND-TOPOLOGY-MODEL.md) | Mental Model for frontend layers | ~200 |
| `npm run query -- --frontend <terms>` | Page/component entry point hints (query the JSONL index) | — |
| [layout-console-toolkit.js](../docs/frontend/layout-console-toolkit.js) | DevTools console paste-in layout diagnostic utility | ~250 |
| [frontend-knowledge-index.jsonl](../docs/frontend/frontend-knowledge-index.jsonl) | Queryable incident and constraint index | ~15 entries |
| [/debug-backend](./debug-backend.md) | Firestore rules, Cloud Functions, Service Layer, Auth/Claims | ~300 |
| [backend-knowledge-index.jsonl](../../docs/backend/backend-knowledge-index.jsonl) | Queryable backend incident index (`--backend`) | ~13 entries |
| [FIREBASE-CLI-OPERATIONS-GUIDE.md](../../docs/FIREBASE-CLI-OPERATIONS-GUIDE.md) | Deploy, billing plan constraints, rollback | — |
| [SYSTEMATIC_DEBUGGING.md](../../docs/ssot/testing-hub/SYSTEMATIC_DEBUGGING.md) | Full methodology + Cases | ~700 |
| [ivp-001.md](../../.agent/patterns/ivp-001.md) | Investigation Validation Protocol | ~120 |

---

**Last Updated**: 2026-01-14
**Origin**: Unified wrapper over frontend + backend workflows
