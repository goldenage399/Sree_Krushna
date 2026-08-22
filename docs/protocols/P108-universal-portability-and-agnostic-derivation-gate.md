# P108 — Universal Portability & Agnostic Derivation Gate

**Protocol ID**: `P108`  
**Classification**: Prime Invariant / Ecosystem Portability  
**Applies To**: All ecosystem repositories (`Task-Dashboard`, `PIOperationsMgmt_Firebase`, `Capsicum`, `BMS`, `UG-Farmhouse`, `QSR`, `DashBoard`, `Inventory_Mgmt`, `SupervisorComplianceMonitoring`, `Unified_Uploader`, `Sree_Krushna`)  
**Version**: 1.0 (2026-08-22)

---

## 1. Prime Principle: No Blind Copying & Strict Agnostic Derivation

Whenever knowledge, workflows, skills, or tooling are ported from one repository to another via SAP sync or manual migration:
1. **Zero Blind Copying**: Never copy a repo-specific file with hardcoded internal collection names, component filenames, or private domain structures directly into another repository.
2. **Agnostic Abstraction First**: If a pattern, workflow, or skill from a sibling repository contains a valuable principle, it must first be abstracted into a **parameterized, domain-agnostic specification** in `.agent/workflows/portable/` or `.agent/patterns/`.
3. **Reference Over Replication**: Spokes must reference the portable standard and adapt local bindings through configuration/frontmatter rather than duplicating raw source implementations.
4. **Shared Marker Block Integrity**: Shared marker blocks (`<!-- shared:std... -->`) must contain strictly universal invariants (such as DoD v1.7, 4-PPSD rules, ID formatting, prefix governance). They must NEVER encapsulate repo-private entity models.

---

## 2. The 3-Tier Portability Classification Gate

All governance assets must be explicitly classified into one of three tiers:

### 🟢 Tier 1: Universal / Agnostic (Deploy Everywhere)
- **Definition**: Pure methodology, problem-solving disciplines, core councils, and universal UI/UX polish standards that apply universally regardless of tech stack or business domain.
- **Roster**:
  - `plan.md`, `plan-review.md`, `sap-sync.md`
  - `ui-council.md` (featuring `impeccable`), `architecture-council.md`
  - `ssot-reconciliation.md`, `ssot-reconciliation-lite.md`
  - `post-incident-governance.md`, `post-incident-governance-lite.md`, `post-incident-analysis.md`, `postmortem.md`
  - `systematic-debugger`, `prompt-clarity`, `pin-branch`, `mermaid-skill`
  - `ui-ux-pro-max`, `frontend-design`, `ui-design-validator`, `mobile-ui-validator`, `parent-layout-audit`
  - `impeccable`, `site-architecture`, `web-design-guidelines`, `high-end-visual-design`
  - All 62+ Protocols, 86 INCs, and 60 PACT-001 patterns.

### 🟡 Tier 2: Stack-Conditioned (Deploy Conditionally)
- **Definition**: Tooling and workflows that require specific runtime environments or frameworks. Deployed only when the target repository's stack fingerprint matches.
- **Fingerprint Matrix**:
  - **Firebase / Firestore**: Deployed only if `firebase.json` or `firestore.rules` is present (`deploy-firebase.md`, `db-inspect.md`, `firebase-firestore` skill).
  - **Google Apps Script**: Deployed only if `.clasp.json` or `appsscript.json` is present (`gas-deploy-guard`, `gas-optimizer`, `writejournal-audit-gate`).
  - **Web SPA / React**: Deployed only if `package.json` specifies a browser SPA framework (`web-deployment-gate.md`, `shadcn.md`, `vercel-react-best-practices`).

### 🔴 Tier 3: Repo-Bound / Private (Strictly Isolated to Source)
- **Definition**: Workflows and skills tightly coupled to internal collections, domain-specific state machines, or private pages.
- **Enforcement**: Must be blacklisted in `bootstrap-spoke-governance.cjs` and NEVER copied to spokes.
- **Examples**:
  - `ingest-recurring-checklist.md` (Private to Task-Dashboard checklist templates)
  - `task-backlog-inventory.md` (Private to Task-Dashboard backlog models)
  - `cos-invoke.md`, `cos-orchestrator`, `cos-safe-refactor`, `cos-integration-verifier` (Private to Task-Dashboard COS engine)
  - `admin-component-contracts` (Private to Task-Dashboard `AdminShell.jsx`)
  - `india-corp-compliance-pack` (Private to BMS)

---

## 3. Automated Validation & Preflight Enforcement

- **Preflight Gate (R14)**: `verify-governance-wiring.cjs` verifies that no spoke contains orphaned, unwired, or repo-polluting workflows.
- **Bootstrap Guard**: `bootstrap-spoke-governance.cjs` must execute the 3-Tier Classification Gate on every synchronization run.
