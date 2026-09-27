---
name: repo-taxonomy-graph
description: Universal Repository Taxonomy, Entity Discovery Graph & Session Acceleration Engine (STD-UNIVERSAL-TAXONOMY-001 / PKG-006). Zero-dependency native Node.js entity graph generator, SAP dual-block taxonomy vocabulary linter, and living operational snapshot.
---

# Universal Repository Taxonomy, Entity Discovery Graph & Session Acceleration Engine

## Overview

Use this skill whenever opening a new session in any repository, exploring unfamiliar domain architectures, inspecting entity relationships across documents, or enforcing canonical vocabulary across specs, PRDs, and governance artifacts.

This engine eliminates multi-turn filesystem crawling latency by providing a native 3-tier acceleration architecture:
1. **Unconditional Documentation Read Gate**: Mandatory initial inspection of `DOCS_HUB.md` and `docs/SYSTEM_CLARITY_SNAPSHOT.md`.
2. **Deterministic Entity Knowledge Graph**: Native Node.js scanner walking declarative directories and emitting `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json`.
3. **Dual-Block Taxonomy & Vocabulary Governance**: Shared cross-repo dictionary with scoped linting (`scripts/verify-taxonomy-vocabulary.cjs`) enforcing canonical terminology across all 9 SAP repositories.

**Origin Standards**: `STD-UNIVERSAL-TAXONOMY-001` / `INV-SAP-DUAL-BLOCK-001` / `PKG-006` (`AC-DEC-2026-059` / `AC-DEC-2026-060` / `AC-DEC-2026-063` / `SK-019`)  
**Applicability**: All 9 SAP repositories (`Task-Dashboard`, `Sree_Krushna`, `BMS`, `Capsicum`, `PIO`, `UG-Farmhouse`, `QSR`, etc.).

---

<!-- shared:std.agent.repo-taxonomy-graph.core:start -->

## The 4 Core Architectural Invariants

Every deployment of this engine MUST conform to the 4 Core Invariants:

1. **`INV-SAP-DUAL-BLOCK-001` (Dual-Block Text Comment Isolation)**:
   - The taxonomy dictionary (`.agent/taxonomy_dictionary.cjs`) MUST partition vocabulary into:
     - `// <!-- shared:std.agent.taxonomy.core:start -->`: Universal governance and architectural standards losslessly synced across repositories via `/sap-sync`.
     - `// <!-- repo-specific:<repo-name>:start -->`: Local repository domain entities, ritual names, or project-specific models strictly preserved from sync overwrites.
   - Never use unstructured JSON files for taxonomy dictionaries that require text-block replacement during multi-repo synchronization.

2. **`INV-PCL-001` (Prohibited Synonyms & Discussion Scratchpad Exemption)**:
   - The scoped vocabulary linter (`scripts/verify-taxonomy-vocabulary.cjs`) enforces canonical terms across formal documentation (`docs/`, `00_GOVERNANCE/`, `enhancement-notes/`).
   - The linter MUST strictly ignore raw user brainstorming scratchpads (`User_Created/`), code blocks (``` and `), and URLs (`[text](url)`) to preserve casual discussion freedom and eliminate false positives.

3. **`INV-ZERO-DEP-GRAPH-002` (Native Node.js Tooling & Declarative Config)**:
   - The domain graph generator (`scripts/generate-domain-graph.cjs`) MUST rely exclusively on native Node.js standard libraries (`fs`, `path`).
   - External dependencies (e.g. Python Graphify, `pip` packages) are strictly prohibited.
   - Repository topology, entity prefixes, target directories, and exclusions MUST be declared in `.agent/domain-graph-config.json` rather than hardcoded in the script.

4. **`INV-SESSION-ACCEL-003` (Tier 1 Mandatory Documentation Read Gate)**:
   - Agents opening a session MUST read `DOCS_HUB.md` unconditionally prior to running broad filesystem searches.
   - For active operations and open domain investigations, consult `docs/SYSTEM_CLARITY_SNAPSHOT.md`.

---

## Declarative Configuration Schema (`.agent/domain-graph-config.json`)

To configure a repository for the domain graph generator, place `.agent/domain-graph-config.json` in the repository root:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "version": "1.0.0",
  "standard": "STD-UNIVERSAL-TAXONOMY-001",
  "repoName": "Repository_Name",
  "description": "Declarative Domain Graph Configuration",
  "canonicalPrefixes": ["TSK", "DEC", "MOD", "FEAT", "RSK"],
  "targetDirectories": ["docs", "00_GOVERNANCE", "src"],
  "rootFiles": ["README.md", "DOCS_HUB.md", "ARCHITECTURE_SPEC.md"],
  "ignoreDirectories": ["node_modules", ".git", "graphify-out", "scratch", "User_Created"],
  "outputDir": "graphify-out"
}
```

---

## Tooling & Command Reference

| Command | Script | Purpose |
|---|---|---|
| `npm run build:graph` | `scripts/generate-domain-graph.cjs` | Scans repo and emits `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json`. |
| `npm run test:graph` | `scripts/test-domain-graph.cjs` | Runs the 7-test unit suite covering link resolution, edge symmetry, and config loading. |
| `npm run verify:taxonomy` | `scripts/verify-taxonomy-vocabulary.cjs` | Runs the scoped vocabulary linter across canonical documentation. |
| `npm run test:taxonomy` | `scripts/test-taxonomy-linter.cjs` | Runs the 4-test unit suite validating prohibited synonym detection and code block sanitization. |
| `node scripts/generate-domain-graph.cjs --root <path>` | — | Generates domain graph for an external or sibling repository. |
| `node scripts/verify-taxonomy-vocabulary.cjs --shared-only` | — | Runs vocabulary linter evaluating only universal shared core rules. |

---

## Cross-Repository Distribution via `/sap-sync`

When syncing this engine to sibling repositories:
1. Distribute `.agent/skills/repo-taxonomy-graph/SKILL.md` into the target repo.
2. Synchronize the `shared` block of `.agent/taxonomy_dictionary.cjs`.
3. Copy `scripts/generate-domain-graph.cjs` and `scripts/verify-taxonomy-vocabulary.cjs`.
4. Create target `.agent/domain-graph-config.json` with the repository's local entity prefixes and folder layout.
5. Register scripts in `package.json` and standard in `.agent/standards-catalog.json`.

<!-- shared:std.agent.repo-taxonomy-graph.core:end -->
