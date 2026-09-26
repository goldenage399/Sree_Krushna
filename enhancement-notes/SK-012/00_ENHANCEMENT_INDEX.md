# SK-012: Institutional Governance Safeguards & Anti-Performative Pipeline Verification Gate

## 📊 Metadata

- **Category**: GOVERNANCE / QUALITY_GATE / ARCHITECTURE_INTEGRITY
- **Priority**: HIGH
- **Status**: IN PROGRESS — Phase 1/3 complete (2026-09-26), Phase 2 (Council Protocol Hardening) next
- **Estimate**: 4 hours (Phase 1, ~15% buffer per `/plan-review` Decision Gate)
- **Target Release**: v2.6.0
- **Risk Level**: LOW
- **Owner**: goldenage399
- **Cluster**: `[GOVERNANCE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-008  # Universal Canonical Planning Engine & Cross-Repo SAP Synchronization (COMPLETED)
    - SK-010  # Universal UI Button Primitives & Pre-Flight Design System Verification Gate (IMPLEMENTED)
  related:
    - AC-DEC-2026-035  # Tri-Modal Visual Intake — the originating decision whose own evidence table recorded the unbacked-transit gap (see INC-099)
    - AC-DEC-2026-056  # Institutional Governance Safeguards Hardening Review — the actual certifying decision for THIS ticket (corrects the prior stale AC-DEC-2026-048 citation, which was already allocated to the unrelated Lightbox Carousel decision, AC-DEC-2026-050)
    - AC-DEC-2026-044  # Universal Canonical Planning Engine Invariant
    - docs/incidents/INC-099-mock-persistence-and-intake-preview-hierarchy-blind-spot.md  # authored 2026-09-26 alongside AC-DEC-2026-056
    - User_Created/Discussion Threads/Council/260926_arch_council_institutional_governance_safeguards_hardening.md  # full council record: roster, evidence, /plan-review gates
    - .agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md
    - .agent/patterns/mock-first-boundary-contract-lock.md
  superseded_or_dropped:
    - docs/references/SPEC-ARCH-GOVERNANCE-SAFEGUARDS-001.md  # never authored; AC-DEC-2026-056 + INC-099 serve as the SSoT instead — do not re-create this file without a fresh Burden-of-Proof pass
  blocks:
    - None
```

> **Note (2026-09-26, `AC-DEC-2026-056`)**: This ticket's original dependency block cited `AC-DEC-2026-048` as its certifying decision. That ID was already allocated to an unrelated proposal (Lightbox Carousel, reconciled to `AC-DEC-2026-050`) — these safeguards had never actually been put before a council. See the hardening review above for the full evidence trail and the corrected, hybrid Phase 1 scope (items 1–8 below reflect it; item 9 — full behavioral automation of the two prose invariants — is explicitly deferred as **Recommended Soon**, not built in Phase 1).

---

## 🎯 Goal

Eliminate the "Process-Result Divergence" (Performative Governance) instance documented in `INC-099`, where high-ceremony processes (Prompt Clarity, Definition of Done, Plan Review, Architecture Councils, and syntax gates) passed 100% green while certifying an unbacked client mock (`localStorage` Base64 image intake) and treating a systemic architectural gap with a single-entity symptomatic Band-Aid — **without over-building unproven behavioral automation** (see `AC-DEC-2026-056` Recommended Soon / Future Extension classification below):

1. **Prompt Clarity Invariant (`INV-SYSTEMIC-ABSTRACTION-001`)**: Codify in `meta-prompt.md` Step 1 (bullet 5, alongside the existing "Goal vs. means confusion" trigger) that single-entity bug reports (e.g. missing items, prices, options) MUST trigger an end-to-end pipeline persistence audit before offering any single-entity patch.
2. **Physical Storage & Transit Contract Gate (`INV-DATA-TRANSIT-001`)**: Mandate in `writing-plans/SKILL.md` §4 (Plan Document Header) that all multi-device user intake features declare physical storage target, multi-device transit paths, and strictly prohibit storing binary/Base64 files in `localStorage`.
3. **Evidence-First Architecture Council Invariant (`INV-COUNCIL-GROUND-TRUTH-001`)**: Add as a Phase 2 Synthesis rule in `architecture-council.md` (repo-specific block) that councils cannot ratify an architectural design if the data transit path is unbacked or labeled as an open gap without blocking release.
4. **Automated Pipeline Contract Gate Script (`scripts/verify-pipeline-contracts.cjs`)**: Implement an automated CI gate checking for binary media in `localStorage` and asserting dependency parity between standalone shells (`shopping-registry.html`, `decorator-cockpit.html`) and SPA fragments. Route it through a new `.agent/PREFLIGHT.md` R6 row (matches this repo's existing P82 routing pattern for every other gate).
5. **Governance-Wiring Extension (not a new script)**: Extend the already-existing `verify:governance-wiring.cjs` (used for PACT-001 pattern wiring) to grep-confirm items 1–3 are textually present at their anchor points — reuses existing infrastructure instead of adding a 5th checker script.

**Explicitly deferred** (see `AC-DEC-2026-056` §4 for full rationale and re-open triggers — not silently dropped):
- **Recommended Soon**: Full behavioral automation proving an agent *applied* (not just that the text exists for) invariants 1–3 in a live session. No interception mechanism exists in this repo or in the surveyed 2026 agent-governance literature yet.
- **Future Extension**: Propagating `INV-SYSTEMIC-ABSTRACTION-001` to the shared/cross-repo block of `prompt-clarity/meta-prompt.md` via `/sap-sync`, once proven in ≥1 real incident here.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

> Full council review, `/plan-review` gates (As-Is Baseline Audit, Zero-Trust Claim Verification, Scope Segregation, Decision Gate), and evidence trail: `User_Created/Discussion Threads/Council/260926_arch_council_institutional_governance_safeguards_hardening.md` (`AC-DEC-2026-056`). Detailed 5-step TDD tasks for Phase 1 only: `enhancement-notes/SK-012/implementation_plan.md`.

### Phase 1: Prompt Clarity & Planning Engine Codification ✅ COMPLETE (2026-09-26)
- [x] **Prompt Clarity Codification (`INV-SYSTEMIC-ABSTRACTION-001`)**: Inserted as Step 1 bullet 5 in `.claude/skills/prompt-clarity/meta-prompt.md` and mirrored to `.agent/skills/prompt-clarity/meta-prompt.md` — commit `b44506c`.
- [x] **Planning Engine Codification (`INV-DATA-TRANSIT-001`)**: Inserted as item 2 in `.agent/skills/writing-plans/SKILL.md`'s repo-specific "Repository Extensions" block (subsequent items renumbered 2–3 → 4–5) — commit `9cf1a3a`. (No `.claude/` mirror exists for `writing-plans`; single canonical file confirmed via glob.)
- [x] **Validation Gate (VG-1)**: `diff -rq .claude/skills/prompt-clarity .agent/skills/prompt-clarity` → empty (exit 0). `npm run verify:governance-wiring` → exit 0. Both invariant strings confirmed present via `grep`.

### Phase 2: Architecture Council Protocol Hardening
- [ ] **Council Protocol Update (`INV-COUNCIL-GROUND-TRUTH-001`)**: Insert a blocking Phase 2 Synthesis rule into `.agent/workflows/architecture-council.md`'s repo-specific block (below L224, "Task-Dashboard-specific elaboration") requiring wire-level physical proof before certifying cross-device or intake capabilities.
- [x] **Incident Documentation**: `docs/incidents/INC-099-mock-persistence-and-intake-preview-hierarchy-blind-spot.md` — authored 2026-09-26 during the `AC-DEC-2026-056` council session.
- [ ] **Validation Gate (VG-2)**: Grep confirms the new blocking-rule text is present in `architecture-council.md`; manual review confirms it sits in the repo-specific (not shared-sync) block.

### Phase 3: Automated Pipeline Contract Gate (`scripts/verify-pipeline-contracts.cjs`)
- [ ] **Static Gate Development**: Create `scripts/verify-pipeline-contracts.cjs` verifying:
  - No client controller stores Base64 images directly into `localStorage`.
  - Standalone shells (`shopping-registry.html`, `decorator-cockpit.html`) load the same Firestore/Auth modules as the SPA fragments.
- [ ] **Package.json Integration**: Add `"verify:pipeline-contracts": "node scripts/verify-pipeline-contracts.cjs"` and wire into `verify:governance-wiring:all`.
- [ ] **PREFLIGHT Routing**: Add row `R6` to `.agent/PREFLIGHT.md` routing "modifying client-side media intake code" to this gate (matches the existing R1–R5 pattern).
- [ ] **Governance-Wiring Extension**: Extend `scripts/verify-governance-wiring.cjs` with a presence-check for the Phase 1/2 prose invariants (no new script file).
- [ ] **Validation Gate (VG-3)**: Synthetic test with a simulated Base64 `localStorage` write triggers build failure; current codebase passes cleanly; `.agent/PREFLIGHT.md` R6 row present; `verify:governance-wiring` reports both prose invariants found.

### Phase 4 (Recommended Soon, not scheduled): Behavioral Automation
- [ ] Deferred per `AC-DEC-2026-056` — re-opens when a concrete agent-response-interception mechanism becomes available, OR a second real symptom-shaped incident recurs despite Phases 1–3 being live. Do not begin without a fresh Burden-of-Proof pass.
