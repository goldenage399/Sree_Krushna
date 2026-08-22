---
description: WFL-ROLE-001 Role Activation Workflow — interactive role selection with confidence scoring, role preview, and contract loading. Invoke before any role-specific execution to surface which role applies, confirm with the user, and announce the active role. Use when a task maps to a governed role (principal-architect, delivery-planner, safe-implementer, governance-reviewer, requirement-analyst, qa-agent, migration-agent, pr-release-agent) and you want explicit role selection rather than silent routing.
authority: CGA-001 §2.1 (Role Router)
phase: 4-active
---

# WFL-ROLE-001 — Role Activation Workflow

> **Purpose**: Make role selection explicit, observable, and confirmable — and prevent roles from activating without the domain knowledge their work depends on. Routes a user request to a governed role contract, checks that the preceding handoff exists, shows the user what the role will and will not do, and announces the active role before execution begins.

---

## Why the prerequisite check matters

Every role in the chain consumes the output of the previous role as its **domain knowledge transfer**. Safe-implementer consumes a phased-execution-plan that declares *which surfaces to touch* and *why*. Without it, implementation is blind to the existing architecture — the agent doesn't know the blast radius, doesn't know which constraints apply, doesn't know what surfaces the change affects.

A user saying "add search to tasks" looks like a safe-implementer trigger, but activating it directly means editing files with no surface map, no architectural analysis, and no scoped boundary. The handoff chain exists specifically to prevent this.

---

## Chain execution modes

The workflow supports three modes. Infer the mode from the original request; ask only when genuinely ambiguous.

| Request pattern | Mode | Behavior |
|---|---|---|
| "scope this" / "analyze only" / "just review" | **Single** | Run one role, stop, emit handoff, wait |
| "analyze and plan" / "scope then phase it" | **Two-role** | Chain stops after delivery-planner |
| "implement X" / "add X" / "build X" | **Full chain** | Propose each transition; user confirms each step |
| Ambiguous | Ask | "Should I just analyze, or run the full chain?" |

The mode determines whether the **transition proposal** (Step 6) auto-fires or stops.

---

## When to run this workflow

- Before any session that maps to a governed role
- When the task is ambiguous across two or more roles
- When the user says "which role handles this?" or "activate a role"
- When `skill-router.yaml` routing would be silent and the user deserves to know what's activating

You do not need to run this for trivial read-only questions or tasks clearly outside all eight roles.

---

## Prerequisite chain (read this first)

Before any activation logic, understand which handoffs each role depends on:

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

The **preceding role** that must run first if the gate file is missing:

| Missing gate file | Run this role first |
|---|---|
| `mode1-output.json` | principal-architect |
| `mode2-output.json` | delivery-planner (needs mode1 first) |
| `mode3-output.json` | safe-implementer or migration-agent |
| `validation-report.json` | qa-agent |
| `governance-status.json` | governance-reviewer |

---

## Step 1 — Score candidate roles

Read `.agent/skill-router.yaml` (the `roles:` section). For each role, count how many of its `triggers[]` phrases appear in the user's request (exact or close match).

**Confidence rules:**

| Match strength | Confidence | Behavior |
|---|---|---|
| 1+ exact trigger phrase present | ≥95% | Proceed to Step 1.5 (prerequisite check) |
| 2+ partial keyword overlaps | 80–94% | Proceed to Step 1.5, then confirm → Step 2 |
| 1 weak keyword overlap | 60–79% | Proceed to Step 1.5, then show candidates → Step 2b |
| No clear match | <60% | Tell user no role matched; ask them to describe the task differently |

A trigger phrase is a "close match" when it describes the core verb of the request even if worded differently (e.g., "redesign the data model" → close match for `architectural analysis`).

**If the request spans two sequential roles** (e.g., "analyze *and* plan this"): activate the first role now; note that the second activates after the first emits its handoff.

---

## Step 1.5 — Prerequisite check (ALWAYS runs before Step 2 or 3)

This is the gate that prevents blind activation.

For the top candidate role:

1. Look up its `consumes_handoff` from the prerequisite table above.
2. Check whether the gate file exists in `.agent/session/`.
3. Apply the rule:

**Gate PASSES** (file exists or role is principal-architect / requirement-analyst):
→ Verify handoff schema compliance: For `delivery-planner` activation, assert `.agent/session/mode1-output.json` contains all required 4-PPSD payload fields (`contract_write_sites_inspected`, `external_benchmarks_referenced`, `precedence_ladder`).
→ **Anti-Performative ADR & Gate Guard (PACT-002)**: Agents MUST NOT emit active role blocks or promote ADRs to `ACCEPTED` without physically creating the gate file (e.g. `.agent/session/mode1-output.json`) AND providing verifiable source code diffs in `src/`. See `.agent/patterns/verifiable-implementation-before-adr-promotion.md`.
→ Continue to Step 2 or Step 3 normally.

**Gate FAILS** (file missing or required schema fields absent):
→ Do NOT activate the candidate role. Show the gap instead:

```
⚠ Role gate: <Candidate Role> requires a <missing handoff shape or incomplete 4-PPSD fields>

This request needs earlier work first:

  Step 1  <Preceding Role>  — <what it does in one line>
          → emits: <handoff shape with complete 4-PPSD payload>

  Step 2  <Next role if any>  — ...

  Step 3  <Candidate Role>  — <what the user originally asked for>

Recommend starting with: <Preceding Role>

[Start with <Preceding Role>]
[Skip gate — I already have this context, load <Candidate Role> anyway]
```

**Skip gate** means the user is consciously bypassing the chain (e.g., they've done architecture in their head for a tiny change). Accept it — but record it:

```
⚠ Gate skipped by user. Activating <Candidate Role> without <missing handoff>.
Domain knowledge gap: blast radius, surface constraints, and architectural context
are the user's responsibility to provide during execution.
```

**Domain knowledge loading when principal-architect activates** (even when gate passes):

Principal-architect is the entry point for the chain. Before declaring scope or emitting architecture-decision, it must acquire domain knowledge:

```
Domain discovery (required before scope declaration):
  1. npm run check:freshness          — verify .cache/ maps are ≤7 days old
  2. npm run impact <affected file>   — blast radius + risk tier
  3. npm run query -- --component <name>   — dependency map if component-level
  4. Read relevant source files in declared scope (verify imports, dependencies, hooks, and interface capabilities physically rather than relying on historical plan files)
  4b. Write-Site Contract Verification — NEVER copy conventions from local read-side caller files. Trace and verify the actual write site (e.g. TaskUpdateService.js) and locked ADR/SSOT contracts physically. See .agent/patterns/write-site-contract-verification.md for ground-truth rules.
  4c. Intent Decoupling & Plan Hard-Stop — ensure clarified intent is not treated as execution authorization. See .agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md.
  5. Run npm run sg:scan              — check for existing architectural violations
  6. Execute SDP-001 check            — run proto-system-discovery and check constants/taxonomies to set Problem-Space Boundary (§6.1 & §6.3)
  6b. External Benchmark Research     — search web/standards for enterprise benchmarks (Linear, Jira, Asana, standard libs, web best practices) before creating new heuristics or domain abstractions (4-PPSD Phase 2)
  7. Route-to-Nav mapping            — if a new page route is declared in App.jsx or ProjectLayoutWrapper.jsx, search and verify that a corresponding sidebar entry exists in useNavigationItems.js, or add useNavigationItems.js to the blast radius.
  8. Auth-Source Verification        — if changes touch route guards, page access, or context-level authorization, verify that they consume normalized levels (from AuthContext) instead of raw Firestore document snapshots.
  9. Dead State & Interactive DOM Validation — if reviewing or analyzing a page component, trace all state variables and hooks (e.g., selectedUser, setSelectedUser) to verify they are connected to active DOM elements (buttons, inputs, selects). Identify any "paper variables" that lack interactive controls.
  10. Component-level Interface Check — verify if the backend service capabilities (e.g., fetching arbitrary user logs) match the logged-in user context or if they are exposed to the UI context.
  11. Short-Circuit QA Verification Path — if a structural gap or data defect is suspected, formulate the trace hypothesis and optionally trigger qa-agent execution immediately using mock datasets/scripts. The qa-agent may consume this architectural-decision directly to produce the validation-report, skipping the delivery/implementation loop.
  12. Auto-Council Trigger Check      — if the task spans ≥3 surfaces or touches a Known High-Risk Surface (firestore.rules, AuthContext.jsx, App.jsx, TaskCreationContext.jsx, CascadingVacancyService.js), automatically invoke architecture-council or ui-council review before emitting mode1-output.json.
```

The results of steps 1–12 become the `architectural_findings`, `contract_write_sites_inspected`, `external_benchmarks_referenced`, and `precedence_ladder` in the architecture-decision handoff. Without this discovery, downstream roles (delivery-planner, safe-implementer) have no domain context to work from.

---

## Step 1.6 — Conditional QA Gate (activated when Step 11 fires)

This step is the formal execution of Step 11. It wires qa-agent as a **conditional edge predicate** before delivery-planner — claims tagged `[UNVERIFIED]` by principal-architect-R08 are verified here before propagating into an implementation plan.

**Trigger** (any one suffices):
- `architectural_findings` contains any entry tagged `[UNVERIFIED]` (per principal-architect-R08 / IVP-001 Level 4–5)
- Original request type is gap-finding / audit / "identify defects" / "what's wrong"
- principal-architect-R07 trace plan was emitted

**When triggered**, print this block:

```
⚡ Step 1.6 — Conditional QA Gate

  Unverified claims pending verification:
    • [H-1] <claim>  — IVP-001 level: <L4/L5>  — Status: [UNVERIFIED]
    ...

  QA Agent activating (short-circuit, pre-delivery-planner)
  Input:  architecture-decision (mode1-output.json)
  Output: gap-verification-report attached to validation-report shape

  [Proceed with QA verification]   [Skip — accept claims as-is]   [Return to Architect]
```

**QA gap-verification-report** output fields (per qa-agent-R06 / IVP-001):
- `claim_id` — maps to `[H-X]` in architect's trace plan
- `verification_method` — IVP-001 phase applied
- `evidence_level` — IVP-001 L1–L5
- `verdict` — `verified` | `falsified` | `inconclusive` | `needs-runtime-evidence`
- `source` — exact file:line or log output that confirms/denies

**Routing after gate**:
- All `verified` → tag `[VERIFIED]` in mode1-output.json → continue to Step 2 / delivery-planner
- Any `falsified` → return to principal-architect to revise findings
- Any `inconclusive` → user decides: accept risk or provide runtime evidence before continuing

**If user selects [Skip]**: record in mode1-output.json:
```json
{ "qa_gate_1_6": "skipped_by_user", "unverified_claim_count": N, "accepted_risk": true }
```

**If this step was not triggered** (no unverified claims, non-audit request): proceed directly to Step 2.

---

## Step 2 — Confirm with user (80–94% confidence, gate passed)

```
Role Selection
──────────────────────────────────────────
Detected:   <one-line description of the request>

Recommended
  <Role Name> — <confidence>%
  <Why: 1–2 trigger phrases that matched>

WILL DO
  ✓ <R01 — plain language>
  ✓ <R02>
  ✓ <R03>

WILL NOT DO
  ✗ <what this role explicitly does not touch>
  ✗ <second boundary>

OUTPUTS
  → <emits_handoff> (.agent/handoffs/<shape>.schema.yaml)
  → consumed by: <next role in chain>

[Y] Activate   [N] Cancel   [?] Show all roles
──────────────────────────────────────────
```

Fill WILL DO from `responsibilities[]` in the role contract. Fill WILL NOT DO from what the adjacent roles do that this role must not touch (principal-architect: no src/ writes; safe-implementer: no git push; governance-reviewer: no files outside `.agent/session/`).

If the user replies **[?]**, show the Step 2b picker.

---

## Step 2b — Manual picker (< 80% confidence or user requested)

```
Role Picker
──────────────────────────────────────────
  1  Principal Architect    — architecture analysis, scope, blast radius
  2  Delivery Planner       — phased plan, validation gates, sequencing
  3  Safe Implementer       — scoped file edits, implementation
  4  Governance Reviewer    — PIRR compliance, merge gate
  5  Requirement Analyst    — PRD, acceptance criteria, feature spec
  6  QA Agent               — integration verify, acceptance check
  7  Migration Agent        — schema/data migration, Firestore rules
  8  PR / Release Agent     — commit, PR creation, git push

Enter number or describe the task differently:
──────────────────────────────────────────
```

After selection, run Step 1.5 for the chosen role before proceeding.

---

## Step 3 — Auto-activate (≥95% confidence, gate passed)

No confirmation prompt. Announce immediately:

```
▶ Role activated: <Role Name>
  Contract:  <.agent/roles/<id>.yaml>
  Consumes:  <consumed handoff> ✓ (found: .agent/session/<file>)
  Handoff:   <emits_handoff>
  Review:    <review_configuration> (RRM-001 profile)
```

The user can say "switch role" or "cancel role" at any time.

---

## Step 4 — Load role contract and policies

After activation:

1. **Read the role contract** at `contract` path from skill-router.yaml.
2. **Note `policy_refs[]`**: policy IDs bound to this role. Apply their constraints from memory (e.g., CAP-WRITE-001 means edits stay within `blast_radius_scope`). Read the policy file only if a specific constraint is unclear.
3. **Note `review_configuration`**: RRM-001 profile to apply at session close.
4. **Note `emits_handoff`**: the schema this role must emit when work is done.

Do not load `wraps_skill` until execution begins. This step is governance loading only.

---

## Step 5 — Load skill, then announce and begin

**Before printing the activation block**, read the `wraps_skill` file declared in the role contract. This is mandatory — not optional and not deferrable to "when you need it." The skill file contains the execution instructions this role runs under; reading it after announcing is too late because the agent may already be generating output from generic defaults.

```
# Mandatory — run this before printing the block below
READ: <contract.wraps_skill path>   # e.g. .agent/skills/writing-plans/SKILL.md
```

Then announce:

```
══════════════════════════════════════════
ACTIVE ROLE: <Role Name>
══════════════════════════════════════════
Skill loaded: <wraps_skill path>
Responsibilities
  • <R01 — condensed>
  • <R02>
  • <R03>

Policy boundary
  • <most important constraint from policy_refs>

At close: emit <emits_handoff> → <consuming role>
══════════════════════════════════════════
```

After this block, begin the role's work immediately using the loaded skill instructions. Do not ask the user another question unless the task requires it.

---

## Step 6 — Transition proposal (emit handoff, propose next role)

This step runs **at the end of role execution**, not at the start. When the active role has completed its work and is ready to emit its handoff artifact, it prints this block before stopping.

### Chain mode check first

| Current mode (inferred in Step 1) | Behavior at emission |
|---|---|
| **Single** | Emit handoff. Print summary block. Stop. Do not propose next role. |
| **Two-role** | Emit handoff. Print summary block. Propose next role — but stop after delivery-planner even if user confirms. |
| **Full chain** | Emit handoff. Print summary block. Propose next role. Auto-proceed on [Continue →]. |

If the mode was inferred as **Single** at entry, the outgoing role still emits its handoff file but does not auto-propose the next role. The user can invoke role-activation manually if they want to continue.

### Transition proposal block

When the role completes and chain mode is Two-role or Full chain:

```
✓ <Role Name> complete
──────────────────────────────────────────
HANDOFF: <gate-file-name> (<handoff-shape>)
  <key field 1>: <value summary>
  <key field 2>: <value summary>

Ready for: <Next Role Name>
  <One sentence: what the next role will do with this handoff>
  Estimated: <rough scope if known>

[Continue →]   [Review findings]   [Stop here]
──────────────────────────────────────────
```

**Example — principal-architect completing:**

```
✓ Architecture analysis complete
──────────────────────────────────────────
HANDOFF: mode1-output.json (architecture-decision)
  blast_radius_scope: UI ✓  Service ✓  DB ✗  Doc ✓
  architectural_phasing: 2 Implement Now · 1 Design Now · 0 Defer

Ready for: Delivery Planner
  Will phase the implementation into gated steps with verify conditions.
  Estimated: 2–3 steps across UI + Service surfaces.

[Continue →]   [Review findings]   [Stop here]
──────────────────────────────────────────
```

### What each response means

- **[Continue →]**: User confirms. Run WFL-ROLE-001 Step 1.5 for the next role. The gate file was just written, so it will pass. Activate next role and begin Step 5 immediately.
- **[Review findings]**: User wants to read the handoff before proceeding. Do not activate next role. Wait.
- **[Stop here]**: User ends the chain. Deactivate current role. No further role activation unless user re-invokes.

### When the gate file is written

The outgoing role writes its gate file (e.g., `.agent/session/mode1-output.json`) **before** printing the transition proposal block. This ensures that if the user chooses [Continue →], the next role's Step 1.5 check will find the file and pass immediately.

---

## Handoff chain — full sequence

```
User request
    │
    ▼
WFL-ROLE-001 (this workflow)
    │  ← prerequisite check runs here for every role
    ▼
principal-architect  (domain discovery → blast_radius_scope → architecture-decision)
    │
    ▼ mode1-output.json
delivery-planner     (phased steps → validation gates → phased-execution-plan)
    │
    ▼ mode2-output.json
safe-implementer     (scoped edits → checkpoint_verdicts → implementation-evidence)
    │
    ▼ mode3-output.json
qa-agent             (gate runs → standard_output → validation-report)
    │
    ▼ validation-report.json
governance-reviewer  (PIRR 20-cat → compliance_verdict → governance-status)
    │
    ▼ governance-status.json
pr-release-agent     (commit → PR → session-handoff)
```

The domain knowledge about the codebase — blast radius, surface constraints, affected files, architectural invariants — is captured by principal-architect and flows forward through every handoff. No role below principal-architect should discover architecture independently; they should consume it from the chain.

---

## Override and escape hatches

- **"switch role"** → return to Step 1 with current task context
- **"cancel role"** → deactivate; no handoff emitted
- **"what role am I in?"** → reprint Step 5 activation summary
- **"show policies"** → list `policy_refs[]` IDs
- **"skip gate"** → bypass prerequisite check with logged warning

---

## Process pattern reference

The completeness requirements for this workflow (prerequisite gate + transition proposal) are documented in `.agent/patterns/role-workflow-completeness.md`. Consult that pattern when authoring a new role workflow to verify nothing load-bearing is missing.

---

## What this workflow does NOT do

- Does not execute the role's tasks (that is the wrapped skill's job) — but it DOES load the skill file at Step 5 before execution begins
- Does not emit handoff artifacts (the role contract defines what to emit)
- Does not modify `skill-router.yaml` (read-only from here)
- Does not run PIRR (governance-reviewer's job at session close)
- Does not perform domain discovery (that is principal-architect's job; this workflow only checks that prior discovery exists as a gate file)

<!-- SSOT: docs/incidents/INC-079-performative-adrs-unimplemented-schemas-and-role-activation-bypass.md — INC-079 -->

