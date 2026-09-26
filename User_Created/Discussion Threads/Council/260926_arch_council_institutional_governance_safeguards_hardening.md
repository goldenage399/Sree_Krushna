# 🏛️ Architecture Council Decision Record: Institutional Governance Safeguards Hardening Review

**Standard Identifier:** `SK-012` / `P-GOVERNANCE-SAFEGUARDS-HARDENING-001`
**Council Decision:** `AC-DEC-2026-056`
**Date:** 2026-09-26
**Type:** FULL Architecture Council Deliberation with Integrated `/plan-review`
**Status:** ✅ **CERTIFIED (Phase 1 scope) — 2 items classified Recommended Soon, deferred with named triggers (see §7)**
**Protocol Conformance:** Council Deliberation Protocol v1.0 (Phase 0–4 skeleton, RFG-001, ICG-001)

---

## 0. Invocation Context

**Subject under review:** the four "Permanent Safeguards" devised in `User_Created/Discussion Threads/Shopping/260918_ShoppingList.md` (Query/Response 7.3–7.4) and registered as ticket `SK-012` (`enhancement-notes/SK-012/00_ENHANCEMENT_INDEX.md`), Status: `PLANNING`, zero DoD checkboxes exercised at invocation time.

**3-question invocation gate:**
1. **Reversibility** — YES. This ticket mints new *permanent* invariants in `meta-prompt.md`, `writing-plans/SKILL.md`, and `architecture-council.md` — files every future plan and council in this repo reads. A bad invariant propagates to every downstream session.
2. **Boundary** — YES. It crosses Prompt Clarity → Planning Engine → Council → Verification-Gate layer boundaries simultaneously (that is its entire premise).
3. **Disagreement** — YES. Whether 4 *permanent* cross-cutting process gates are proportionate for a 1-developer, pre-launch app is a genuine RFG-001 Burden-of-Proof question (see Dissenter Seat, §3.5).

→ Full council required, no expedited tier.

---

## 1. Phase 0: Evidence Collection (Ground Truth)

1. **Ledger check** (`Council_Ledger.md`): no prior ruling exists for `SK-012`, `prompt-clarity`, `writing-plans`, or `verify-pipeline-contracts` — this is a first ratification, not a re-validation.
2. **Duplication check**: `package.json` scripts (read in full) contain 15 `verify:*` gates; none named or overlapping `pipeline-contracts`. `.agent/PREFLIGHT.md` (R1–R5) has no row routing to it. Net-new script confirmed non-duplicative.
3. **Ground-truth reads** (this session, verbatim file contents, not memory):
   - `.claude/skills/prompt-clarity/meta-prompt.md` (147 lines) — contains **no** `INV-SYSTEMIC-ABSTRACTION-001` text yet.
   - `.agent/skills/writing-plans/SKILL.md` (200 lines) — contains **no** `INV-DATA-TRANSIT-001` text yet; Gate 0 (`P-TICKET-FIRST-PHASING-001`) and the Plan Hard-Stop (`AC-DEC-2026-044`) are already live and are the correct anchor points for the new invariant.
   - `.agent/workflows/architecture-council.md` (280 lines) — its "Council Members" roster and "Known High-Risk Surfaces" tables are **Task-Dashboard-specific content** (React/Firestore collections `tasks`/`users`, `AuthContext.jsx`, `ServiceRegistry.js`) carried over un-localized by a prior `/sap-sync`. Only the `<!-- shared:std.governance... -->` blocks (Phase 0–4 skeleton, RFG-001, ICG-001, Mandate Coverage Map) are repo-agnostic and actually load-bearing here.
   - `docs/incidents/` (glob) — highest existing incident is `INC-098`; `INC-099` (cited by `SK-012` as a dependency) **did not exist** before this session. `INC-077` ("Pseudo-Council Declaration, Unfired Telemetry, Preflight Warning Suppression") is the closest prior incident and names the *identical* generalized defect ("Protocol Decoupling: governance protocols relying on prose output... vulnerable to performative agreement").
   - `docs/references/SPEC-ARCH-GOVERNANCE-SAFEGUARDS-001.md` — cited by `SK-012` as a dependency; **does not exist**.
4. **Concept-collision check**: `SK-012`'s dependency list cites `AC-DEC-2026-048` as its own certifying decision. `Council_Ledger.md` shows `AC-DEC-2026-048` was already allocated to the Lightbox Carousel proposal and was itself reconciled to `AC-DEC-2026-050` per a prior SSOT-reconciliation session (`260924_Shopping_UI_UPGRADES.md`, "SSOT Reconciliation — Cascade Mode"). `SK-012`'s citation is a **stale/collided ID**, not a real ratification — these 4 safeguards were never actually put before a council. The true motivating decision is `AC-DEC-2026-035` ("Tri-Modal Visual Intake"), whose own evidence table recorded the unbacked-persistence gap it later caused (see `INC-099`).
5. **Highest allocated `AC-DEC-2026-###`** at invocation: `055` (`Council_Ledger.md` tail). This session allocates `056` — first fresh, uncollided ID in the series.
6. **Grounding Snapshot (RFG-001 Maturity Anchor)**: Pre-launch, single-family wedding operations app. Production deployed at `https://sree-krushna-forever.web.app`. 2 live visual modules (Shopping Registry, Decorator Cockpit). 4–5 real users today (Host/Groom, Bride, Sisters, Parents), ~20–30 expected as the wedding approaches. 1 developer.
7. **Evidence snapshot**: commit `5e0f5b165cf1eb61dbc55c0bf901b091250c05af`. Files relied on: `.claude/skills/prompt-clarity/meta-prompt.md`, `.agent/skills/writing-plans/SKILL.md`, `.agent/workflows/architecture-council.md`, `.agent/workflows/plan-review.md`, `.agent/PREFLIGHT.md`, `package.json`, `enhancement-notes/SK-012/00_ENHANCEMENT_INDEX.md`, `ENHANCEMENT-MASTER-REGISTRY.md`, `enhancement-config.json`, `Council_Ledger.md`, `260918_ShoppingList.md` (L6600–6710), `260924_Shopping_UI_UPGRADES.md` (SSOT reconciliation section), `docs/incidents/INC-077-*.md`.
8. **External benchmark search**: 2026 literature on agent-runtime governance (arXiv 2606.20634 "DEMM-Bench", arXiv 2605.04093 "Decision Evidence Maturity Model for Agentic AI") converges on the same structural finding this repo's own `INC-077`/`INC-099` independently discovered: **a policy that is not a live, executable runtime gate is not enforcement** — "authority without verification creates silent state divergence." This corroborates (does not originate) the council's Phase 1 findings below; no external mechanism is adopted wholesale (RFG-001 §4, External Review Intake — treated as corroboration, not verdict).

---

## 2. Roster & Explicit N/A Ledger (ICG-001 #2)

| Seat | Filled by | Reason |
|---|---|---|
| SSOT Authority Auditor | ✅ §3.1 | Doc/decision-ID integrity is the core defect class here |
| Workflow & Protocol Integrity Auditor | ✅ §3.2 | Owns `.agent/workflows/`, `.agent/skills/` — the exact files `SK-012` mutates |
| Tooling & Verification Gate Auditor | ✅ §3.3 | Owns `scripts/`, `package.json`, `.agent/PREFLIGHT.md` — the mechanical-enforcement question |
| Maintainability & Velocity Auditor (RFG-001 / `ponytail`) | ✅ §3.4 | Burden of Proof for 4 *permanent* new process gates at 1-developer scale |
| Dissenter Seat | ✅ §3.5 | Rotated in fresh this session (no prior seat history for this subject) |
| Schema & Firestore Auditor | **N/A** | `SK-012` touches zero Firestore collections or security rules |
| Auth & Permission Auditor | **N/A** | No role/permission model surface touched |
| File Placement Auditor | **N/A** | All touched files already have a canonical location (`docs/incidents/`, `enhancement-notes/`, `.agent/*`); no new taxonomy decision needed |

---

## 3. Phase 1: Independent Member Evaluations

### 3.1 SSOT Authority Auditor
- **Position**: Reject `SK-012`'s dependency block as currently written; it fails the very evidence-integrity standard it exists to enforce.
- **Evidence**: `AC-DEC-2026-048` → allocated to Lightbox Carousel, reconciled to `AC-DEC-2026-050` (`260924_Shopping_UI_UPGRADES.md`). `INC-099` and `SPEC-ARCH-GOVERNANCE-SAFEGUARDS-001.md` → absent from disk at invocation.
- **Assumptions**: The ticket author intended these as forward references to artifacts this same workstream would produce, not as claims of pre-existing ratification.
- **Trade-offs**: Fixing citations now costs ~30 minutes; leaving them costs a future session inheriting false confidence that this was already council-approved (the exact `AC-DEC-2026-035` failure mode, recursively).
- **Risks & Dependencies**: If left uncorrected, a future `/plan-review` "As-Is Baseline Audit" would either rubber-stamp the false citation or waste a cycle re-discovering this same defect.
- **Challenge**: *What would change my mind*: if `AC-DEC-2026-048` were shown to have a governance-track sub-ledger separate from the UI-track ledger I read. Checked — `Council_Ledger.md` is the single unified ledger for both Architecture and UI decisions; no sub-ledger exists. Challenge stands.
- **Confidence**: High.

### 3.2 Workflow & Protocol Integrity Auditor
- **Position**: Approve `INV-SYSTEMIC-ABSTRACTION-001` and `INV-DATA-TRANSIT-001` for insertion, but at named anchor points, not as free-floating prose.
- **Evidence**: `meta-prompt.md` Step 1 (L31–52) is the exact ambiguity-scan location; the new invariant belongs as a 5th bullet alongside "Goal vs. means confusion," not a separate section (keeps the scan a single decision point). `writing-plans/SKILL.md` §4 "Plan Document Header" (L57–80) is where a "Physical Storage & Transit Contract" line item belongs, adjacent to the existing DoD v1.7 table it already extends.
- **Assumptions**: Both target files are edited, not replaced — `SK-012`'s Phase 1 already scopes it this way.
- **Trade-offs**: Precise anchoring costs nothing extra and prevents the new rule from drifting into its own orphaned subsection (a `P-SSOT-DOCS` violation risk).
- **Risks & Dependencies**: Both files carry `<!-- SYNC-MIRROR -->` / `<!-- shared:std... -->` sync contracts to sibling repos (`.agent/skills/prompt-clarity/`, Task-Dashboard SAP block). Edits must go in the canonical copy first and respect the shared/repo-specific block boundaries already marked in each file, or a future `/sap-sync` will silently overwrite this session's work.
- **Challenge**: *What would change my mind*: evidence that `INV-SYSTEMIC-ABSTRACTION-001` is meant to apply cross-repo (shared block) rather than Sree-Krushna-only. Not shown — the motivating incident (`INC-099`) is Sree-Krushna-specific commerce/intake logic. Keep it in the repo-specific block for now; flag for a future `/sap-sync` proposal once proven here (RFG-001 Recommended Soon).
- **Confidence**: High.

### 3.3 Tooling & Verification Gate Auditor
- **Position**: `scripts/verify-pipeline-contracts.cjs` (Safeguard #4) is the only one of the four safeguards that is *mechanically* enforced. The other three are prose edits to Markdown files with no executable check — this is a direct recurrence of `INC-077`'s "Protocol Decoupling" finding, inside the very ticket meant to close it.
- **Evidence**: `package.json` has zero script named `pipeline-contracts`; `.agent/PREFLIGHT.md` has 5 rows (R1–R5), none routing to it — so even once built, per this repo's own P82 pattern nothing guarantees it gets *consulted* pre-change, only that it exists and can be run manually.
- **Assumptions**: `verify:governance-wiring[.cjs]` (already used for PACT-001 pattern-wiring checks) can be extended cheaply to also grep-confirm the *presence* of the two textual invariants in their anchor files, rather than building a second bespoke checker.
- **Trade-offs**: A presence-grep is not a behavioral proof (it can't verify an agent actually *applied* the rule in a live session) — but it is strictly better than the current zero, costs one small function, and reuses existing infrastructure (ladder rung 2) instead of adding a 5th script.
- **Risks & Dependencies**: True behavioral verification of a prose invariant is an open problem this repo's own `ICG-001` gate already documents as unsolved ("nothing in this repo intercepts a chat response before it's sent"). Do not over-promise it here.
- **Challenge**: *What would change my mind*: a concrete design for intercepting an agent's response pre-send. None exists in this repo or (per Phase 0 external search) in the surveyed 2026 literature as a turnkey mechanism. Challenge stands — classify full behavioral automation as **Recommended Soon**, not **Required Now**.
- **Confidence**: High on the presence-grep addition; Medium on eventual behavioral automation (no proven mechanism yet).

### 3.4 Maintainability & Velocity Auditor (RFG-001 Burden of Proof)
- **Position**: 3 of the 4 items pass Burden of Proof as **Required Now**; the ticket's blanket "Permanent" framing for all 4 does not.
- **Burden of Proof, applied per item**:
  - `INV-SYSTEMIC-ABSTRACTION-001`: (1) problem exists today — `INC-099`, cited with file/line evidence; (2) existing scan can evolve (one bullet addition) rather than needing a new subsystem; (3) net complexity: near-zero, reduces future debt; (4) deferring costs another silent mock-as-done pass. **Required Now.**
  - `INV-DATA-TRANSIT-001`: same four tests, same evidence (`SK-007`/`INC-099`). **Required Now.**
  - `INV-COUNCIL-GROUND-TRUTH-001` + `verify:pipeline-contracts.cjs`: real problem (`AC-DEC-2026-035`'s own table recorded and ignored a gap), existing council skeleton can evolve (one Phase-2 synthesis rule: "a recorded unbacked-transit gap blocks approval, full stop"), complexity cost is one script that reuses existing test patterns. **Required Now** for the rule; the script is **Required Now** at its currently-scoped size (localStorage-binary grep + shell/fragment dependency parity) — do not expand it further this session.
  - **Calling all four "Permanent"**: fails test (4) — nothing names what would trigger a *re-open* or *retire* of these rules if they prove to add friction without catching real defects (the "Future Extension" / "Speculative" escape hatch this repo's own RFG-001 requires for every recommendation). **Reclassify**: keep enforceable at all times, but log a named review trigger (see §7) rather than declaring permanence unconditionally — permanence is asserted, not demonstrated, at t=0.
- **Trade-offs**: A named review trigger costs one sentence per invariant and prevents this ticket from becoming the next generation's un-reconciled legacy rule (exactly the fate `AC-DEC-2026-048` already suffered).
- **Confidence**: High.

### 3.5 The Dissenter Seat
- **Challenge**: This whole ticket is itself a governance layer being added by an AI agent to govern AI agents, in a codebase with **one developer and 4–5 real users**. `RFG-001`'s own tie-break question — *"Would I still recommend this if the repository never grows beyond its current size?"* — should be asked before ratifying a 4th (soon 5th, with the PREFLIGHT row) permanent verification layer on top of the 15 that already exist in `package.json`. Concrete failure scenario: the next real incident is a *decor vendor payment discrepancy*, not a data-persistence mock — and this session's ceremony (council artifact, ledger row, incident doc, implementation plan, ticket rewrite) cost more solo-developer time than the discrepancy itself would have.
- **What would change my mind**: if the fix set were *not* this cheap. It is: two 1-line prose edits, one incident doc that already existed 90% as inline prose, one script already scoped small in the existing ticket, and one PREFLIGHT row. At this cost, RFG-001 test (3) ("net complexity goes down, not up") holds even under the dissent — the objection is really "don't let this pattern of full-council-ceremony-for-every-correction become the new default," which is a process note (§7), not a reason to reject this specific, cheap fix.
- **Confidence**: Medium (the specific ratification is low-risk; the *precedent* of invoking full-council machinery this readily is the live concern).

---

## 4. Phase 2: Synthesis

**Unanimous agreement**: The 4 safeguards' *underlying diagnosis* (Process-Result Divergence, per `INC-099`) is correct and evidenced. The ticket's *own evidence trail* (citations, certifying decision ID) was itself broken in exactly the way the ticket exists to prevent. Fix the citations and mechanize what can be mechanized now; don't over-build unproven behavioral automation.

**Disagreement**: Auditor 3.3 and the Dissenter differ on how much mechanization to add this session (extend an existing script vs. add nothing new beyond the citation fixes). **Resolved**: extend `verify:governance-wiring.cjs` (existing tool, near-zero net-new surface) rather than building anything new — satisfies both positions.

**Trade-off analysis**: Correcting citations and adding one PREFLIGHT row is cheap and closes a real, demonstrated gap (Required Now). Full behavioral automation of "did the agent actually apply the rule" has no known mechanism in this repo or the surveyed external literature — building it now would be exactly the kind of speculative, unproven-mechanism over-engineering RFG-001 exists to block.

### Recommended Course of Action (Hybrid Design)

| # | Action | RFG-001 Classification | Trigger for re-evaluation |
|---|---|---|---|
| 1 | Correct `SK-012` dependency citations: drop `AC-DEC-2026-048`; cite `AC-DEC-2026-035` (originating decision) and `AC-DEC-2026-056` (this ratification, once certified) | Required Now | N/A — factual correction |
| 2 | Author `docs/incidents/INC-099-*.md` (done this session, see §1.3) | Required Now | N/A — done |
| 3 | Insert `INV-SYSTEMIC-ABSTRACTION-001` as Step 1 bullet 5 in `meta-prompt.md` (repo-specific section only) | Required Now | N/A |
| 4 | Insert `INV-DATA-TRANSIT-001` into `writing-plans/SKILL.md` §4 plan header template (repo-specific block) | Required Now | N/A |
| 5 | Insert `INV-COUNCIL-GROUND-TRUTH-001` as a Phase 2 synthesis rule in `architecture-council.md` (repo-specific block, since the file's shared skeleton is cross-repo-synced) | Required Now | N/A |
| 6 | Build `scripts/verify-pipeline-contracts.cjs` at its currently-scoped size only (localStorage-binary check + shell/fragment parity) | Required Now | If scope grows beyond these 2 checks, re-open via a fresh council pass, don't silently expand |
| 7 | Add `.agent/PREFLIGHT.md` row R6 routing to the new script | Required Now | N/A |
| 8 | Extend `verify:governance-wiring.cjs` to grep-confirm presence of the two textual invariants in their anchor files | Required Now | N/A |
| 9 | Full behavioral automation (proving an agent *applied* a prose rule in a live session, not just that the text exists) | **Recommended Soon** | Fires on: (a) a concrete interception mechanism becomes available in this harness, OR (b) a second real incident recurs despite items 1–8 being live — whichever comes first |
| 10 | Propagate `INV-SYSTEMIC-ABSTRACTION-001` to the shared/cross-repo block of `prompt-clarity/meta-prompt.md` via `/sap-sync` | **Future Extension** | Fires after this repo has run it through ≥1 real symptom-shaped bug report and confirmed it fires correctly |
| 11 | Blanket "Permanent" framing for all 4 safeguards without a sunset/re-open clause | **Rejected as stated** — replaced by items 1–10's per-item triggers | N/A |

**Alternatives considered and rejected**:
- *Building a new standalone checker script for the two prose invariants* (Auditor 3.3's first instinct) — rejected in favor of extending `verify:governance-wiring.cjs`; same test coverage, one fewer script, ladder rung 2 compliance.
- *Deferring the whole ticket as Speculative pending a second incident* (Dissenter's opening position) — rejected; items 1–8 pass Burden of Proof today and cost is genuinely low; only item 9 (behavioral automation) is deferred.
- *Reallocating this work to a new ticket ID (`SK-016`)* — rejected; scope is a correction/tightening of the already-registered `SK-012`, not new feature surface. `enhancement-config.json`'s `next_id: 16` stays untouched.

**Confidence**: High for items 1–8 (cheap, evidenced, narrowly scoped). Medium for the item-9 trigger (no known mechanism yet, so the trigger itself is the best available commitment).

---

## 5. `/plan-review` Gates (executed, not merely referenced)

### As-Is Baseline Audit — Institutional Governance Safeguards Hardening

| File | Lines Inspected | Relevant Existing Logic | Status |
|---|---|---|---|
| `.claude/skills/prompt-clarity/meta-prompt.md` | L31–52 | Step 1 ambiguity scan, 4 existing bullet triggers | LIVE — extend with bullet 5 |
| `.agent/skills/writing-plans/SKILL.md` | L57–80 | Plan Document Header + DoD v1.7 table | LIVE — extend with transit-contract line |
| `.agent/workflows/architecture-council.md` | L197–210 | Phase 2 Synthesis structure (6-part) | LIVE — extend with ground-truth blocking rule |
| `.agent/PREFLIGHT.md` | L6–14 | R1–R5 routing table | LIVE — append R6 |
| `package.json` | L5–45 | 15 existing `verify:*` scripts, none named `pipeline-contracts` | ABSENT — net-new script confirmed non-duplicative |
| `docs/incidents/` | glob result | Highest prior: `INC-098` | ABSENT `INC-099` → AUTHORED this session |
| `Council_Ledger.md` | L1–56 | Tabular ledger, highest `AC-DEC-2026-055` | LIVE — append row for `-056` |

**Capability Existence Check**:
- Proposed: `verify-pipeline-contracts.cjs` — Verdict: **NOT FOUND → PROCEED**.
- Proposed: presence-grep for the two prose invariants — Verdict: **PARTIALLY IMPLEMENTED (as `verify:governance-wiring.cjs`'s pattern-grep mechanism) → EXTEND ONLY**, not a new script.

### Zero-Trust Claim Verification

| Element | Verification | File:Line |
|---|---|---|
| `AC-DEC-2026-048` is not this ticket's decision | Confirmed via `Council_Ledger.md` grep + `260924_Shopping_UI_UPGRADES.md` reconciliation note | `Council_Ledger.md:52` (`AC-DEC-2026-050` is the real Lightbox ruling); `260924_Shopping_UI_UPGRADES.md:868–870` |
| `INC-099` absent pre-session | `Glob docs/incidents/INC-09*.md` returned only `INC-090`–`INC-098` | glob result, this session |
| `verify:governance-wiring.cjs` exists and is extensible | `package.json` L14–15 defines it; script wired into R2/R3 of `.agent/PREFLIGHT.md` | `package.json:14-15`, `.agent/PREFLIGHT.md:11-12` |
| Motivating incident narrative | Verbatim source, not inference | `260918_ShoppingList.md:6615-6690` |
| Highest allocated `AC-DEC-2026-###` before this session | Grep of `Council_Ledger.md`, max value `055` | `Council_Ledger.md` (grep output, this session) |

**Scope Segregation**: Items 1–8 (Required Now) are independently rollback-able edits to 5 files + 1 new script; item 9 (behavioral automation) is explicitly deferred to its own future phase, not bundled into this Phase 1. Confirmed segregated.

### The 5 Lenses Check
- **UX**: N/A — no end-user-facing surface; purely agent/developer-facing process.
- **Workflow Efficiency**: Net positive — fixes broken citations that would otherwise cost a future session a re-discovery cycle.
- **Complexity & Cognitive Load**: Low — 2 prose bullets, 1 synthesis rule, 1 small script, 1 table row, 1 grep extension.
- **Performance Implications**: None (static docs + a CI-time Node script).
- **Implementation Practicality**: High — every target file and line range was read this session (see Baseline Audit above).

### Decision Gate
- [x] All sections completed
- [x] No outstanding **Required-Now** blockers (item 9 explicitly deferred with a named trigger, not silently dropped)
- [x] Confidence ≥80% on Required-Now items (Auditor consensus: High)
- [x] Timeline: Phase 1 (items 1–8) estimated 3–4 hours; ticket's original 4-hour estimate holds with ~15% buffer
- [x] As-Is Baseline Audit table present, populated, cited
- [x] Zero-Trust Claim Verification table present, every row file:line-cited
- [x] Scope Segregation confirmed
- [x] VG/DN structure present for every Phase 1 task (see `implementation_plan.md`)

**Decision**: ☑ **Approved to proceed**

---

## 6. Formal Decision (`AC-DEC-2026-056`)

The Architecture Council **APPROVES & CERTIFIES** the Hybrid Institutional Governance Safeguards design (items 1–8, §4) as `SK-012` Phase 1 scope, and formally defers item 9 (behavioral automation) as **Recommended Soon** and item 10 (cross-repo propagation) as **Future Extension**, each with the named re-open trigger in §4.

### Mandatory Plan Hard-Stop
Per `STD-PLANNING-ENGINE-001` and `prompt-clarity` Step 3: this record stands as the certified architectural decision. The Phase 1 implementation plan (`enhancement-notes/SK-012/implementation_plan.md`) is saved to disk in this same session per explicit user instruction, but **no code or config file listed in items 1–8 is modified in this turn** — execution requires a separate, explicit go-ahead per the Plan Hard-Stop invariant.

---

## 7. Process Notes (ICG-001 #3 — Self-Critique)

- **Gap**: This council's own roster template (`architecture-council.md`) is un-localized Task-Dashboard content, discovered only because this session happened to read it in full.
  **Proposed fix**: Open a follow-up ticket to localize `.agent/workflows/architecture-council.md`'s Council Members and Known High-Risk Surfaces tables to Sree Krushna's actual domains (SDCA modules, Firestore shopping/cockpit collections, `.agent/patterns/`). **Deferred pending approval** — out of this session's scope (would itself need its own council pass).
- **Gap**: The Dissenter Seat's real objection (§3.5) — full-council ceremony being invoked for a fix this cheap — has no standing lighter-weight track in this repo's own "3-question gate / expedited tier" distinction, because all 3 gate questions genuinely answered YES here.
  **Proposed fix**: None needed this session — the gate worked as designed. Noted so a future session doesn't read this ceremony's *size* as precedent for invoking full council on genuinely small corrections that fail the 3-question gate.
- **Gap**: This session could not mechanically verify that `INV-SYSTEMIC-ABSTRACTION-001` and `INV-COUNCIL-GROUND-TRUTH-001`, once inserted, will actually be *applied* by a future agent session (item 9's open status).
  **Proposed fix**: Named trigger recorded in §4, row 9. **Deferred pending approval**, by design — no false claim of automation made.

**Verbatim Challenge quotes carried into synthesis** (ICG-001 #3): Auditor 3.1 ("*fails the very evidence-integrity standard it exists to enforce*"), Auditor 3.3 ("*a direct recurrence of INC-077's 'Protocol Decoupling' finding, inside the very ticket meant to close it*"), Dissenter 3.5 ("*this session's ceremony... cost more solo-developer time than the discrepancy itself would have*").

---

## Sources (external corroboration, Phase 0 §8)
- [DEMM-Bench: A Cross-Regime Benchmark for Agent-Runtime Governance-Evidence Sufficiency](https://arxiv.org/pdf/2606.20634)
- [Decision Evidence Maturity Model for Agentic AI: A Property-Level Method Specification](https://arxiv.org/pdf/2605.04093)
- [Runtime Verification for AI Agents in 2026: Policies, Sandboxes, and Safe Execution](https://thebackenddevelopers.substack.com/p/runtime-verification-for-ai-agents)
