# ENHANCEMENT_PROTOCOL.md — Sree Krushna Standard

This document defines the governance for creating, tracking, and verifying enhancements within the Sree Krushna Marriage OS repository. It follows the Domain-Based Cluster Model used in the `Task-Dashboard`, `PIOperationsMgmt_Firebase`, `Capsicum`, and `BMS` ecosystem.

## 🏗️ Backlog Architecture: The Cluster Model

- **Master Registry**: [ENHANCEMENT-MASTER-REGISTRY.md](./ENHANCEMENT-MASTER-REGISTRY.md) (The system index)
- **Domain Clusters**: Backlog items are stored in domain-specific files to minimize context load for agents:
    - [UI Quality Cluster](./docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md) (Visual design, layout, theme tokens, responsiveness, 300px mobile)
    - [Infrastructure Cluster](./docs/enhancements/INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md) (Architecture, compilers, scripts, CI/CD, hosting)
    - [Governance Cluster](./docs/enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md) (Protocols, workflows, SSOT reconciliation, 4-PPSD rules)
    - [Business Logic Cluster](./docs/enhancements/BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md) (Rituals, timeline events, guests, vendors, logistics, financials)

## 📋 Enhancement Lifecycle

<!-- shared:std.enhancement.lifecycle:start -->
### 1. Registration
- **Dependency Check**: Before scaffolding, MUST search the Master Registry (`ENHANCEMENT-MASTER-REGISTRY.md`) and Domain Cluster files for keywords related to the new feature to identify overlapping contexts or dependencies.
- **Simple Enhancements (≤ 2 days)**: Add a lean entry to the appropriate Cluster file.
- **Complex Enhancements (> 2 days)**:
    - Create a tracked folder in `enhancement-notes/`.
    - Create `00_ENHANCEMENT_INDEX.md` using the standard template.
    - Declare all dependencies explicitly (e.g. `Depends On: None (Foundational)` or specific IDs like `Depends On: SK-001`). Empty arrays `[]` are prohibited.
    - Register in the Master Registry and appropriate Cluster file.
- **ID Governance**: ID governance is managed via `enhancement-config.json` at repo root.
  This file must exist and define `canonical_prefix` and `next_id` before scaffolding
  can proceed. See [enhancement-scaffolder](.agent/skills/enhancement-scaffolder/SKILL.md)
  for enforcement logic.

### 2. Organizational Rationale (The "Why")
The use of dedicated tracking folders for complex work is enforced to ensure:
- **Knowledge Transfer**: Detailed technical context is maintained for future agents/users.
- **Audit Trail**: A complete record of architectural and implementation decisions.
- **Maintainability**: Future modifications have a clear roadmap and testing procedures.
- **Quality Assurance**: Prevents "Implementation Drift" by enforcing measurable success criteria.
<!-- shared:std.enhancement.lifecycle:end -->

## Prefix Governance
- **Native Prefix**: `SK-NNN` (Unique to this repository).
<!-- shared:std.enhancement.prefix-governance:start -->
- **Foreign References**: `TASK-NNN`, `PIO-NNN`, `CAP-NNN`, or `BMS-NNN` (Used when referencing or porting from other SAP repositories).
- **Cluster Tags**: `[UI-QUALITY]`, `[INFRA]`, `[GOVERNANCE]`, `[BUSINESS-LOGIC]`
<!-- shared:std.enhancement.prefix-governance:end -->

## ✅ Definition of Done (v1.7 Standard)

> **Constraint**: ALL criteria must be verified before marking an enhancement as COMPLETED.

<!-- shared:std.enhancement.dod-v1.7:start -->
### 🛡️ 4-Tier Verification Matrix

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax/Lint | 100% clean console, no lint errors, valid JSON schemas. |
| **T2** | **Functional** | Logic/UI | Verified via integration test, manual walkthrough, or visual inspection. |
| **T3** | **Integrated** | State/Flow | Verified end-to-end data chain (State → Storage/Firestore → UI Views). |
| **T4** | **Standard** | Governance | 100% compliance with `npm run verify:governance-wiring:all` and linked PIRR artifact with evidence populated in each category. |
<!-- shared:std.enhancement.dod-v1.7:end -->

<!-- shared:std.enhancement.cascading-rules:start -->
### 🔄 Cascading Rules
1. **Extraction Before Deletion**: Any logic/structure being replaced must be extracted to an Enhancement Note before removal.
2. **SSOT Synchronicity**: Documentation must be updated in the same session as code changes (AOS Phase C).
3. **No Disposable Scripts**: Test scripts must be semi-permanent and semantic (no `temp.js`).
4. **Return Discipline**: Phase completion requires surfacing the actual content of material artifacts, not descriptions of changes made. Confirmation that a file was edited is not a reviewable artifact. The file content is.
5. **Cluster Health Threshold**: Any Domain Cluster exceeding 800 lines triggers a mandatory domain-split review before new entries are added.
6. **Pre-Execution Manifest for High-Risk Operations**: Operations classified as high-risk — including prefix changes, bulk renames, deletions, and cross-file replacements — require a pre-execution manifest returned for approval before any command runs.
<!-- shared:std.enhancement.cascading-rules:end -->

---
**Status**: 🔵 ACTIVE (v1.7)  
**Guardian**: [AOS Phase Gate Governance](.agent/workflows/aos-session-open.md)