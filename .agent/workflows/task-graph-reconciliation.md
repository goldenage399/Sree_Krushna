---
description: Add, remove, or rewire task dependency edges (depends_on/unlocks) when a Change Request or new task changes the sequencing of the wedding operation.
---

# /task-graph-reconciliation — Task Dependency Graph Reconciliation

**Trigger:** "add a task dependency", "this CR changes the sequence", "rewire the DAG", "why is this task locked", or before editing `depends_on`/`unlocks` on any task.

**Provenance:** Adapted from `D:\GitHub_Repo\UG-Farmhouse\System Reference\portable\workflows\GRAPH_CHANGE_WORKFLOW.md`. UG Farmhouse has one JSON file and one dashboard; this repo has two task sources that only got unified for *display* on 2026-08-23 (see `public/js/app.js` `normalizeDagTask`/`DAG_TASKS`) — dependency *authoring* is still manual. Read Step 0 before assuming otherwise.

---

## Step 0 — Know Which File Owns the Edge

| Source | File | Has depends_on/unlocks? | Feeds |
|---|---|---|---|
| Full planning task list (~60 tasks) | `public/js/marriage-state.js` → `MARRIAGE_STATE.tasks[]` | No — never authored | Task Manager tab (via `app.js` `DEFAULT_TASKS`) |
| Wedding-day DAG (35 tasks) | `public/js/modules/dopkos-engine.js` → `PROJECT_STATE.tasks[]` | Yes — canonical | DO-PKOS canvas **and** Task Manager tab (merged in) |

If the task you're wiring already exists in `PROJECT_STATE.tasks`, edit it there — it's the SSOT for dependency edges. If it only exists in `MARRIAGE_STATE.tasks`, it has no wiring yet; adding `depends_on`/`unlocks` to it there is a new addition, not a copy of existing data — treat it like Step 1b below (namespace/collision check), not a reflex edit.

---

## Step 1 — Pre-Change Impact Scan

### 1a. Before deleting or renaming a task ID
```bash
grep -rn "TARGET_TASK_ID" public/js/marriage-state.js public/js/modules/dopkos-engine.js
```
Every hit in another task's `depends_on`/`unlocks`/`sealing_gate` must be removed or repointed first — don't leave a dangling reference.

### 1b. Before adding a new edge
Confirm both ends exist:
```bash
grep -n "\"id\": *\"CANDIDATE_ID\"" public/js/marriage-state.js public/js/modules/dopkos-engine.js
```

---

## Step 2 — Classify the Dependency (CRITICAL)

Every edge is exactly one of the 4 laws already documented for this project (see `User_Created/Discussion Threads/ChangeRequest/260822_ChangeReqDB.md`):

- `standard` — normal prerequisite (procurement lead-time, ordinary sequencing).
- `must_precede_sealing` — hard liturgical/gate blocker; successor cannot start until this is `DONE`. Must also set `sealing_gate` to the task ID that closes the window.
- `must_happen_during` — embedded execution window; successor must run *while* the predecessor is open, not after.
- Operational gate convergence (`GATE-0x`) — multiple independent tracks all point `unlocks` at the same gate node; the gate itself is what the next phase depends on, not any single track.

Wrong classification silently breaks the READY/LOCKED math described in that thread — don't leave `dependency_type` unset.

### Decision Gate pattern (for uncertain transitions)
If a successor shouldn't flow straight from a raw investigation/decision to execution (e.g. a signoff, a verification), insert a gate node between them: predecessor → gate → successor, with the successor depending on the gate, never on the raw investigation directly.

---

## Step 3 — Change Requests: Same Rule Applies

`approveChangeRequest()` in `public/js/modules/intake-engine.js` creates the new task with `depends_on: []`, `unlocks: []`, `dependency_type: 'standard'` by default — it does **not** guess at sequencing, because the intake modal only collects freeform notes (`cr.payload.rawNotes`), not a structured predecessor pick. If the approved CR clearly implies a dependency (e.g. "Propose Update" on an existing task, or notes that name a predecessor task ID), wire it manually per Steps 1–2 as part of approving that CR — don't leave a task that obviously has a predecessor floating with an empty `depends_on`.

*(Not yet built: a predecessor-picker dropdown in the intake modal so proposers can set this at submission time instead of a human backfilling it after approval — see the original discussion thread's "Interactive Dependency Picker" proposal.)*

---

## Step 4 — Validate

No automated cross-dependency validator exists in this repo yet (UG Farmhouse's equivalent is `validate_cross_deps.js` — not ported here). Until one exists, check manually:
```bash
# Every depends_on/unlocks/sealing_gate target must resolve to a real id in one of the two files
grep -o '"depends_on": *\[[^]]*\]' public/js/modules/dopkos-engine.js
```
Cross-check each listed ID exists (Step 1b) and that the edge direction is symmetric (`A.unlocks` contains `B` iff `B.depends_on` contains `A`) where both ends live in `PROJECT_STATE.tasks`.

---

## Step 5 — No Manual Sync Step Needed

Unlike UG Farmhouse (paste JSON into a `const PROJECT_STATE = ...` in the dashboard HTML), this repo's Task Manager reads `PROJECT_STATE.tasks` live via `app.js`'s `DAG_TASKS` merge — editing `dopkos-engine.js` is enough; both the DO-PKOS canvas and the Task Manager table update from the same edit.

---

## Step 6 — Commit

```bash
git add public/js/modules/dopkos-engine.js public/js/marriage-state.js
git commit -m "fix(tasks): rewire dependency edge [fromId -> toId]"
```

---

## Workflow Output Format

```
TASK GRAPH RECONCILIATION — Sree Krushna Marriage OS

EDGES ADDED:    [fromId -> toId: Type X (sealing_gate: ID) or none]
EDGES REMOVED:  [fromId -> toId or none]
FILE(S) EDITED: [marriage-state.js / dopkos-engine.js]
VALIDATED:      [Pass / Fail — manual check per Step 4]
COMMITTED:      [Commit Hash]
```
