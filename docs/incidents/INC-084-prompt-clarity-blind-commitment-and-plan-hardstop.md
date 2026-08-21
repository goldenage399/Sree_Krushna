# INC-084 — Prompt Clarity Blind Commitment, Execution Chaining, and Intent Decoupling Gate

**Incident ID**: INC-084  
**Date**: 2026-08-19  
**Severity**: High (Agent Execution Safety, Intent Disambiguation, Protocol Governance)  
**Governing Documents**: [`meta-prompt.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/skills/prompt-clarity/meta-prompt.md), [`SKILL.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/skills/prompt-clarity/SKILL.md), [`GEMINI.md § AKCS-BEH-001`](file:///d:/GitHub_Repo/Task-Dashboard/GEMINI.md), [`CLAUDE.md`](file:///d:/GitHub_Repo/Task-Dashboard/CLAUDE.md), [`intent-clarity-decoupling-and-plan-hardstop.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md), Protocol 3 (Execution Control / Explicit Approval)  
**Affected Components**: `.agent/skills/prompt-clarity/SKILL.md`, `.claude/skills/prompt-clarity/SKILL.md`, `.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md`, `GEMINI.md`, `CLAUDE.md`, `AGENTS.md`, `.agents/AGENTS.md`  

---

## 1. Incident Summary

During complex prompt clarification and option selection (surfaced in discussion thread `260814_WorkflowUpgrades.md` and investigated in `260818_PromptClarityImprovement.md`), two interrelated systemic governance defects occurred:

1. **The "Blind Commitment" & Execution Chaining Defect**:
   When a user invoked `/prompt-clarity` on an ambiguous or multi-surface request, the agent presented alternative rephrased options. However, when the user selected an option, the agent immediately treated that option as a finalized working specification and jumped directly into code mutation and file edits in the very same turn. The agent failed to evaluate whether prerequisites existed, what the workstream blast radius would be, or to pause and present an implementation plan for explicit user approval.
2. **The "Manifest Anchor & Greenfield Fallacy" Remediation Defect**:
   When initial corrections were proposed, the agent anchored on an oversized 10-requirement blueprint, attempting to invent an 11-stage mini-lifecycle, custom "Workstream Impact Cards", and a 4-tier truth taxonomy inside `meta-prompt.md`. This duplicated machinery that already existed in `Task-Dashboard` (`architecture-council.md` 3-question invocation gate, `cos-intent-signal-routing-table.md` `IS-007` blast radius scope, and `cos-invoke.md`/`PREFLIGHT.md`), while violating its own Non-Goals and colliding with local repository terminology (`RFG-001`).

---

## 2. Root Cause Analysis

1. **Conflation of Intent Disambiguation with Execution Authorization**:
   `prompt-clarity` Step 4 historically contained an unconditional directive: *"Once clarified, proceed with the actual task using the chosen reframing as the working spec."* This assumed that clarifying what the user meant was equivalent to having a fully vetted implementation plan and immediate authority to execute.
2. **Missing Plan Hard-Stop Gate in Prompt Clarity**:
   While Protocol 3 (Execution Control / Explicit Approval) exists in `GEMINI.md`, it was not explicitly wired into the exit conditions of `prompt-clarity`. Consequently, selecting an option allowed the agent to chain planning and execution without stopping.
3. **Cognitive Inventory Amnesia**:
   Instead of searching `.agent/` and `docs/ssot/` to discover that Decision Sufficiency Gates and Blast Radius scopes already existed in `Task-Dashboard`, the agent attempted to reinvent them from scratch.

---

## 3. Architectural Surface Mapping (6 Surfaces)

| Surface | Impact & Verification |
|---|---|
| **1. UI Surface** | • **No Direct UI Component Change**: Incident affected agent cognition, execution boundaries, and governance protocols. |
| **2. Data Surface** | • **Write Safety Preserved**: Prevents unvetted database writes or Firestore rule mutations by ensuring all architectural changes pass through `architecture-council.md` / `cos-invoke.md` before execution. |
| **3. Reactive Surface** | • **No React State Change**: Unaffected. |
| **4. Service Surface** | • **No Backend Service Change**: Unaffected. |
| **5. Module Surface** | • Upgraded `.agent/skills/prompt-clarity/` and `.claude/skills/prompt-clarity/` with 100% mirror parity. |
| **6. Governance Surface** | • Patched `SKILL.md` Step 4 and `meta-prompt.md` Step 3 with the **Routing & Plan Hard-Stop Gate**.<br>• Institutionalized 5 AI reasoning rules (`AKCS-BEH-001`) in `GEMINI.md`, `CLAUDE.md`, `AGENTS.md`, and `.agents/AGENTS.md`.<br>• Captured master pattern `.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md` (validated via `verify:governance-wiring`). |

---

## 4. Corrective Actions & Invariants Established

### Invariant 1: Intent Decoupling & Plan Hard-Stop Gate
- A clarified prompt resolves **what was meant**, NOT implementation authorization.
- When a clarified intent touches non-trivial architecture or requires unvetted assumptions:
  1. The agent MUST route to `/role-activation` / `cos-invoke.md` / `architecture-council.md` / `plan.md`.
  2. The agent MUST present the course of action / implementation plan.
  3. The agent MUST **HARD-STOP** (stop calling mutating tools) until the user gives explicit, standalone approval.

### Invariant 2: Inventory First, Invent Never (Rung 2 Grounding)
- Before creating any new schema, gate, card, metric, taxonomy, or lifecycle stage, agents MUST search `.agent/` and `docs/ssot/` for existing equivalents and wire to them rather than constructing duplicate systems.

---

## 5. Verification & Acceptance
- `npm run verify:governance-wiring` passed with exit code `0` (10/10 artifacts wired).
- Parity verified across `.agent/` and `.claude/` skill trees.
