# SK-027: Empirical Multi-Repo Adoption Gate, Zero-Config Discovery & Anti-Process-Theater Governance (STD-EMPIRICAL-ADOPTION-001 / INV-PROVE-BEFORE-CLAIM-001 / STD-ZERO-CONFIG-DISCOVERY-001)

## 📊 Metadata

- **Category**: GOVERNANCE / DEV_VELOCITY / TOOLING
- **Priority**: HIGH
- **Status**: COMPLETED
- **Estimate**: 8 hours
- **Target Release**: v2.9.5
- **Risk Level**: LOW (Tooling and governance refinement; zero regression risk to runtime wedding application)
- **Owner**: goldenage399
- **Cluster**: `[GOVERNANCE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-019  # Session Acceleration Infrastructure & Universal Taxonomy Engine
    - SK-026  # Universal Dual-Council Governance Protocol & 7-Domain UI/UX Interaction Pre-Flight Engine
  related:
    - AC-DEC-2026-069  # Empirical Multi-Repo Adoption Gate & Anti-Process-Theater Governance
    - GOV-DEC-2026-004  # Council Decision Reference
    - RFG-001          # Reality-First Grounding Policy
    - Review 3.7       # WritingPlans Review 3.7 Searing Critique
  blocks:
    - None
```

---

## 🎯 Goal

Directly and structurally resolve the systemic failure mode exposed by Review 3.7 (`User_Created/Discussion Threads/Skill_Improvement/260924_WritingPlans.md:L2237-L2249`): **claiming ecosystem-wide adoption and cross-repo portability across 9 repositories without ever executing or verifying the tool in a single real second repository.**

This initiative achieves 4 concrete objectives:
1. **Empirical Adoption Gate (`INV-PROVE-BEFORE-CLAIM-001` / `STD-EMPIRICAL-ADOPTION-001`)**:
   - Establish an ironclad invariant: No tool, standard, or pattern may be classified, documented, or advertised as "Ecosystem-Wide Adopted" or "Cross-Repo Portable" without a verified, passing terminal execution against at least ONE real sibling repository on disk.
2. **Zero-Config Discovery Engine Upgrade (`STD-ZERO-CONFIG-DISCOVERY-001`)**:
   - Upgrade `scripts/generate-domain-graph.cjs` to eliminate hardcoded Sree Krushna wedding defaults.
   - Auto-detect repository identity (`project_name` / `repo`) and canonical entity prefix (`id_prefix` / `canonical_prefix`) directly from `enhancement-config.json` (present in all repos in the ecosystem).
   - Auto-scan root-level markdown files (`ENHANCEMENTS.md`, `README.md`, `CLAUDE.md`, `DOCS_HUB.md`) and standard documentation directories without requiring manual config authoring.
   - Enforce strict uppercase prefix validation (`^[A-Z]{2,6}$`) on frontmatter `fm.id` to eradicate entity noise (e.g. `page-`, `modal-`, `flex-`).
3. **Real Empirical Sibling Pilot Onboarding**:
   - Execute and verify the zero-config discovery engine against real sibling repositories `OperatusOS` (`d:\GitHub_Repo\OperatusOS`) and `Task-Dashboard` (`d:\GitHub_Repo\Task-Dashboard`).
   - Validate that clean, non-zero entity knowledge graphs are generated in under 10 seconds with zero manual configuration.
4. **Anti-Process-Theater Claim Pruning & Governance Truthfulness**:
   - Audit and reconcile all documentation (`docs/SYSTEM_CLARITY_SNAPSHOT.md`, `GEMINI.md`, `CLAUDE.md`, `enhancement-notes/`) to strip speculative, unearned claims and accurately record verified empirical status.
   - Formulate the authoritative, razor-sharp response in `User_Created/Discussion Threads/Skill_Improvement/260924_WritingPlans.md` under `Response 3.7 -`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Zero-Config Discovery Engine Upgrade & Real Sibling Onboarding Pilot
- [x] **Config Auto-Detection**: Update `scripts/generate-domain-graph.cjs` to inspect `enhancement-config.json` at the target root to auto-populate `repoName` and `canonicalPrefixes` (e.g. `OPS`, `TASK`, `AGR`).
- [x] **Adaptive Source File Discovery**: Enhance `findSourceFiles` to automatically discover and scan root-level markdown files (`ENHANCEMENTS.md`, `README.md`, `CLAUDE.md`, `DOCS_HUB.md`) and general documentation folders when Sree Krushna wedding folders are absent.
- [x] **Strict Entity Prefix Validation**: Guard frontmatter `fm.id` intake with regex `^[A-Z]{2,6}(-[A-Za-z0-9_-]+)?$` to prevent CSS layout classes (`page-`, `modal-`, `flex-`) from being misidentified as canonical domain entities.
- [x] **Empirical Onboarding of `OperatusOS`**: Execute `node scripts/generate-domain-graph.cjs --root d:/GitHub_Repo/OperatusOS` and verify that `OPS-###` entities are cleanly indexed from `ENHANCEMENTS.md` with 0 manual configuration.
- [x] **Empirical Validation of `Task-Dashboard`**: Execute against `d:/GitHub_Repo/Task-Dashboard` and verify clean entity compilation with zero noisy layout classes.
- [x] **Validation Gate (VG-1)**: Both sibling repositories generate valid `GRAPH_REPORT.md` and `graph.json` with >0 valid entities (39 in OperatusOS, 88 in Task-Dashboard) and 0 noise nodes in <10 seconds.

### Phase 2: Empirical Adoption Gate Codification & Automated CI Guard
- [x] **Automated Adoption Verification Script (`scripts/test-cross-repo-adoption.cjs`)**:
  - Author a zero-dependency automated test that tests `generate-domain-graph.cjs` against at least one real sibling repo on disk (e.g. `OperatusOS`).
  - Asserts exit code 0, non-zero nodes, and non-zero files discovered.
- [x] **Standards Catalog Registration**: Register `STD-EMPIRICAL-ADOPTION-001` and `STD-ZERO-CONFIG-DISCOVERY-001` in `.agent/standards-catalog.json`.
- [x] **Invariant Codification**: Codify `INV-PROVE-BEFORE-CLAIM-001` in `GEMINI.md` and `CLAUDE.md`.
- [x] **Validation Gate (VG-2)**: `node scripts/test-cross-repo-adoption.cjs` passes 100% green; governance wiring passes without error.

### Phase 3: Documentation Truthfulness, Unearned Claim Pruning & Review 3.7 Resolution
- [x] **Documentation Audit & Pruning**:
  - Reconcile `docs/SYSTEM_CLARITY_SNAPSHOT.md` to classify `repo-taxonomy-graph` status honestly: `Verified Local SSOT (Sree_Krushna)` and `Verified Sibling Pilot (OperatusOS, Task-Dashboard)`.
  - Prune speculative phrases ("adopted across 9 repos via /sap-sync") from past tickets and indexes.
- [x] **Author Response 3.7 in WritingPlans**:
  - Complete `User_Created/Discussion Threads/Skill_Improvement/260924_WritingPlans.md` under `Response 3.7 -` with the comprehensive, evidence-grounded breakdown and concrete remediation.
- [x] **Validation Gate (VG-3)**: All documentation reflects physical reality; `npm run verify:governance-wiring:all` passes 100% green.

