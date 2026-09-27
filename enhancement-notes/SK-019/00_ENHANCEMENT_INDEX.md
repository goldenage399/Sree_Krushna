# SK-019: Universal Cross-Repository Graph, Taxonomy & Session Acceleration Engine

> **Ticket ID**: `SK-019`  
> **Standard References**: `STD-UNIVERSAL-TAXONOMY-001` / `STD-PCL-001` / `P-SESSION-ACCELERATION-001` / [`.agent/patterns/universal-repository-taxonomy-and-discovery-graph.md`](../../.agent/patterns/universal-repository-taxonomy-and-discovery-graph.md)  
> **Package Identifier**: `PKG-006`  
> **Certifying Decision**: `AC-DEC-2026-060` (`GOV-DEC-2026-002`)  
> **Cluster**: Governance / Cross-Repo Agent Infrastructure  
> **Tier**: Complex  
> **Status**: `COMPLETED`  
> **Target Release**: `v2.9.0`  
> **Branch**: `main`  
> **Registered**: 2026-09-26  
> **Completed**: 2026-09-27  

---

## 1. Executive Summary & Problem Statement

During the Response 1.0 session (family obligation data-contract exercise), discovering repository architecture required **18 sequential tool calls** because acceleration resources (`DOCS_HUB.md`, `graphify-out/`, `docs/SYSTEM_CLARITY_SNAPSHOT.md`) were either bypassed, missing, or reliant on broken external Python dependencies (`scratch/finalize_graph.py`).

Furthermore, across the 9 SAP repositories (`Task-Dashboard`, `Sree_Krushna`, `BMS`, `Capsicum`, `PIO`, `UG-Farmhouse`, `QSR`, etc.), **taxonomy and vocabulary drift** creates compounding friction:
- Concepts are phrased inconsistently (e.g., `"Definition of Done"` vs. `"Signoff Checklist"`; `"Validation Gate"` vs. `"Assert Step"`; `"Spoke & Wheel"` vs. `"Parent/Child"`).
- Entity identifiers and domain hubs are discovered via repetitive multi-turn directory crawling.
- Graphing tools are fragmented: `repo-task-dependency-grapher` graphs backlog tasks, `validate-task-graph.cjs` validates task DAGs, while domain entity graphs (`EVT`, `RIT`, `TRS`, `PAY`, `GFT`) had zero automated discovery tooling.

---

## 2. Goal & Unified Architecture

Build the **Universal Cross-Repository Graph, Taxonomy & Session Acceleration Engine (`STD-UNIVERSAL-TAXONOMY-001` / `PKG-006`)** consisting of:

1. **Canonical Cross-Repo Taxonomy Matrix (`taxonomy_dictionary.json`)**:
   A declarative dictionary of standardized terms, canonical phrases, and prohibited synonym aliases enforced via automated linting (`scripts/verify-taxonomy-vocabulary.cjs`).
2. **Repo-Agnostic Domain Entity Graph Generator (`scripts/generate-domain-graph.cjs`)**:
   A zero-dependency CommonJS scanner configured via `.agent/domain-graph-config.json` that traverses any repo's hub/spoke documents, builds an entity adjacency matrix, and emits `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json`.
3. **Universal Session Startup Gate (`<!-- shared:std.session.preflight-acceleration -->`)**:
   Standardized SAP block in `GEMINI.md` and `aos-session-open.md` mandating an unconditional `DOCS_HUB.md` read before any domain exploration.
4. **Portable SAP Distribution Package (`.agent/skills/repo-taxonomy-graph/`)**:
   Turnkey parameterized package distributable across all 9 SAP repos via `/sap-sync`.

---

## 3. Sequential Phased Definition of Done (DoD v1.7 Standard)

### Phase 1: Local Sree_Krushna Baseline & Domain Graph Generator
- **T1 (Static)**: Clean CommonJS syntax; zero external dependencies; passes `node --check scripts/generate-domain-graph.cjs`.
- **T2 (Functional)**: Unit test suite `scripts/test-domain-graph.cjs` verifies regex link extraction, frontmatter parsing, edge directionality, and missing reference detection.
- **T3 (Integrated)**: Running `node scripts/generate-domain-graph.cjs` emits `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json` mapping all 9 domain hubs and active entity prefixes (`EVT`, `RIT`, `TRS`, `PER`, `FAM`, `PAY`, `GFT`, etc.).
- **T4 (Governance)**: `package.json` registers `build:graph`; `DOCS_HUB.md` indexes `graphify-out/GRAPH_REPORT.md`.

**Validation Gate (VG)**: `node scripts/test-domain-graph.cjs` exits 0 AND `graphify-out/GRAPH_REPORT.md` contains ≥100 canonical entity nodes.

---

### Phase 2: Canonical Cross-Repo Taxonomy Matrix & Vocabulary Linter (COMPLETE)
- [x] **T1 (Static)**: Author `.agent/taxonomy_dictionary.cjs` with SAP dual-block markers declaring canonical domain vocabulary, standardized prefixes, and prohibited synonym tables.
- [x] **T2 (Functional)**: Author `scripts/test-taxonomy-linter.cjs` and `scripts/verify-taxonomy-vocabulary.cjs` scanning documentation and governance notes for prohibited synonym violations.
- [x] **T3 (Integrated)**: Author `docs/SYSTEM_CLARITY_SNAPSHOT.md` capturing active incidents, releases, and the 8 unresolved items from Response 1.0 using 100% canonical taxonomy.
- [x] **T4 (Governance)**: Wire `verify:taxonomy` and `test:taxonomy` into `package.json` and index snapshot in `DOCS_HUB.md`.

**Validation Gate (VG)**: `node scripts/verify-taxonomy-vocabulary.cjs` runs across all `.md` files and exits 0 with zero prohibited synonyms. (PASSED - 236 files clean)

---

### Phase 3: Repo-Agnostic Parameterization & Portable SAP Package (COMPLETE)
- [x] **T1 (Static)**: Parameterize `scripts/generate-domain-graph.cjs` to read declarative configuration from `.agent/domain-graph-config.json` (root candidates, hub patterns, entity prefix regex).
- [x] **T2 (Functional)**: Extended unit tests `scripts/test-domain-graph.cjs` (7/7 passed), verifying CLI flags (`--root`, `--config`, `--out`) and graceful fallback.
- [x] **T3 (Integrated)**: Scaffold portable skill `.agent/skills/repo-taxonomy-graph/SKILL.md` (and dual mirror in `.claude/skills/repo-taxonomy-graph/SKILL.md`), bundling parameterized engine templates.
- [x] **T4 (Governance)**: Update `.agent/standards-catalog.json`, `.agent/skill-router.yaml`, and `GEMINI.md` with SAP sync markers (`<!-- shared:std.agent.repo-taxonomy-graph:start -->`) for 1-command distribution via `/sap-sync`.

**Validation Gate (VG)**: `npm run verify:governance-wiring:all` passes 100% green (199 artifacts verified).

---

## 4. Dependencies & Risk Mitigation

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| Broken external tools | Critical | Discard Python Graphify (`scratch/finalize_graph.py`); use zero-dependency native Node.js. |
| Cross-repo blast radius | High | Stage implementation in 3 sequential phases: prove in `Sree_Krushna` (Phase 1) before parameterizing (Phase 2) and syncing to sibling repos (Phase 3). |
| Over-zealous taxonomy linting | Medium | Taxonomy linter enforces prohibited synonyms only in `.md` documentation and governance artifacts, ignoring external third-party assets and vendor contract texts. |
