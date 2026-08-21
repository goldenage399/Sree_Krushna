---
description: COS Orchestrator (DEEP PATH ONLY since 2026-06-10) — full mode state machine for ≥3-surface tasks, active incidents, or god-node refactors. Default route is .agent/PREFLIGHT.md + npm run preflight.
rrm001_profile: architecture-review
handoff_bindings:
  # Phase 3 — Typed Handoff Consolidation: mode output files are instances of these shapes
  mode1_output: architecture-decision   # .agent/handoffs/architecture-decision.schema.yaml
  mode2_output: phased-execution-plan   # .agent/handoffs/phased-execution-plan.schema.yaml
  mode3_output: implementation-evidence # .agent/handoffs/implementation-evidence.schema.yaml
---

# COS Orchestrator Skill

> [!IMPORTANT]
> **DEMOTED TO DEEP PATH (2026-06-10)** — This state machine is no longer the default route. For single- and dual-surface tasks use `.agent/PREFLIGHT.md` (one-page routing table) + `npm run preflight` (mechanical signal scan), entered via `.agent/workflows/cos-invoke.md`. Invoke this skill **only** for: (1) tasks spanning ≥3 surfaces simultaneously, (2) active `INC-XXX` incidents, or (3) god-node structural refactors (>800 lines AND >10 consumers per `npm run impact`).
> **Why**: Mode choreography relied on agent self-compliance with no enforcement plane or telemetry; the risk signals (P11/P68/P-SVC) are now mechanically enforced by `scripts/preflight-gate.cjs`. Evidence: `memory/decisions.md` 2026-06-10, INC-005 registry collisions.

> **System**: Cognitive Orchestration System (COS) | **Legacy title**: Interactive Session Orchestrator Skill
> **Triggers (deep path only)**: `"run full COS"` | `"orchestrate multi-surface task"`
> **Purpose**: Deep-path coordinator for multi-surface session lifecycles, maintaining serialization and executing risk-driven Mode routing.

---

## 1. Quick Start

### Execution Invocation
When the user triggers one of the registration prompts, the orchestrator warm-starts the context and executes the core routing state machine.

```bash
# Triggers the session Warm Start and risk-signal scanner
route this intent
```

---

## 2. Orchestration State Machine & Sections

### 2.1 SECTION: SESSION START (Warm Start & Risk Assessment)

#### 2.1.1 State Initialization
Upon starting, the orchestrator initializes the session governance state schema:
```json
{
  "current_phase": "Start",
  "current_mode": "None",
  "risk_signals": {
    "P11": false,
    "P68": false,
    "P65": false,
    "cross_repo": false,
    "active_incident": false
  },
  "active_surfaces": {
    "UI": false,
    "DB": false,
    "Reactive": false,
    "Service": false,
    "Module": false,
    "Doc": false,
    "Governance": false
  },
  "blast_radius_scope": {
    "UI": false,
    "DB": false,
    "Reactive": false,
    "Service": false,
    "Module": false,
    "Doc": false
  }
}
```

#### 2.1.2 Always-On Audits
*   **Memory Load**: Automatically invoke `memory-session-loader` to restore recent decisions, validation metrics, and T1-T4 verification debt.
*   **Incident Filter**: Execute standard keyword scan across repository logs for outstanding `INC-XXX` issues or active outages.

#### 2.1.3 Risk Signal Extraction
Run a fast heuristic scan across target files in the current workspace context:
1.  **P11 Check**: Do target files exceed 600 lines?
2.  **P68 Check**: Does the intent request Firestore query/collection modifications?
3.  **P65 Check**: Does the change touch shared state contexts, Positional Profiles, or user assignments?
4.  **Cross-Repo Sync**: Does the change affect files tracked in Capsicum or PIOperationsMgmt_Firebase?
5.  **Outage Scan**: Are there open active incidents matching the keywords?
6.  **P-SVC Check**: Does the intent target any file under `src/services/`, `src/hooks/`, or `src/contexts/`? Fires regardless of file size — service-layer and shared-context files carry implicit blast radius.

#### 2.1.4 Routing Branch Decision
*   **Lightweight Path**: If **none** of P11, P68, P65, Cross-Repo Sync, Outage, or P-SVC signals are detected, the system bypasses interactive mode routing entirely.
    *   *Action*: Route straight to **MODE 2** (Implementation) under mechanical constraints.
    *   *Blast Radius Scope*: Initialized as all-false.
*   **Standard Governed Path**: If **ANY** risk signal is detected, the system transitions to the **Routing Phase** and presents Flow 1.

---

### 2.2 SECTION: ROUTING PHASE (Surface Interrogation)

#### 2.2.1 Interactive Flow 1 Question
The orchestrator presents the user with Flow 1 to determine the primary target surface:
> 💬 **"What are you about to touch?"**
> 1.  `UI only`
> 2.  `Data`
> 3.  `Shared state`
> 4.  `Service`
> 5.  `Mixed`
> 6.  `Not sure`

#### 2.2.2 Fallback Surface Translation
The system evaluates the response against the canonical defaults:

*   **`UI only`** → Route to **MODE 2** (Implementation).
    *   *Blast Radius*: Set default `{UI: true, DB: false, Reactive: false, Service: false, Module: false, Doc: false}`.
*   **`Data`** → Route to **MODE 1** (Topology).
    *   *Blast Radius*: Set default `{UI: false, DB: true, Reactive: true, Service: false, Module: true, Doc: false}`.
*   **`Shared state`** → Apply the **IS-002 Decision Rule**:
    *   *Rule*: If **P11** also fires (target file >600 lines or acts as a god-node structure) → Route to **MODE 5** (Safe Refactor); if **P65**-only (no P11 trigger) → Route to **MODE 1** (Topology).
*   **`Service`** → Route to **MODE 1** (Topology).
    *   *Blast Radius*: Set default `{UI: false, DB: false, Reactive: false, Service: true, Module: true, Doc: false}`.
*   **`Mixed`** → Route to **MODE 1** (Topology) conservatively.
*   **`Not sure`** → Present follow-up interrogation:
    *   *Question*: *"Does the change touch Firestore or a shared state setter?"*
        *   **Yes** → Route to **MODE 1** (Topology).
        *   **No** → Route to **MODE 2** (Implementation).

#### 2.2.3 State Persistence
Commit selections to `SESSION_STATE.active_surfaces` and transition `SESSION_STATE.current_mode` accordingly.

---

### 2.3 SECTION: EXECUTION (Bound Mode Workflows)

#### 2.3.0 Dispatcher Model (ENH-INFRA-072)

> **The orchestrator is a dispatcher, not a shape-shifting executor.**
>
> Each COS mode is a conceptual tool the **host** invokes — not a role the agent assumes inside a running turn. The orchestrator selects which tool applies (using §2.2 routing and the COS Intent-Signal Routing Table), ends its turn after producing the required output artifact, and waits. The host validates the artifact via `verify-mode-transition.sh` before initiating the next tool invocation.
>
> **Binding table**: See [COS-TOOL-BINDINGS.md](../../../User_Created/Discussion%20Threads/260522-Interactive%20Mode%E2%80%91Based%20Governance%20System/COS-TOOL-BINDINGS.md) — the SSOT for mode→conceptual-tool mapping. This SKILL.md does not re-encode the bindings.
>
> **Turn-end requirement**: After writing any `mode<N>-output.json`, the orchestrator MUST end its turn with the handover prompt format defined in COS-TOOL-BINDINGS.md §2.2. A turn that ends with prose ("MODE 1 is complete") without the structured handover prompt does not satisfy this requirement.

#### 2.3.0.1 Mode Boundary JSON Contract Validation (ENH-INFRA-071 Phase 0 — Golden Path)

> [!CAUTION]
> **Non-bypassable schema validation.** Before any mode transition, the orchestrator MUST validate that the predecessor mode's output JSON exists at `.agent/session/mode<N>-output.json` and that all required keys are present and correctly typed. Self-certification ("I ran MODE 1") is structurally insufficient — a prose declaration is not a contract file.

**Session artifact directory**: `.agent/session/` — all mode output files are written here.

**Halt format** (used whenever validation fails — execution MUST stop, not warn):

    CONTRACT VIOLATION: mode<N>-output.json [absent | invalid].
    Required by: MODE <N+1> entry [or GovernanceActivation].
    Failed to produce: <mode name> (MODE <N>).
    Action: Complete MODE <N> and write .agent/session/mode<N>-output.json before continuing.

**Golden path checks (MODE 1 → MODE 2 → MODE 3 → GovernanceActivation):**

**MODE 1 exit — checked before MODE 2 may begin**:
- `.agent/session/mode1-output.json` exists and is valid JSON
- `blast_radius_scope` key is present
- At least one field in `blast_radius_scope` is `true`
- If any check fails → halt with CONTRACT VIOLATION; do not allow code edits to begin

**MODE 2 entry gate** (enforced before any file edit):
- Read `.agent/session/mode1-output.json`; confirm `blast_radius_scope` is consumed as boundary constraints
- If `mode1-output.json` is absent → halt ("mode1-output.json absent — MODE 2 entry blocked")
- If `blast_radius_scope` has all fields `false` → halt ("MODE 1 incomplete — no surface was scoped")
- Exception: lightweight path (no risk signals, UI-only) bypasses this gate and injects the UI-only default `blast_radius_scope` directly

**MODE 2 exit — checked before MODE 3 may begin**:
- `.agent/session/mode2-output.json` exists and is valid JSON
- `git_diff_status` key present (accepted values: `"non_empty"`, `"none"`)
- `scope_violations` array present and is empty
- If any check fails → halt; do not invoke `cos-integration-verifier`

**MODE 3 exit — checked before GovernanceActivation may fire**:
- `.agent/session/mode3-output.json` exists and is valid JSON
- All 6 required fields present:
  - `p18_trace` — array with length ≥ 6
  - `t2_result` — non-empty string
  - `t3_result` — non-empty string
  - `verdict` — exactly `"PASS"` or `"FAIL"`
  - `stdout_citation` — non-empty string (actual command output excerpt, not a prose summary)
  - `exit_code` — integer
- If any field is absent, wrong type, or `p18_trace` length < 6 → halt GovernanceActivation; list every failing check in the CONTRACT VIOLATION message

**Prohibited self-certification forms (both invalid)**:
- ❌ Writing `✅ blast_radius_scope: {UI: true}` in markdown and proceeding to MODE 2
- ❌ Writing "verified" in prose in place of `mode3-output.json` containing all 6 required fields

**Mode transition logging** (append one line per boundary to `.agent/logs/cos-sessions.log`):

    {"timestamp": "<ISO-8601>", "mode": "MODE_<N>", "passed": true|false, "reason_if_false": "<string or null>"}

---

#### 2.3.1 Mode Dispatch
During implementation, the developer expresses their current scoped intent. The orchestrator maps the intent using `.agent/cos-intent-signal-routing-table.md` and proposes 2-4 appropriate action options.

#### 2.3.1.5 BLOCKING GATE: Zero-Trust Baseline Scrubbing (P04/P31 Enforcement)

> [!CAUTION]
> **This gate is non-bypassable.** The orchestrator MUST NOT emit any plan, proposal, or enhancement list until this section has been physically completed and its output block is present in the response. A plan without a preceding As-Is Baseline block is invalid and must be rejected.

**Procedure** (applies to every planning or proposal task):

1. **Identify the primary component(s) in scope** from the developer's stated intent.
2. **Read the imports** of the primary component to enumerate all child components, hooks, and services.
3. **View the state/logic definitions** of each imported file (headers + relevant sections). Do not rely on documentation or prior knowledge — physically open each file.
4. **Search for the proposed capability** by name and by function across `src/` using grep before assuming it is absent.
5. **Emit the As-Is Baseline block** (format below) as the first substantive output of the session. This block MUST appear BEFORE any proposal.

**Required As-Is Baseline Output Format**:

```markdown
## As-Is Baseline Audit — [Component/Feature in Scope]

| File | Lines Inspected | Relevant Existing Logic | Status |
|------|----------------|------------------------|--------|
| `ComponentName.jsx` | L{start}-{end} | [Brief description of what already exists] | LIVE / ABSENT |
| `ContextName.jsx` | L{start}-{end} | [State field or function that exists] | LIVE / ABSENT |

### Capability Existence Check
- Proposed: [Enhancement #N — description]
- Verdict: ALREADY IMPLEMENTED → DROP | NOT FOUND → PROCEED | PARTIALLY IMPLEMENTED → EXTEND ONLY
```

**Failure Mode (what this gate prevents)**: An agent reads only the top-level orchestration component (`CompactTaskCreationView.jsx`) and proposes building a workload warning system that already exists fully implemented in the child step (`AssignmentStep.jsx` L145–244). The plan is generated without reading the child file. The proposal is published. Zero code is written but the agent's credibility and one full session are wasted. This gate makes that impossible.

#### 2.3.2 Blast Radius Propagation & Governance Bundle Selection

*   If entering **MODE 1** (Topology) or **MODE 5** (Safe Refactor):
    *   Run semantic blast radius analysis using `graphify` and `change-impact-analysis.md`.
    *   Populate `SESSION_STATE.blast_radius_scope`.
    *   **CRITICAL CONSTRAINT**: Pass the calculated `blast_radius_scope` as hard boundary constraints to **MODE 2** (Implementation) before code modification starts.
    *   **Plan Review Gate**: If `blast_radius_scope` includes `{DB: true}` or `{Service: true}`, the `plan-review` workflow **MUST** be completed before transitioning to MODE 2. A plan that has not passed `plan-review` (including its As-Is Baseline Audit and Decision Gate) is not approved for execution. This converts plan review from opt-in to mandatory for any data or service layer change.
*   If entering **MODE 2** (Implementation) directly (UI-only route):
    *   Enforce UI-only `blast_radius_scope` default: `{UI: true, rest: false}`.
    *   **CRITICAL CONSTRAINT**: MODE 2 must check `blast_radius_scope` bounds before writing any code.

#### 2.3.2.1 Governance Bundle Selection Logic
At MODE 2 entry, the orchestrator dynamically computes `bundles_active` by checking `blast_radius_scope` and active `risk_signals` against the mapping registry in [COS-BUNDLES.md](file:///d:/GitHub_Repo/Task-Dashboard/docs/ssot/architecture-hub/COS-BUNDLES.md):

*   **`bundle.arch_execution`**: Triggered if `blast_radius_scope.Module == true` OR risk signal `P11` is active.
*   **`bundle.data_execution`**: Triggered if `blast_radius_scope.DB == true` OR any of `P68`, `P65`, or `P-SVC` signals are active.
*   **`bundle.ui_execution`**: Triggered if `blast_radius_scope.UI == true` OR `active_surfaces.UI == true`.
*   **`bundle.maintenance_execution`**: Triggered if `active_surfaces.Governance == true` and no code surfaces are active.

#### 2.3.2.2 Cross-Bundle Sequencing & Execution Protocol
Based on the computed `bundles_active` count, the orchestrator enforces one of three routes:

1.  **Single Bundle Active (Count = 1)**:
    *   Executes a single standard `MODE 2` turn.
    *   Produces `mode2-output.json` directly.
2.  **Multiple Bundles Active (Count = 2)**:
    *   Executes sequenced per-bundle invocations of the `cos.impl.execute` tool, ordered strictly by dependency:
        1. `bundle.arch_execution`
        2. `bundle.data_execution`
        3. `bundle.ui_execution`
    *   Each step is a separate invocation with fresh context. The agent holds only one bundle's governance frame at a time.
    *   Writes a bundle-specific file at each step (e.g. `mode2-bundle-data-output.json`), which must be verified by `verify-mode-transition.sh` before loading the next bundle.
    *   **Scope Freeze**: Once a bundle output is verified, its decisions are frozen. If a later bundle stage reveals a prior conflict, execution must halt, re-entering `MODE 1` to adjust boundaries and restart.
    *   Upon successful sequence completion, the orchestrator synthesizes individual outputs into the final unified `mode2-output.json`.
3.  **Decomposition Trigger (Count ≥ 3)**:
    *   **HALT** direct MODE 2 entry. Automatically trigger `MODE 5` (Safe Refactor Specialist) to evaluate whether the task should be decomposed into independent implementation cycles.
    *   Proceed only after MODE 5 produces an approved extraction plan (either splitting the task or documenting a coupling justification to proceed as sequenced).


#### 2.3.3 MANDATORY: MODE 3 Verification Trigger (Post-Implementation Gate)

> [!CAUTION]
> **Non-bypassable after any MODE 2 or MODE 5 execution.** Once all file edits are complete, route to MODE 3 (Verification) before GovernanceActivation fires. The sequence is: MODE 2/5 → MODE 3 → GovernanceActivation. Skipping MODE 3 means PIRR runs against unverified code.

*   **Scope**: Any session where `git diff` is non-empty after MODE 2 or MODE 5 execution.
*   **Action**: Invoke the `cos-integration-verifier` skill. The Verifier completes Phase 1 (P18 Integration Audit) and Phase 2 (T2/T3 Code Verification) before the session may advance to GovernanceActivation.
*   **Evidence requirement**: The `cos-integration-verifier` skill must write `.agent/session/mode3-output.json` with all 6 required fields (`p18_trace`, `t2_result`, `t3_result`, `verdict`, `stdout_citation`, `exit_code`). The Verifier Gate Report block in the session output is a human-readable companion; the JSON file is the machine-validated artifact. GovernanceActivation performs the §2.3.0.1 MODE 3 exit check against this file — a session output block without the JSON file does not satisfy this requirement.
*   **Exception**: MODE 4 (Reconciliation) and SURF6 (governance-only) sessions bypass MODE 3 — no functional code was written.

---

#### 2.3.4 Mode Boundary Contracts — Golden Path (ENH-INFRA-071 Phase 1)

Formal Input Contract / Exit Contract / Verify-Before-Transition blocks for MODE 1 → MODE 2 → MODE 3. Each block names the required JSON artifact. The §2.3.0.1 schema validation enforces these contracts mechanically — the blocks below define what that validation is checking against.

---

##### MODE 1 — COS Topology Specialist

**Input Contract** (cannot start without):
- [ ] `SESSION_GOVERNANCE_STATE.json` present in `.agent/session/` with `risk_signals` populated
- [ ] Flow-1 surface answer received from developer (§2.2.1)
- [ ] `current_phase` set to `"Routing"` in session state

**Exit Contract** (cannot declare MODE 1 complete without):
- [ ] `.agent/session/mode1-output.json` written with all required keys:
  - `blast_radius_scope` — object; at least one field `true`
  - `bounded_contract.impacted_surfaces` — array; non-empty
  - `bundles_candidate` — array (may be empty if surfaces resolve to a single bundle)
- [ ] Blast radius scope communicated to orchestrator as input constraint for MODE 2

**Verify-Before-Transition** (MODE 1 → MODE 2):
Orchestrator reads `.agent/session/mode1-output.json` and confirms `blast_radius_scope` has at least one `true` field before MODE 2 begins. If the file is absent or the check fails → CONTRACT VIOLATION halt (§2.3.0.1). A prose statement that MODE 1 is complete does not satisfy this requirement.

**Turn-End Handover Prompt** (required after writing `mode1-output.json`):
```
cos.topology.analyze complete.
Output: .agent/session/mode1-output.json
Run: .agent/bin/aos-next.sh .agent/session/mode1-output.json
Ready for: cos.impl.execute — inject mode1-output.json as input context in the next invocation.
```

---

##### MODE 2 — COS Implementation Executor

**Input Contract** (cannot start without):
- [ ] `.agent/session/mode1-output.json` present and validated (§2.3.0.1 MODE 1 exit check passed)
- [ ] `blast_radius_scope` consumed from `mode1-output.json` as declared boundary constraints — **this is the MODE 1 handoff**; MODE 2 MUST NOT begin code edits without it
- [ ] Exception: lightweight UI-only path — orchestrator injects UI-only default `blast_radius_scope` directly; `mode1-output.json` not required on this path only

**Exit Contract** (cannot declare MODE 2 complete without):
- [ ] `.agent/session/mode2-output.json` written with all required keys:
  - `bundles_active` — array
  - `git_diff_status` — `"non_empty"` or `"none"`
  - `scope_violations` — empty array
- [ ] All changed files confined to surfaces declared in `blast_radius_scope` (scope boundary compliance)
- [ ] Per-bundle checklist fields present and `true` for each active bundle (see §2.3.2.2)

**Verify-Before-Transition** (MODE 2 → MODE 3):
Orchestrator checks `.agent/session/mode2-output.json` exists, `git_diff_status` is present, and `scope_violations` is empty before invoking `cos-integration-verifier`. If `scope_violations` is non-empty → halt; resolve scope violations before handing to MODE 3.

**Turn-End Handover Prompt** (required after writing `mode2-output.json` or the final bundle file):
```
cos.impl.execute [<bundle_name>] complete.
Output: .agent/session/mode2-output.json   (or mode2-bundle-<name>-output.json)
Run: .agent/bin/aos-next.sh .agent/session/mode2-output.json
Ready for: cos.verify.integration — inject mode2-output.json as input context in the next invocation.
```

---

##### MODE 3 — COS Integration Verifier

**Input Contract** (cannot start without):
- [ ] `.agent/session/mode2-output.json` present (§2.3.0.1 MODE 2 exit check passed)
- [ ] `git_diff_status: "non_empty"` — if `"none"`, MODE 3 is skipped (no code written, nothing to verify)

**Exit Contract** (cannot declare MODE 3 complete without):
- [ ] `.agent/session/mode3-output.json` written by `cos-integration-verifier` with all 6 required fields:
  - `p18_trace` — array; length ≥ 6
  - `t2_result` — non-empty string
  - `t3_result` — non-empty string
  - `verdict` — exactly `"PASS"` or `"FAIL"`
  - `stdout_citation` — non-empty string (actual command output excerpt, not a summary)
  - `exit_code` — integer
- [ ] Verifier Gate Report block present in session output as human-readable companion

**Verify-Before-Transition** (MODE 3 → GovernanceActivation):
GovernanceActivation gate (§2.4.0) reads `mode3-output.json`, validates all 6 fields, and confirms `verdict` is `"PASS"`. A `"FAIL"` verdict blocks GovernanceActivation and routes back to MODE 3 for remediation. The Verifier Gate Report session block is not sufficient alone — the JSON file must exist and pass schema validation.

**Turn-End Handover Prompt** (required after writing `mode3-output.json`):
```
cos.verify.integration complete.
Output: .agent/session/mode3-output.json
Verdict: PASS | FAIL
Run: .agent/bin/aos-next.sh .agent/session/mode3-output.json
Ready for: GovernanceActivation (PIRR) — verdict must be PASS.
```

---

##### MODE 4 — COS Reconciliation Coordinator ⚠️ Contract Alignment Pending

Input contract alignment status: ⚠️ — No dedicated `cos-reconciliation-coordinator` skill file exists yet; MODE 4 is currently implemented as inline routing logic in §2.4.3. The Role-Contract Alignment Table (ENH-INFRA-071 §4) identifies `drift_type` field in session state as the expected input — this must be formally verified before the Lineage Record §6 row can flip to ✅. Do not mark MODE 4 contracts as aligned until a dedicated skill or this orchestrator section is updated with a verified input declaration.

##### MODE 5 — COS Safe Refactor Specialist ⚠️ Phase 3

Exit contract defined in ENH-INFRA-071 Phase 3: extraction plan document with sections for impacted modules, `blast_radius_scope` output, and Retirement Evaluation (Condition A + B) result. Handoff to MODE 2 uses the same contract as MODE 1.

---

### 2.4 SECTION: GOVERNANCE ACTIVATION (Checklist & Drift Scan)

#### 2.4.0 BLOCKING GATE: MODE 3 Contract Pre-Check

> [!CAUTION]
> **GovernanceActivation cannot fire until this check passes.** Before launching the PIRR checklist, the orchestrator validates `.agent/session/mode3-output.json` using the §2.3.0.1 MODE 3 exit check. If the file is absent or any required field fails validation, halt with CONTRACT VIOLATION and return to MODE 3. Do not run PIRR against unverified code.

Steps:
1. Check `.agent/session/mode3-output.json` exists and is valid JSON
2. Validate all 6 required fields per §2.3.0.1 MODE 3 exit rules
3. Confirm `verdict` is `"PASS"` — if `"FAIL"`, halt GovernanceActivation; route back to MODE 3 for remediation
4. If all checks pass → proceed to §2.4.1

Exception: MODE 4 and SURF6 sessions bypass this gate (no mode3-output.json is produced in those paths).

#### 2.4.1 Unconditional PIRR
Once code modification is complete and the §2.4.0 pre-check has passed, the PIRR verification sequence fires **unconditionally** (since code was changed).
*   *Workflow*: Launch `pirr-compliance-checklist` (the 19-category compliance check).

#### 2.4.2 Retirement Evaluation Check
During GovernanceActivation, evaluate Condition A and Condition B:
*   **Condition A**: Does the component appear in $\ge 3$ incident logs inside `docs/PIRR_RECONCILIATION_LOG.md`?
    *   *Check*: `Select-String -Path "docs/PIRR_RECONCILIATION_LOG.md" -Pattern "component_name" | Measure-Object`
*   **Condition B**: Does the file size exceed 600 lines after refactoring?
    *   *Check*: Run structural scans via `npm run sg:scan`.
*   *Action*: If **EITHER** condition is met, flag the component for retirement, escalate to the orchestrator, and transition directly to session closeout. **Do not loop back through execution.**

#### 2.4.3 Drift Routing
Present the drift interrogation:
> 💬 **"I detected these drift signals: [list]. Which additional branches should be reconciled?"**
> *   `SSOT/doc updates`
> *   `SAP propagation`
> *   `Incident governance`
> *   `None (PIRR only)`

Drift routing binds to:
1.  **Topology/Contract Drift** → Route to **MODE 4** (Reconciliation) via `ssot-reconciliation.md`.
2.  **SAP-tracked modifications** → Trigger `sap-sync.md`.
3.  **Documentation surface drift** → Trigger `writing-technical-documentation`.
4.  **New systemic failure** → Trigger `post-incident-governance.md`.

---

### 2.5 SECTION: MODE 4 RECONCILIATION — PIRR ADDENDA NOTE

> [!IMPORTANT]
> **MODE 4 writes PIRR LOG ADDENDA only.**
> *   The initial PIRR log entry is written unconditionally during **GovernanceActivation** *before* the host invokes `cos.reconcile.drift` (MODE 4).
> *   MODE 4 is only reached when architectural, contract, or documentation drift is detected.
> *   *Constraint*: MODE 4 must append a supplemental drift reconciliation record to the existing log entry. Do not re-create the original PIRR entry inside MODE 4.

---

### 2.6 SECTION: GOVERNANCE SURFACE BYPASS (SURF6)

When the active surface is determined to be **Governance** only (e.g. editing files inside `.agent/`, editing protocols, or updating SSOT documentation):
*   **Action**: Bypasses execution Modes 1, 2, and 3 completely (since no functional code is written).
*   **Routing**: Transitions directly to **MODE 4 (Reconciliation)**.
*   **Constraint**: Bypasses the `GovernanceActivation` phase entirely. Do not fire the code-based PIRR compliance checklist.

#### 2.6.1 SURF6 Cross-Consistency Gate (Governance Self-Consistency Check)

> [!IMPORTANT]
> SURF6 bypasses PIRR for good reason — governance changes are not functional code. But they can still introduce internal inconsistencies between governance documents. This gate replaces PIRR for SURF6 sessions.

Before committing any `.agent/` governance file changes, apply the following targeted checks:

1.  **If `cos-intent-signal-routing-table.md` modified**: All `resulting_mode` values must match the mode identifiers used in §2.3–2.6 of this skill (`MODE 1`, `MODE 2`, `MODE 4`, `MODE 5`).
2.  **If this `SKILL.md` modified**: All referenced workflow file paths (`.md` links in §2.3–2.6) must physically exist — run `Test-Path` on each.
3.  **If `plan-review.md` modified**: The As-Is Baseline table schema in `plan-review.md` must be identical to the format defined in §2.3.1.5 of this skill (same column headers, same Verdict line format).
4.  **If `aos-session-open.md` or `aos-session-close.md` modified**: The Quick Reference Checklists at the end of each file must contain entries for every step defined above them in the body.
5.  **If `aos-session-open.md` modified**: It **MUST NOT** make `cos-orchestrator` or surface interrogation an unconditional step during platform boot. The session warm-start (`aos-session-open.md`) and task intent routing (`cos-orchestrator`) **MUST** remain separate by design to prevent premature user prompting and maintain strict decoupling.

**Required output before committing governance changes**:
> `SURF6 Consistency: VERIFIED — [files checked] — [YYYY-MM-DD]`

If any inconsistency is found: **HALT commit and reconcile before proceeding.**

---

### 2.7 SECTION: SERIALIZATION CONTRACT

*   **Target File**: All governance state shifts must be serialized directly to `.agent/session/SESSION_GOVERNANCE_STATE.json`.
*   **Prohibition**: **NEVER** serialize or write interactive governance session states to `.agent/workflows/SESSION_BRANCH_STATE.md` (which is strictly for branching/incident details).
*   **Tear-Down Sequence**: At session closeout, the agent must:
    1.  Serialize and sync `SESSION_GOVERNANCE_STATE.json` **FIRST**.
    2.  Execute branch context triage and incident logging **SECOND**.

---

## 3. Related Resources

*   [COS Tool Bindings](../../../User_Created/Discussion%20Threads/260522-Interactive%20Mode%E2%80%91Based%20Governance%20System/COS-TOOL-BINDINGS.md) — SSOT for mode→conceptual-tool mapping (ENH-INFRA-072)
*   [COS Intent-Signal Routing Table](../../cos-intent-signal-routing-table.md)
*   [Session State Spec](../../workflows/session-state-spec.md)
*   [COS Session State](../../../User_Created/Discussion%20Threads/260522-Interactive%20Mode%E2%80%91Based%20Governance%20System/COS-SESSION-STATE.md)
