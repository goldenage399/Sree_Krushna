---
pattern: universal-repository-taxonomy-and-discovery-graph
activation_tier: guarded
guard: "node scripts/test-domain-graph.cjs && node scripts/verify-taxonomy-vocabulary.cjs"
canonical_source: sree-krushna
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: .agent/workflows/aos-session-open.md
    at: "Step 0.5: Mandatory Session Acceleration Gate (INV-SESSION-ACCEL-003)"
  - file: .agent/PREFLIGHT.md
    at: "R7"
  - file: enhancement-notes/SK-019/00_ENHANCEMENT_INDEX.md
    at: "DoD Matrix"
triggers:
  - "STD-UNIVERSAL-TAXONOMY-001"
  - "PKG-006"
  - "repo-taxonomy-graph"
  - "generate domain graph"
  - "verify taxonomy"
  - "session acceleration"
  - "INV-SAP-DUAL-BLOCK-001"
  - "INV-PCL-001"
  - "INV-ZERO-DEP-GRAPH-002"
  - "INV-SESSION-ACCEL-003"
portability: universal
porting_effort: low
---

# Pattern: Universal Repository Taxonomy, Discovery Graph & Session Acceleration Engine

**Standard ID**: `STD-UNIVERSAL-TAXONOMY-001` / `PKG-006`  
**Category**: Governance / Architecture / Session Acceleration & Discovery  
**Origin**: Sree Krushna Marriage OS (`AC-DEC-2026-059` / `AC-DEC-2026-060` / `AC-DEC-2026-063` / `SK-019`)  
**Status**: VALIDATED  

---

## 1. Problem Statement

Across large multi-repository software federations (e.g. the 9 SAP repositories: `Task-Dashboard`, `Sree_Krushna`, `BMS`, `Capsicum`, `PIO`, `UG-Farmhouse`, `QSR`, etc.), newly spawned agent sessions suffer from three structural discovery anti-patterns:

1. **Exploratory Crawling Latency**: Agents spend 10 to 20+ sequential tool calls executing raw directory listings, file checks, and grep queries to construct an ad-hoc mental model of repository architecture before answering substantive domain questions.
2. **Fragile External Toolchains**: Reliance on external Python or third-party graph generators (e.g. `scratch/finalize_graph.py`) frequently breaks due to missing local Python runtimes, missing `pip` packages, or environment path drift.
3. **Cross-Repository Vocabulary Drift**: Teams and agents use conflicting synonyms for identical governance or architectural concepts (e.g., `"Definition of Done"` vs. `"Signoff Checklist"`; `"Validation Gate"` vs. `"Assert Step"`; `"Spoke & Wheel"` vs. `"Parent/Child docs"`).
4. **Monolithic Sync Collisions**: Attempting to synchronize taxonomy dictionaries across repos using pure JSON files destroys local project-specific terms during line-based `/sap-sync` replacement.

---

## 2. Mandatory Architectural Invariants

### INV-SAP-DUAL-BLOCK-001: SAP Dual-Block Text Comment Isolation
The canonical taxonomy dictionary (`.agent/taxonomy_dictionary.cjs`) MUST strictly partition terminology into two isolated sections using comment boundaries:

1. `// <!-- shared:std.agent.taxonomy.core:start -->`:
   - Universal governance, quality, and architecture rules shared across all 9 SAP repositories.
   - Synchronized losslessly across repositories via `/sap-sync` line-replacement blocks.
2. `// <!-- repo-specific:<repo-name>:start -->`:
   - Local domain-specific entity models, liturgical ceremony names, or project-unique identifiers.
   - Strictly preserved from sync overwrites.

### INV-PCL-001: Scoped Vocabulary Linter & Discussion Exemption
The vocabulary enforcement linter (`scripts/verify-taxonomy-vocabulary.cjs`):
1. **Sanitizes Markdown Artifacts**: Strips fenced code blocks (```` ``` ````), inline code (`` `code` ``), and Markdown link targets (`[text](url)`) before word-boundary regex evaluation (`\b<term>\b`) to eliminate false positives while preserving exact line number mapping.
2. **Excludes Casual Discussion Scratchpads**: Raw brainstorming threads (`User_Created/`), external third-party assets (`node_modules/`), and scratch scripts (`scratch/`) are strictly excluded to preserve natural conversational freedom and exploratory ideation.

### INV-ZERO-DEP-GRAPH-002: Zero-Dependency Native Node.js Tooling & Declarative Config
The domain knowledge graph generator (`scripts/generate-domain-graph.cjs`):
1. Relies **100% on Node.js standard libraries** (`fs`, `path`). External package dependencies (`npm` or `pip`) are prohibited.
2. Externalizes repository topology, entity prefixes, target directories, and root inspection files into `.agent/domain-graph-config.json`.
3. Supports `--root <path>`, `--config <path>`, and `--out <dir>` CLI flags with graceful fallback when run on arbitrary or unconfigured sibling repositories.

### INV-SESSION-ACCEL-003: Tier 1 Mandatory Documentation Read Gate
Every newly opened agent session MUST read:
1. `DOCS_HUB.md` (Spoke & Wheel SSOT navigation directory).
2. `docs/SYSTEM_CLARITY_SNAPSHOT.md` (Living operational ledger tracking active workstreams, recent council rulings, and open investigations).

Agents are prohibited from running exploratory multi-file grep or directory walking commands prior to consulting these Tier 1 acceleration hubs.

---

## 3. DISC-001 Discoverability Self-Check

Every repository implementing this pattern must satisfy the 3 Discoverability Questions:

- [x] **SSOT → Source (1-hop)**: `DOCS_HUB.md` directly indexes `docs/SYSTEM_CLARITY_SNAPSHOT.md`, `.agent/taxonomy_dictionary.cjs`, and `graphify-out/GRAPH_REPORT.md` with explicit script pointers.
- [x] **Source → SSOT (Back-link)**: Source scripts (`generate-domain-graph.cjs`, `verify-taxonomy-vocabulary.cjs`, `.agent/taxonomy_dictionary.cjs`) declare their governing standards (`STD-UNIVERSAL-TAXONOMY-001` / `AC-DEC-2026-063`) in their file headers.
- [x] **Zero-Grep Reachability**: Starting from `GEMINI.md → DOCS_HUB.md → graphify-out/GRAPH_REPORT.md`, an agent reaches the entire 131-node entity graph in **≤2 clicks with zero grepping required**.

---

## 4. Failure Modes & Prevention

| Failure Mode | Root Cause | Preventative Mechanism |
|---|---|---|
| **18-Turn Discovery Lag** | Skipping hub files and executing ad-hoc directory listings. | Mandatory `INV-SESSION-ACCEL-003` startup gate in `aos-session-open.md`. |
| **Broken Graphify Scripts** | Reliance on local Python or pip toolchains. | Native zero-dependency CommonJS generator (`scripts/generate-domain-graph.cjs`). |
| **Sync Overwrites Local Specs** | Unpartitioned JSON taxonomy dictionaries. | Dual-block comment boundaries (`INV-SAP-DUAL-BLOCK-001`). |
| **False-Positive Linter Spams** | Evaluating code snippets, URLs, or casual user notes. | AST/token sanitization and `User_Created/` exemption (`INV-PCL-001`). |

---

## 5. Verification Commands

```powershell
npm run test:graph
npm run build:graph
npm run test:taxonomy
npm run verify:taxonomy
npm run verify:governance-wiring:all
```
