# SK-012: Institutional Governance Safeguards & Anti-Performative Pipeline Verification Gate

## 📊 Metadata

- **Category**: GOVERNANCE / QUALITY_GATE / ARCHITECTURE_INTEGRITY
- **Priority**: HIGH
- **Status**: PLANNING
- **Estimate**: 4 hours
- **Target Release**: v2.6.0
- **Risk Level**: LOW
- **Owner**: goldenage399
- **Cluster**: `[GOVERNANCE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-008  # Universal Canonical Planning Engine & Cross-Repo SAP Synchronization
    - SK-010  # Universal UI Button Primitives & Pre-Flight Design System Verification Gate
  related:
    - AC-DEC-2026-044  # Universal Canonical Planning Engine Invariant
    - AC-DEC-2026-048  # Institutional Governance Safeguards & Anti-Performative Gate
    - docs/incidents/INC-099-mock-persistence-and-intake-preview-hierarchy-blind-spot.md
    - docs/references/SPEC-ARCH-GOVERNANCE-SAFEGUARDS-001.md
    - .agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md
    - .agent/patterns/mock-first-boundary-contract-lock.md
  blocks:
    - None
```

---

## 🎯 Goal

Permanently eliminate the "Process-Result Divergence" (Performative Governance) where high-ceremony processes (Prompt Clarity, Definition of Done, Plan Review, Architecture Councils, and syntax gates) pass 100% green while certifying unbacked client mocks and treating systemic architectural gaps with single-entity symptomatic Band-Aids:
1. **Prompt Clarity Invariant (`INV-SYSTEMIC-ABSTRACTION-001`)**: Codify in `meta-prompt.md` and `prompt-clarity/SKILL.md` that single-entity bug reports (e.g. missing items, prices, options) MUST trigger an end-to-end pipeline persistence audit before offering any single-entity patch.
2. **Physical Storage & Transit Contract Gate (`INV-DATA-TRANSIT-001`)**: Mandate in `writing-plans/SKILL.md` that all multi-device user intake features declare physical storage target, multi-device transit paths, and strictly prohibit storing binary/Base64 files in `localStorage`.
3. **Evidence-First Architecture Council Invariant (`INV-COUNCIL-GROUND-TRUTH-001`)**: Enforce that councils cannot ratify an architectural design if the data transit path is unbacked or labeled as an open gap without blocking release.
4. **Automated Pipeline Contract Gate Script (`scripts/verify-pipeline-contracts.cjs`)**: Implement an automated CI gate checking for binary media in `localStorage` and asserting dependency parity between standalone shells (`shopping-registry.html`, `decorator-cockpit.html`) and SPA fragments.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Prompt Clarity & Planning Engine Codification
- [ ] **Prompt Clarity Codification (`INV-SYSTEMIC-ABSTRACTION-001`)**: Update `.agent/skills/prompt-clarity/meta-prompt.md` and `.agent/skills/prompt-clarity/SKILL.md` with the Symptom vs. Capability Abstraction rule.
- [ ] **Planning Engine Codification (`INV-DATA-TRANSIT-001`)**: Update `.agent/skills/writing-plans/SKILL.md` to include the mandatory Physical Storage & Transit Contract section in all TDD plans.
- [ ] **Validation Gate (VG-1)**: Validate that `meta-prompt.md` and `writing-plans/SKILL.md` contain zero syntax discrepancies and pass governance verification.

### Phase 2: Architecture Council Protocol Hardening
- [ ] **Council Protocol Update (`INV-COUNCIL-GROUND-TRUTH-001`)**: Update `.agent/workflows/architecture-council.md` to require wire-level physical proof before certifying cross-device or intake capabilities.
- [ ] **Incident Documentation**: Author `docs/incidents/INC-099-mock-persistence-and-intake-preview-hierarchy-blind-spot.md` detailing the root causes and preventative invariants.
- [ ] **Validation Gate (VG-2)**: Verify council template enforces the blocking condition for unbacked data paths.

### Phase 3: Automated Pipeline Contract Gate (`scripts/verify-pipeline-contracts.cjs`)
- [ ] **Static Gate Development**: Create `scripts/verify-pipeline-contracts.cjs` verifying:
  - No client controller stores Base64 images directly into `localStorage`.
  - Standalone shells (`shopping-registry.html`, `decorator-cockpit.html`) load the same Firestore/Auth modules as the SPA fragments.
- [ ] **Package.json Integration**: Add `"verify:pipeline-contracts": "node scripts/verify-pipeline-contracts.cjs"` and wire into `verify:governance-wiring:all`.
- [ ] **Validation Gate (VG-3)**: Synthetic test with a simulated Base64 `localStorage` write triggers build failure; current codebase passes cleanly.
