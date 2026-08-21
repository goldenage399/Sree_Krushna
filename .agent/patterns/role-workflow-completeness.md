---
pattern: role-workflow-completeness
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "authoring new role workflow"
  - "adding workflow step"
  - "workflow definition review"
guard: "before marking any role workflow complete"
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Pattern: Role Workflow Completeness Gate

**Category**: Process Pattern  
**Applies to**: Any workflow document governing agentic role activation or role-to-role transitions  
**Origin**: 2026-06-28 — WFL-ROLE-001 initial draft shipped without prerequisite gate or transition proposal; gap identified via user question "when does the handoff happen and role shifts?"  
**Status**: VALIDATED (gap identified and fixed in same session)

---

## The Gap

A role activation workflow that defines role selection, confidence scoring, and role preview (Steps 1–5) is **incomplete** without two structural anchors:

1. **Prerequisite gate (before activation)** — confirms the domain knowledge the candidate role depends on already exists as a file. Without this, a high-confidence role match activates blindly: no blast radius, no surface constraints, no architectural context.

2. **Transition proposal (at handoff emission)** — the outgoing role prints a summary block and waits for user confirmation before the next role loads. Without this, role transitions are invisible: the user cannot see what was produced, what comes next, or where to stop.

The two gaps compound: an agent can activate safely (gate passed) and work correctly, but the user has no signal that the role finished, no handoff summary, and no way to confirm continuation without re-invoking the workflow manually.

---

## Completeness Checklist

Before marking any role workflow as complete, verify it declares:

- [ ] **Prerequisite chain table** — maps each role to the gate file it requires; explains what "role A needs role B's output" means concretely
- [ ] **Step: Prerequisite gate** — file-existence check before any activation; shows "chain gap" block with predecessor roles when file is missing; logs warning when user bypasses
- [ ] **Chain execution modes** — Single / Two-role / Full chain; inferred from request pattern; governs whether transition proposal auto-fires
- [ ] **Step: Transition proposal** — fires at end of role execution; gate file written before block prints; block includes handoff summary + next role + `[Continue →] [Review findings] [Stop here]`
- [ ] **Override and escape hatches** — "skip gate", "cancel role", "switch role", "stop here"

---

## Why each element is load-bearing

| Missing element | Failure mode |
|---|---|
| Prerequisite gate | Blind activation — agent works without domain context; may edit wrong files, miss blast radius |
| Chain execution modes | Undefined behavior — workflow doesn't know when to stop vs. continue; user gets surprised by full chain run on "analyze only" request |
| Transition proposal | Silent handoff — user doesn't know role finished; doesn't know what was produced; can't confirm or stop chain |
| Escape hatches | Trapped chain — user can't bail out mid-execution without aborting session |

---

## Correction

Add the two missing steps (1.5 prerequisite check; 6 transition proposal) to any incomplete role workflow. The prerequisite chain table and chain execution modes section belong near the top of the document (before Step 1) so they frame the rest of the workflow.

Reference implementation: `.agent/workflows/role-activation.md` (WFL-ROLE-001) — contains all four elements above.
