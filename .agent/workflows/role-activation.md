---
description: WFL-ROLE-001 Role Activation Workflow — interactive role selection with confidence scoring, role preview, and contract loading. Invoke before any role-specific execution to surface which role applies, confirm with the user, and announce the active role. Use when a task maps to a governed role (principal-architect, delivery-planner, safe-implementer, governance-reviewer, requirement-analyst, qa-agent, migration-agent, pr-release-agent) and you want explicit role selection rather than silent routing.
authority: CGA-001 §2.1 (Role Router)
phase: 4-active
---

# WFL-ROLE-001 — Role Activation Workflow

> **Purpose**: Make role selection explicit, observable, and confirmable — and prevent roles from activating without the domain knowledge their work depends on. Routes a user request to a governed role contract, checks that the preceding handoff exists, shows the user what the role will and will not do, and announces the active role before execution begins.

---

## Prerequisite chain (read this first)

| Role to activate | Consumes handoff | Realized as | Gate: must exist |
|---|---|---|---|
| principal-architect | session-handoff | (session context) | Always satisfiable — no file gate |
| requirement-analyst | session-handoff | (session context) | Always satisfiable — no file gate |
| delivery-planner | architecture-decision | `.agent/session/mode1-output.json` | Must exist |
| safe-implementer | phased-execution-plan | `.agent/session/mode2-output.json` | Must exist |
| migration-agent | phased-execution-plan | `.agent/session/mode2-output.json` | Must exist |
| qa-agent | implementation-evidence | `.agent/session/mode3-output.json` | Must exist |
| governance-reviewer | validation-report | `.agent/session/validation-report.json` | Must exist |
| pr-release-agent | governance-status | `.agent/session/governance-status.json` | Must exist |

---

## Step 5.4 — Plan-to-Execution Reconciliation Gate (PERG-001, ALWAYS runs before Step 5.5)

**Why this step exists**: See `.agent/patterns/plan-to-execution-reconciliation.md` (INC-088). In multi-step implementations, plans declared in `mode2-output.json` (`phased-execution-plan`) can shed steps during execution when tasks are renumbered or grouped. CCIG-001 (Step 5.5) verifies that *claimed* diffs are real, but cannot catch when an entire planned task is silently omitted from the execution table.

**Trigger**: Active role is completing implementation and preparing `mode3-output.json` (`implementation-evidence`).

**Before proceeding to Step 5.5**:
1. Extract all planned tasks from `mode2-output.json` (`phased-execution-plan.phases[].tasks[]`).
2. Verify that **100% of planned tasks** have a 1:1 mapped entry in `mode3-output.json` (`evidence_records[]`).
3. Every planned task must have an explicit terminal status:
   - `[EXECUTED: <file>:<line-range>]` — diff verified via `git diff`.
   - `[EXPLICITLY_DEFERRED: <reason>]` — approved by user or declared out of scope.
   - `[BLOCKED: <blocker-id>]` — documented with blocker reference.
4. **Enforcement**: If any planned task is missing or omitted, the agent is **BLOCKED** from emitting `status: "ready"` or declaring completion.

---

## Step 5.5 — Completion Claim Audit (CCIG-001 enforcement, ALWAYS runs before Step 6)

**Why this step exists**: A session can claim "✅ Completed & Verified" while zero corresponding files were ever touched. This step makes diff verification load-bearing at the workflow level for **every** role. See INC-086.

**Trigger**: Any point where the active role is about to use words like *resolved, fixed, closed, done, complete, completed, implemented, verified*.

**Before printing that claim**, for every item being marked complete:
1. Identify the file(s) the claim says were changed.
2. Run `git diff --stat -- <file>` (or `git status --short -- <file>` for a new file) for each one.
3. Classify per item:
   - **Diff exists and is non-trivial** → `[FIXED: <file>:<line-range> — <one-line description>]`.
   - **Diff is empty** → `[OUTSTANDING: <file> — no changes found]`.
   - **Partial changes** → `[PARTIAL: <what changed>] / [OUTSTANDING: <what didn't>]`.
4. If the claim is about behavior, trace the actual runtime path (IVP-001 Level 1/2) rather than trusting that diff presence implies functional correctness.
5. Print the audited claims as the actual completion table/summary.

---

## Step 5.6 — Blast-Radius Regression Gate (shared/registry file protection, ALWAYS runs before Step 6)

**Why this step exists**: Step 5.5 catches a session claiming something with no diff. Step 5.6 catches a session telling the truth about one thing while silently breaking an adjacent registry entry in the same file (INC-087).

**Trigger**: Diff touches any file on the **shared/registry file list** below or matches removed map-key patterns.

**Shared/registry files for Sree_Krushna** (seed list):
- `backend/src/02_Router.js` / `*Router.js` (Route registries)
- `backend/src/00_Config.js` (Global & location configuration maps)
- `.agent/skill-router.yaml`

**Before finalizing implementation-evidence, for every triggered file**:
1. Run the file's dedicated regression test or diff the registry keys before and after the edit.
2. Any key present before and absent after without explicit scoping is a **blocking finding**.
3. Record the result in `invariants_checksheet.patterns_checked`.

---

## Step 5.7 — Consumer-Path Integration Verification Standard (CPIV-001, ALWAYS runs before Step 6)

**Why this step exists**: See `.agent/patterns/consumer-path-integration-verification.md` (INC-088). In multi-tier data pipelines, verifying a pure leaf function in an isolated unit test gives a false sense of security while intermediary bottlenecks silently truncate data.

**Trigger**: Implementation modifies or adds fields across a multi-tier pipeline.

**Verification Standard**:
1. Leaf unit tests alone are **INSUFFICIENT** to claim verification.
2. Verification scripts must assert the ingestion/range bottleneck.
3. Trace or mock the consumer path from raw store retrieval to final component consumption.

---

## Step 5.8 — 3-Way Schema Alignment Preflight (TSAP-001, for all Schema modifications)

**Why this step exists**: See `.agent/patterns/three-way-schema-alignment.md` (INC-088). Local code arrays can drift from canonical documentation, causing field counts to be wrong from the start.

**Preflight Rule**:
Before modifying, adding, or indexing fields/columns:
1. Execute a 3-Way Comparison between Canonical SSOT Documentation, Code Schema/Header Registry, and Ingestion Configuration.
2. Invariant: `len(SSOT_Doc) == len(Code_Registry) == Ingestion_Total_Width`.
3. Resolve any existing mismatch *before* calculating new field indices or offsets.

---

## Step 6 — Transition proposal (emit handoff, propose next role)

This step runs **at the end of role execution**, not at the start, and only after Steps 5.4 through 5.8 have been applied. When the active role has completed its work and is ready to emit its handoff artifact, it prints this block before stopping.
