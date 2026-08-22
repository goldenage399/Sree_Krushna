---
description: Mode-based external UI redesign — Discovery (find the right structure), Convergence (harden it), Execution (port to production). Externals own information design; internals own standards, invariants, and gate authority.
---

# External UI Redesign Workflow (EUR v2)

**Purpose**: Delegate the *visual/information design* of a UI component to an external agent (designer, another AI, a sandbox collaborator) while keeping codebase standards, theming, and data wiring entirely internal.
**Scope**: Any Task-Dashboard component being rethought (cards, modals, dashboards, wizards)
**Version**: 2.0 (revised 2026-06-18 — mode-based model; see EUR-001 retrospective Q7.0–Q7.4)
**Proven by**: Team Oversight page redesign (EUR-001) — `User_Created/Discussion Threads/260612_Team-Tasks/EUR-001_SCOPE_LEDGER.md`

> **Knowledge Retrieval**: Before beginning, execute [FRONTEND-KNOWLEDGE-HUB.md](../../docs/ssot/ui-design/FRONTEND-KNOWLEDGE-HUB.md) Part 10 Step 0 to load the retrieval profile for this work type (WT-01 EUR / WT-07 Sandbox Exploration).

> **Golden Rule**: The external owns *information design, states, and flows*. The internal team owns *standards, tokens, instrumentation, and data wiring*. Never mix the two in one brief — it dilutes both.

---

## Operating Modes

Every EUR engagement is always in exactly one mode. The mode determines which brief format, constraint model, evidence standard, and exit criteria apply. Do not apply Convergence tools in Discovery or Discovery tools in Convergence — the failure modes are different and the tools are not interchangeable.

| Mode | Objective | Contributor | Brief format |
|---|---|---|---|
| **Discovery** | Find the structural model that fits the information | External (Sandbox Explorer) | Open brief — scenarios, out-of-scope list, no locks |
| **Convergence** | Harden the validated model into a precise, stable design | External (constrained) | Inherit-First — DO NOT TOUCH table, binary DoD |
| **Execution** | Port to production — real data, invariants, build gates | Internal (local agent) | Production spec — data mapping, contracts, milestone gates |

**Mode transitions** are triggered by one question: *has the work moved into a domain the current contributor cannot access?*

- **Discovery → Convergence**: Architect can validate the structural model and articulate *why* it is correct (not just that it is preferred). If the architect cannot answer that question, the model is not yet validated — stay in Discovery.
- **Convergence → Execution**: Both conditions hold: (a) design is sufficiently hardened — edge states evidenced, defect rate declining; and (b) remaining work requires the real codebase — live data, production contracts, framework invariants, build gates. Either condition alone is insufficient.
- **Convergence → Discovery (regression)**: Defect rate is stable or rising across three consecutive gates AND the defects are structural (not implementation). The structural model was not actually validated at Discovery exit.

The architect decides all transitions. The executing contributor does not self-authorize a mode change.

---

## When to Use

- A component needs visual rethinking and internal iteration has stalled or anchored on the current design
- A new metric/data model needs a UI expression nobody has visualized yet
- You want N independent design variants cheaply before committing direction

**Not for**: bug fixes, layout tweaks, or components whose design is already settled (use normal enhancement flow).

---

## Entry Gate — Frame the Requirement (internal, before entering Discovery)

Produce four artifacts. Skipping any of these is the main failure mode (external returns something pretty but unusable). This gate must be passed before Discovery begins — not merely before contacting the external.

1. **The question the UI must answer.** One sentence, user-centric. Not "show workload" but *"what will happen to this task after I drop it in this queue?"*
2. **Locked decisions.** Numbered DEC-style constraints the design must respect (from PRDs/discussion threads). Example: "metrics shown separately, never blended into one score"; "assignment routing authority stays with the human."
3. **Data-reality inventory.** For every value the card could display: exists today / exists but thin / gated on future work. The external designs states for all three; the review checks nothing displays data that can't exist.
4. **Scenario personas for mock data.** The design is only testable if the mock encodes the edge stories. Minimum set: the healthy case, the divergence case the feature exists to expose (e.g., high commitment + low attention + stale queue), the vacant/empty case, the zero/no-data case.

> **SDP-001 pre-flight (Steps 1–5)**: Before entering Discovery, run `proto-system-discovery "<component name>"` and check the UI-QUALITY, GOVERNANCE, and INFRASTRUCTURE cluster docs. If an active enhancement with design decisions already exists for this component, use those decisions as locked constraints (item 2 above) — not as a starting point for re-exploration. Discovery that duplicates a settled enhancement wastes external budget.

## Phase 2 — Package the Brief for the External

**Iteration 1 objective — maximize exploration, not constraint adherence.** The first brief must free the external from the current layout. Do not apply Inherit-First on iteration 1 — it anchors to a baseline that may be the wrong structure. Locked decisions still apply; existing layout does not. The structural model is what is being discovered; constraining it before it is found defeats the purpose. If iteration 1 validates a new direction, that file becomes the baseline for iteration 2+.

**First iteration (no baseline exists — Discovery mode):**
- **Self-contained**: external has zero codebase context. No internal ticket IDs without inline explanation; plain design language.
- **Format**: single-file, dependency-free React/TSX (mock data inline) that runs in the sandbox repo (`D:\GitHub_Repo\TestViteJSX`). One file per variant, suffixed (`Redesign2_0.tsx`, `Redesign2_1.tsx`).
- **Explicit out-of-scope list** (always include verbatim): *"Don't spend time on color theming, font tokens, test IDs, or accessibility contrast tuning — we re-skin via our own pipeline at ingestion. Keep your palette; focus entirely on information design, states, and flows."*
- Include the scenario personas from Phase 1 as required mock data.

**Iteration 2+ (baseline exists — Convergence mode — use Inherit-First Format):**

Switching to prose is the most common failure mode for iterative briefs. Use the five-section Inherit-First Format instead — see `.agent/patterns/external-iterative-design-gate.md` Pattern 2:
1. **STEP 0**: Name the exact baseline file and the exact copy-to-new-file instruction.
2. **🔴 DO NOT TOUCH**: Table of locked component names + line ranges + 5-item self-verification checklist.
3. **🟢 YOUR TASK**: Named ADD blocks only — each with exact state wiring code, not prose.
4. **🎭 Demo States**: Two named states (default + filtered).
5. **✅ Definition of Done**: Binary checklist including DO NOT TOUCH verification items.

## Phase 3 — Internal Design Review (per variant)

**Run the diff first, read the file second.**

```powershell
# Step 1: ratio check — high deletions on a small-change brief = red flag
git diff --no-index --stat -- <baseline> <result>

# Step 2: structured diff
git diff --no-index -U3 -- <baseline> <result> 2>&1 | Select-String -Pattern "^(\+\+\+|---|@@|^[+-])"
```

Categorize every hunk: **New work** (expected per brief) / **Regression** (any `+/-` inside a LOCKED component) / **Drift** (unrequested, not clearly a regression — flag). See `.agent/patterns/external-iterative-design-gate.md` Pattern 3 for the full diff-review protocol.

Then review against this checklist — framework correctness first, concept second, standards explicitly deferred:

| # | Check | Classic failure caught |
|---|---|---|
| 0 | **Framework correctness** — no hooks after a conditional `return`; no hooks inside conditions or loops; effect deps don't reference stale closures; no missing `key` props on mapped elements. External doesn't run the code — spec-conformant JSX can still crash. | `useState` after early `return null` crashes modal on open (invisible to design review) |
| 1 | **Concept fit** — respects every locked decision? | Invented composite score where decisions said "never blend" |
| 2 | **Data reality** — every displayed value maps to data that exists (or is explicitly a gated-future state)? | Pillar renders metrics whose capture shipped yesterday |
| 3 | **States coverage** — loading / empty / no-data / vacant / thin-data all designed? "Unreported" visually distinct from "zero"? | Zero shown for missing data, reads as idle |
| 4 | **Behavior honesty** — every button does what its label says, even in mock? | "Defer" button that assigns immediately |
| 5 | **Edge personas** — does the divergence scenario actually *look* different at a glance? | Stagnating profile indistinguishable from healthy one |
| 6 | **Touch/mobile** — hover-only affordances have tap equivalents; narrow-viewport layout shown? | Tooltip-locked information invisible on tablets |
| 7 | **Variant mismatch** — does the accompanying writeup actually describe *this* file? | Review prose describing a different variant |
| 8 | **Evidence completeness** — every new interactive state introduced in this brief (drawer, modal, collapsed, filtered, empty) has a screenshot. A missing screenshot for a required state **blocks the gate** — it is a defect signal, not an omission. The state most likely to be absent is the state most likely to be broken. | Collapsed swimlane not shown (code-verified only); crashing modal not shown |

Standards violations (hardcoded colors, missing testids, arbitrary font sizes) are **noted but not sent to the external** — they're the Execution mode's job.

**Gate sign-off authority**: The agent that builds a milestone does not sign its own gate. Gate approval is the architect's explicit act, performed after reviewing the diff and evidence. An agent marking a gate complete before architect review is a process violation regardless of whether the code is correct. An all-pass review with zero findings is a smell, not a success — confirm it is intentional.

## Phase 3.5 — Component Registry Update (after each approved iteration — Convergence mode only)

> **Convergence mode only.** Registry updates are irrelevant in Discovery (nothing is locked yet) and in Execution (no external contributor). Skip this step when in those modes.

Before issuing the next brief, update `COMPONENT_REGISTRY.md` (lives in `User_Created/Discussion Threads/<thread>/`):
- Promote newly approved patterns → `✅ LOCKED` (add function name, line range, code excerpt, verification check)
- Resolve completed `🔄 PENDING` items → `LOCKED` or close
- Log any regressions that slipped through → `🚫 REGRESSION BLACKLIST`
- Update the version index with the new baseline filename and timestamp
- Run the per-iteration handoff checklist before issuing the next brief

See `.agent/patterns/external-iterative-design-gate.md` Pattern 1 for the full registry structure.

## Phase 4 — Direction Brief Back (iterate until approved)

Fixed format — proven to produce clean revisions:

```
Keep: <approved elements, one line each — prevents regression of what works>
Change:
  1..N <numbered, specific, design-level directives with the why>
Don't spend time on: <restate the out-of-scope list>
Open taste-calls: <decisions you haven't made — invite the external's judgment>
Noted (not this iteration): <ideas from a losing/non-adopted variant worth remembering — optional, only when something's actually worth keeping track of>
```

Repeat Phases 3–4 until direction is approved. Track variant lineage in the discussion thread.

> Gate sign-off authority applies in every iteration — the architect signs each gate after reviewing diff and evidence; the executing contributor does not self-certify. See Phase 3 gate sign-off authority rule.

## Phase 4.5 — Inflection Check (before issuing each new external brief)

Before writing the next brief, the architect evaluates whether to continue the external loop or switch to Execution mode.

**Enter Execution when both conditions hold:**

- **(a) Design sufficiently hardened** — structural model validated, edge states evidenced, defect rate declining across recent gates
- **(b) Remaining work requires the real codebase** — live data wiring, production service contracts, framework invariants, build/lint gates

Either condition alone is insufficient. If only (b) holds — the design isn't fully hardened but the remaining work is all codebase-side — enter Execution early and record what is not yet hardened in the ledger as a named gap.

**Secondary signal — exit even if (a) is uncertain:** If the last three gates each caught at least one defect, the external loop is oscillating rather than converging. Evaluate whether the structural model is actually settled. If defects are structural: return to Discovery. If defects are implementation: the external has exhausted their domain — enter Execution.

**Do not continue the external loop because:**
- The design isn't "finished" yet (finished by whose standard?)
- The file could use more polish
- Elapsed time or iteration count is low

These are not domain-fit signals. The only valid reason to continue externally is that the remaining work is within the external's domain.

**Record the decision** in the scope ledger: mode transition, date, which condition triggered it.

---

## Phase 5 — Execution (internal only; standards apply from here)

Execution mode uses a production specification, not a design brief. The spec must define: (1) every displayed value mapped to its exact production source or named as a gap; (2) external contracts that apply (LOCK-DATA-001, ADR-012, ARCH-INV-002, etc.); (3) milestone sequence with per-milestone gate criteria.

> **SDP-001 Execution pre-flight**: Before writing the production spec, run `proto-system-discovery "design ingestion pipeline"` and check ENH-INFRA-066 in the INFRASTRUCTURE cluster to verify PRISM operational status. Confirm whether Step 4a (AGP translation) is live or `MANUAL_REQUIRED` before citing it in the spec. Record any gaps as named deferred items in the scope ledger — do not silently assume the pipeline is complete.

> **SDP-001 §6 Capability-Spectrum Check**: Before locking the data mapping and external contracts, enumerate the full capability surface: every state the component must render (§6.2 — read the `data-reality inventory` from Entry Gate), every contract that applies, and every gap explicitly named. A production spec that covers only the healthy-path data wiring fails §6.3.

> **Live Data Verification (conditional)**: If the data-reality inventory includes any value marked *"exists today"* or *"exists but thin"* against a Firestore collection, run `npm run db:simulate -- <user@example.com>` or the appropriate targeted inspector (`npm run db:task`, `npm run db:profile`) to verify field existence and shape in live data **before** writing the production spec. A design that references a field that doesn't exist in live data — or exists under a different key casing — will fail at wiring time. Prerequisite: `serviceAccountKey.json` present (P53). See `.agent/workflows/db-inspect.md`.

Gates in Execution mode are signed by the architect, not self-certified by the executing agent. Evidence is `git diff` + `npm run build` + `npm run sg:scan` — objective, machine-verifiable. Full-file re-emission is not an accepted evidence format.

### Surface Audit Gate (mandatory — runs before Visual Delta Matrix)

> The external JSX is READ-ONLY — it encodes visual intent only. Never adapt it directly.
> Full protocol: `.agent/patterns/eur-surface-audit.md`
> When adapting external stylesheets or standalone canvas engines, see `.agent/patterns/monolithic-engine-port-css-scoping-gate.md` for strict container scope isolation.

For every distinct UI element in the approved external design, produce a classification row before writing any code:

| Element | Class | Internal Equivalent | Action |
|---|---|---|---|
| `<component>` | `LAYOUT_ONLY` / `STYLED_EXISTING` / `STYLED_NEW` / `BEHAVIORAL_EXTERNAL` / `ARCHITECTURAL_ORPHAN` | existing file or "none" | adapt / create (AGV-001 first) / DEFER / INVESTIGATE / REJECT |

**REJECT classes — explicit scope exclusions:**
- `BEHAVIORAL_EXTERNAL`: carries hooks, state, or data from external context with no internal equivalent
- `ARCHITECTURAL_ORPHAN`: element concept has no place in internal architecture

**DEFER** (valid but out of scope this iteration — record in scope ledger as a future candidate) and **INVESTIGATE** (insufficient evidence to classify — blocks sign-off on that row) are not REJECT; don't collapse them into it. Rejected rows are removed from scope here, not discovered mid-implementation. DEFER/INVESTIGATE rows must resolve to a final action before sign-off. The architect signs off on the table before the Visual Delta Matrix is produced.

---

### Visual Delta Matrix (pre-implementation gate)

Before writing any production code, produce a Visual Delta Matrix comparing every approved sandbox screenshot against its corresponding production surface. **Only elements that passed the Surface Audit Gate appear in this matrix.** Implementation does not begin until this matrix is complete and the architect has acknowledged it.

**Per surface, identify:**

| Dimension | What to capture |
|---|---|
| Structural differences | Layout regions, nesting, grid vs flex changes |
| Information hierarchy | What is above the fold, what is de-emphasized |
| Visual density | Spacing, padding, information per viewport |
| CTA placement | Button positions, primary action prominence |
| Missing interactions | Hover states, drawers, toggles present in sandbox but absent in production |
| Styling differences | Color, typography, border, shadow deltas |

**Classify each delta:**
- **Critical** — materially affects primary workflow (blocks task, hides key data, breaks navigation)
- **Important** — noticeable visual mismatch that degrades experience
- **Cosmetic** — styling-only; no functional impact

**Attribute mismatch by component.** Estimate what percentage of total visual delta is owned by each component in scope (e.g. TaskCard, TaskDetailsModal, TaskUpdateModal, page container, other). This determines implementation sequencing — highest-mismatch, highest-criticality component ships first.

> **Objective framing**: The goal is *visual parity with the approved cockpit experience*, not *component parity*. A component that looks different from its sandbox counterpart but achieves the same workflow outcome is a success. A component that is a pixel-perfect clone but breaks ADR-014 constraints or production data contracts is a failure.

For component-scoped work (card, modal, wizard step):
1. **PRISM pipeline** for tokenization: `node scripts/design-integration-pipeline.cjs <design-path>` — see ENH-INFRA-066. ⚠️ **Partial skeleton**: Steps 1–2 and 6–9 are operational; Steps 3–5 (AGP translation / semantic tokenization) return `MANUAL_REQUIRED` pending ENH-INFRA-065 Phases 1–3. Until ENH-INFRA-065 ships, apply ARCH-INV-004 semantic tokens manually and verify with `npm run sg:scan` — do not treat a clean pipeline run as proof that tokenization occurred.
2. **Placement per CLC-001**: land as preview component in `src/components/preview/` with `/preview/*` route before touching production components
3. **Standards pass**: ARCH-INV-004 semantic tokens, compact font scale, ARCH-INV-007 / P55-DEV instrumentation, QMP-001 memoization for any queries
4. **Gates**: `npm run sg:scan` + `npm run build` clean
5. **Production integration** via normal enhancement protocol (`.agent/workflows/enhancement-protocol.md`) with its own TASK/ENH entry

For full-page replacement: skip the PRISM preview step — a full page cannot be isolated into `src/components/preview/`. Proceed directly to the enhancement protocol with the hardened design as the specification. Record the skip decision in the ledger.

## Related

- [external-architecture-consultation.md (EAC-001)](external-architecture-consultation.md) — sibling workflow for architecture/domain-model questions delegated via written specs (no sandbox code). Use that one when the question is "how should this capability be modeled," not "how should this screen look/behave."
- [SCP-001 Sandbox Creation Protocol](../../docs/protocols/SANDBOX-CREATION-PROTOCOL.md) — isolated component development
- [Theme Isolation Plugin Guide](../../docs/development-guidelines/THEME-ISOLATION-PLUGIN-GUIDE.md) — 6-layer isolation for external design reviews
- [JSX → HTML conversion](../../CLAUDE.md) (Central Brain UI Reference Workflows) — when sharing references *to* an external for replication
- [ENH-INFRA-066 PRISM v2](../../docs/enhancements/ENH-INFRA-066-IMPLEMENTATION-SYNTHESIS.md) — the ingestion pipeline this workflow feeds
