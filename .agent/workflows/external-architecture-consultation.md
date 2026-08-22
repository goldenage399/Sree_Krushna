---
description: Delegate an architecture/domain-model question to an external collaborator (another AI, a consultant, a second-opinion channel) via written specification documents, while keeping this repo's evidence-based scaling discipline and its actual live capabilities as the final filter before anything is treated as build-ready.
---

# External Architecture Consultation Workflow (EAC-001)

**Purpose**: Get an independent, unbiased take on an architecture/domain-model question, then reconcile it against this repo's real maturity and real code before it's allowed to become a build plan.
**Distinguish from EUR v2** (`external-ui-redesign.md`): EUR v2 delegates *visual/information design* via sandboxed TSX code, with a component registry and diff-review pipeline. This workflow delegates *architecture/domain-model* questions via written documents (prose, tables, diagrams) — no code, no sandbox. Both share one principle: the external owns exploration in their domain; the internal owns constraints, evidence, and gate authority. Use EUR v2 for "how should this screen look/behave," this workflow for "how should this capability be modeled."
**Proven by**: OPUS / "My Day" execution-model consultation (2026-07-29/30) — `User_Created/Discussion Threads/MyDay/`.

---

## Phase 0 — The Unbiased Brief

Before any external contact, write a requirements-only brief containing:

1. The objective/business problem, in plain terms.
2. The real domain context the external needs (org structure, data facts, existing constraints) — stated as **given facts**, not as "here's how we built it."
3. The actual open question, with real-world examples.
4. Explicit scale/maturity constraints (user count, team size) so the external doesn't design for a scale that doesn't exist yet.
5. An explicit statement that implementation detail and any prior internal decision on this exact question are being withheld on purpose, so the first pass reasons from the requirement rather than anchoring to an existing direction.

Reference example: `User_Created/Discussion Threads/260616_Task_Management_Arch/260729_EXTERNAL-BRIEF-Task-Execution-Model.md`.

**Failure mode this prevents**: a reviewer (external or a second internal pass) lightly rewording an existing direction instead of independently validating it.

## Phase 1 — Let Them Converge

The external iterates in their own process toward a design — their own document sequence, their own concept exploration. Don't direct their internal methodology; that's their domain, the same way EUR v2's Discovery mode leaves structural exploration to the external. Read everything they produce in full before responding — synthesizing from a partial read is exactly the failure mode Phase 3 exists to catch downstream, just moved earlier.

## Phase 2 — The Scale-Gate & Reconciliation Brief

Once the external converges on a design, apply this repo's own evidence-based gate to *their* proposal — the same test used internally, not a lighter one for external work:

1. **Classify every new entity/mechanism** the proposal introduces as justified now or needs-real-usage-evidence-first, citing an actual internal precedent (e.g. "we deferred X on these same grounds — [Council_Ledger.md](../../User_Created/Discussion%20Threads/Council/Council_Ledger.md) entry").
2. **Ask for a minimum-viable slice alongside the full vision** — the smallest version that delivers the core value, and what the fuller model specifically buys that the minimal one can't.
3. **Reconcile point-by-point against what's already live.** For every concept in the proposal that plausibly maps onto an existing mechanism, ask explicitly: replace it, extend it, or sit alongside it? An unanswered reconciliation point is not acceptable — go verify the real mechanism first (grep the code, read the field), then ask the specific question grounded in what you found.
4. **State hard constraints as non-negotiable**, not "keep in mind" — e.g. "no externally-proposed value may ever be written to the platform's frozen status field, under any circumstance."

Reference example: `User_Created/Discussion Threads/MyDay/260730_EXTERNAL-BRIEF-Feedback-and-Scope-Refinement.md` — six reconciliation questions, each grounded in a specific, independently-verified platform fact.

## Phase 3 — Verify, Don't Narrate

When a deliverable comes back, **read the actual file** before describing it to anyone or accepting it. A summary of what the collaborator claims they did is not verification.

- Score it against the explicit criteria from Phase 2 (or Phase 4's follow-up criteria), item by item, pass/fail — not a paragraph of impressions.
- Spot-check factual claims against the real code/data where checkable. The same discipline applied to internal work in this repo (test a guard against a known-bad case before trusting a clean scan; confirm a field exists before citing it) applies to external claims too — an external source is not exempt from verification just because it came from somewhere else.

## Phase 4 — Name "Restated the Ask" as Its Own Failure Mode

A deliverable can have the right shape — same headings, same table structure, plausible length — while adding no independent judgment, just echoing the brief back. This is distinct from "wrong" or "incomplete," and a completion-shaped response makes it easy to miss on a skim. Concretely: if a response's table or wording is near-verbatim what the brief already said, that is itself a finding, not a pass — describe it as such rather than accepting it because the sections are all present.

When this happens, don't send a broader re-brief. Send a **narrow follow-up with explicit, numbered acceptance criteria**, each with a stated "pass condition" the collaborator can self-check before returning work.

Reference example: `User_Created/Discussion Threads/MyDay/260730_EXTERNAL-BRIEF-Discover-Work-Routing-Followup-v2.md`.

## Phase 5 — Iterative Tightening, With the Same Scrutiny on Fixes

When a gap is found and "fixed," re-verify the fix itself — a stated fix is a claim, not a fact, same as the original deliverable.

1. Re-read the file to confirm the fix actually addresses the named criterion — don't trust the collaborator's description of their own change.
2. **Check whether the fix introduced a new, smaller inconsistency.** Common failure: a count or cross-reference elsewhere in the document was true before the fix and is now stale (e.g. "5 branches" fixed to 6 in one place, but a second mention of "the 6th and 7th [additional] branch" elsewhere wasn't updated to "7th and 8th"). Catching this requires re-reading the whole affected section after every fix, not just the line that changed.

---

## Relationship to Other Workflows

| Workflow | Relationship |
| :--- | :--- |
| [external-ui-redesign.md](external-ui-redesign.md) (EUR v2) | Sibling, not a superset. EUR v2 = visual/information design via sandboxed code with a component registry and diff-review pipeline. This workflow = architecture/domain-model questions via written documents, no code, no sandbox. Same underlying principle (external owns their domain's exploration; internal owns constraints and gate authority) and the same anti-pattern (accepting completion-shaped output without verifying it). |
| [external-review-package.md](external-review-package.md) (ERP-001) | Artifact engine. Supplies the structured 3-part packaging protocol (Source SSOT + Context Explainer + Challenge Prompt) for Phase 0 briefs and Phase 3 verification packages. |
| [architecture-council.md](architecture-council.md) | Phase 2's scale-gate here is RFG-001 from this council, applied to an externally-sourced proposal instead of an internally-generated one. If the converged design crosses a council-trigger threshold (schema change, new service, etc.), route it through the actual council before treating it as approved — this workflow is a pre-filter before the proposal is council-ready, not a bypass of the council itself. |
| [enhancement-scaffolder](../skills/enhancement-scaffolder/SKILL.md) | Once a slice clears Phase 2, scaffold it as a normal TASK ticket (`enhancement-notes/`) — this workflow ends at "build-ready specification," it doesn't replace normal enhancement tracking or its Open Discoveries register. |
