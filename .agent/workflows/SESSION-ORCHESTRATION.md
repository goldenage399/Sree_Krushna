---
hub: docs/ssot/architecture-hub/README.md
status: Active
created: 2026-05-14
updated: 2026-05-14
axis: Architecture / Governance
layer: session-orchestration
description: Session Orchestration Protocol - Manage live cognitive state during long-running, branching agent sessions.
---

# Session Orchestration Protocol

> **Purpose**: Defines how AI agents manage live cognitive state during long-running, branching sessions.
>
> **This protocol assists cognition — it does not replace it.**

---

## 1. What This Is

Session Orchestration is the **intra-session cognitive coordination layer**. It fills the gap between:

- **Planning** (`task_plan.md`) — the *intended* execution path, created before work begins
- **Memory** (`.agent/memory/`) — the append-only historical audit trail
- **Handoff** (SHO) — the end-of-session transfer document

None of those own **live mutable execution state**. This protocol does.

### The Four-Layer Stack

```
LAYER 1: GOVERNANCE       → invariants, startup, sync, enforcement  (pre/always)
LAYER 2: ORCHESTRATION    → live cognitive state                    (intra-session)  ← this
LAYER 3: MEMORY           → audit trail                             (append-only)
LAYER 4: HANDOFF          → session transfer                        (post-session)
```

---

## 2. When to Activate

**Threshold activation. Not universal. Not mandatory for simple sessions.**

Activate when **any** of the following is true:

- More than one concurrent investigation is open
- A context switch occurs (current work is interrupted to address something new)
- The user or agent says: "pin this", "park this", "come back to this", or invokes `/pin-branch`
- Session resumes after an interruption and a `SESSION_BRANCH_STATE.md` file exists

For linear, single-task sessions: no action required. The protocol stays dormant.

---

## 3. Branch State Machine

Every branch entry has exactly one of six states:

| State | Meaning |
|---|---|
| **ACTIVE** | Current execution focus |
| **READY** | Runnable, not currently focused |
| **BLOCKED** | Waiting on a dependency to complete |
| **PARKED** | Intentionally deferred, resumable |
| **RESOLVED** | Completed within this session |
| **ABANDONED** | Explicitly terminated, no follow-up needed |

**Lifecycle**:
```
OPEN → ACTIVE → RESOLVED
                PARKED → ACTIVE (resumed)
                BLOCKED → READY (dependency cleared) → ACTIVE
                ABANDONED (explicitly closed)
```

---

## 4. Branch Entry Schema

Each entry in `SESSION_BRANCH_STATE.md` must include:

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Short kebab-case identifier (e.g., `session-orchestration-design`) |
| `title` | Yes | Human-readable branch name |
| `state` | Yes | One of the six states above |
| `parent` | Yes | ID of parent branch, or `ROOT` |
| `origin` | Yes | What triggered this branch (user request, discovery, observation) |
| `timestamp` | Yes | ISO-8601 datetime when the branch was pinned |
| `owner` | Yes | Agent/session identifier (e.g., `gemini-session-20260514`) |
| `resume_condition` | Yes | What must be true before re-entering this branch |
| `blocked_by` | No | Branch ID this is waiting on (only if state is BLOCKED) |

---

## 5. Invocation: `/pin-branch`

The `/pin-branch` skill is the primary invocation mechanism.

```
/pin-branch
  title: "Session Orchestration Layer design"
  parent: "sap-standardization"
  origin: "Emerged from Query 2.0 during governance review session"
  resume: "Finalize lightweight protocol spec before building"
```

**What it does**: Appends one structured entry to `.agent/session/SESSION_BRANCH_STATE.md`. Creates the file if it doesn't exist. Takes <30 seconds.

**What it does NOT do**: Create folders, generate IDs, define phases, create enhancement tickets.

---

## 6. Session Reopen: Stale Branch Detection

When opening a session and `SESSION_BRANCH_STATE.md` exists:

1. Read the file and list all PARKED and BLOCKED branches.
2. For each entry where `timestamp` is **more than 7 days old**:
   - Surface to the user: *"Branch `[id]` was pinned on `[date]`. Still relevant?"*
   - **Yes → remains PARKED**
   - **No → mark ABANDONED, no further action**
3. For ACTIVE branches from a previous session: **always** prompt for confirmation before resuming.

---

## 7. Session Close: Three-Route Triage

> **This is the load-bearing mechanism. It must be run as a concrete checklist, not skipped.**
> Reference: `aos-session-close.md` Step 5.0.5.

> [!CRITICAL]
> **Read the ENTIRE file before triaging any entry.** Call `view_file` on `SESSION_BRANCH_STATE.md` without `StartLine`/`EndLine` parameters. If the tool output notes the file is truncated (>800 lines), read subsequent pages before proceeding. **Declare the total entry count** at the start of triage. A partial read is a triage failure — branches pinned from prior sessions are often appended at the bottom.

For each branch in `SESSION_BRANCH_STATE.md`:

| Branch State | Route | Action |
|---|---|---|
| RESOLVED | → **ABANDON** | Mark closed. No further action. |
| PARKED / BLOCKED (minor scope, follow-up only) | → **SHO entry** | Add structured "Pending Investigation" entry to the Session Handoff document with `origin`, `parent`, `resume_condition` fields. |
| PARKED / BLOCKED (large scope, new work required) | → **Enhancement Protocol** | Run `enhancement-scaffolder`, get TASK-XXX ID, update `ENHANCEMENTS.md`. |

After **all entries are ticked**, delete `SESSION_BRANCH_STATE.md`. The deletion is the **final act** — not a mid-triage step.

**Decision heuristic for SHO vs. Enhancement**:
- If it can be resolved in <2 hours next session → SHO entry
- If it requires a formal plan, multiple phases, or PRD scope → Enhancement Protocol

---

## 8. Relationship to Existing Protocols

| Protocol | Relationship |
|---|---|
| Enhancement Protocol / `enhancement-scaffolder` | **Downstream target** — receives promoted branches at session close. Not a substitute. |
| `planning-with-files` / `task_plan.md` | **Upstream input** — the initial task plan defines the ROOT goal this layer tracks against. |
| `aos-session-close.md` | **Integration point** — Step 5.0.5 runs branch triage before FSA artifact inventory. |
| `aos-session-open.md` | **Integration point** — Step 0.5 checks for existing `SESSION_BRANCH_STATE.md` on reopen. |
| `.agent/memory/` | **Separate concern** — memory is append-only historical log. Orchestration is live mutable state. Do not conflate. |

---

## 9. Anti-Patterns

| Don't | Do instead |
|---|---|
| Pin every micro-observation | Only pin things you can't afford to lose |
| Run autonomously without user awareness | Surface branches to user explicitly |
| Build autonomous semantic drift detection | Use artifact-class signals + user judgment |
| Let `SESSION_BRANCH_STATE.md` accumulate across sessions | Triage and delete at every session close |
| Use this as a replacement for Enhancement Protocol | Use it as a pre-triage staging area |
| **Partially read `SESSION_BRANCH_STATE.md` and declare triage complete** | **Read the full file, verify total line count, declare entry count before first route decision** |
| **Delete `SESSION_BRANCH_STATE.md` before all entries are processed** | **Deletion is the final act — tick all checkboxes first** |

---

*Axis: Architecture / Governance | Layer: Session Orchestration | Revision: 2026-05-14 (Hardened: Ghost File Scan + Full Read Gate)*
