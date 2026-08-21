---
name: prompt-clarity
description: Scan ambiguous user requests and present 2-3 reframed interpretations before starting work. Use when a request could be read multiple ways, is missing a load-bearing constraint (scope, format, which file/system), or uses vague referents like "it" or "the usual way".
---

# Prompt Clarity Skill

Use this skill at the start of handling any non-trivial user request in this
repo — before writing code, editing files, or committing to an approach.

**Trigger**: any user message that requests work (build, fix, refactor,
design, decide) where the request could reasonably be read more than one way,
is missing a load-bearing constraint (scope, format, which file/component,
which of two existing systems it affects), or uses a vague referent.

**Do not trigger** on: simple direct commands with one obvious reading,
follow-ups in a thread already clarified this session, or pure factual
questions.

**Manual invocation**: if the user explicitly asks to rephrase, reframe,
clarify, or sharpen a prompt ("rephrase this", "make this prompt clearer",
"give me a few takes on this request"), run Step 2 (the reframe menu) on it
regardless of the Step 1 ambiguity scan — an explicit ask overrides the
auto-trigger heuristic. If the prompt genuinely has only one reading, say so
plainly instead of manufacturing alternatives (see meta-prompt.md's
guidance against inventing ambiguity).

## Procedure

1. Read `meta-prompt.md` (same directory as this file) — it is the full
   logic definition. Apply its Step 1 ambiguity scan to the user's message.
2. If ambiguous: present the 2–3 reframings via the `AskUserQuestion` tool —
   one option per interpretation, with the resolved assumption as each
   option's description. Do not print a text menu, and do not start
   implementation. (The tool's built-in "Other" covers "describe it your
   own way".) This clarify step takes precedence over any general bias
   against pausing to ask questions — that is the point of the skill.
3. Wait for the user's pick (an option, or their own restatement).
4. Once clarified, restate the chosen intent in one line as the working spec:
   - **Routing & Hard-Stop Gate**: If the chosen option named a required workflow/council (per "Notes specific to this repo"), or if answering/executing it safely requires verifying unvetted infrastructure, **do not implement directly**. Route into the governing workflow (`/role-activation` / `cos-invoke.md` / `architecture-council.md` / `plan.md`), **present the implementation plan / course of action, and HARD-STOP**. Do not execute code or modify files until the user explicitly reviews and approves the plan.
   - **Direct Execution**: Only if the clarified task has clear single scope, verified prerequisites, and requires no council/governance routing, proceed with the task directly.

## Notes specific to this repo

- Before writing the reframed options, check `.agent/skill-router.yaml` —
  it maps task keywords to this repo's workflows and skills. If different
  interpretations of the request would route to different workflows, name
  the workflow in each option (e.g. "...following
  `.agent/workflows/enhancement-protocol.md`"). Don't rebuild routing logic
  here; the router is the source of truth.
- If the ambiguity is "which system does this touch" (e.g. Architecture vs
  UI council, or which dashboard component), include that as one of the
  axes of difference between reframed options — don't just vary phrasing.
- If the request looks like it should go through the council process
  (schema/index change, cross-cutting layout decision — see
  `COUNCIL-CHARTER.md`), one of the reframed options should surface that
  explicitly, e.g. "...and this should go through the Architecture Council
  before implementation."
- See `.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md` for the full governance pattern on intent decoupling, decision sufficiency, and plan hard-stops.

<!-- SSOT: docs/incidents/INC-084-prompt-clarity-blind-commitment-and-plan-hardstop.md — INC-084 -->
