# SK-019 Implementation Plan: Repo-Agnostic Parameterization & Portable SAP Package (Phase 3)

> **Governing Ticket**: [`enhancement-notes/SK-019/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-019/00_ENHANCEMENT_INDEX.md)  
> **Certifying Decisions**: [`AC-DEC-2026-060`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/260926_arch_council_cross_repo_graph_taxonomy_and_session_acceleration.md) & [`AC-DEC-2026-063`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/260927_arch_council_sap_dual_block_taxonomy_and_cross_repo_portability.md) (`GOV-DEC-2026-003`)  
> **Standard References**: `STD-UNIVERSAL-TAXONOMY-001` / `INV-SAP-DUAL-BLOCK-001` / `PKG-006`  
> **Target Release**: `v2.9.0`  
> **Goal**: Parameterize the domain entity graph generator (`scripts/generate-domain-graph.cjs`) via `.agent/domain-graph-config.json`, author the portable skill `.agent/skills/repo-taxonomy-graph/SKILL.md` (with `.claude/skills/` mirror), register `STD-UNIVERSAL-TAXONOMY-001` in the standards catalog and skill router, and prepare the engine for lossless `/sap-sync` distribution across all 9 SAP repositories.  
> **Architecture**: Implements `PKG-006` and `STD-UNIVERSAL-TAXONOMY-001`. Decouples local repository topology from the core scanning engine through a declarative config file. Exposes portable skill instructions and wires governance verification across the entire multi-repo federation.  
> **Tech Stack / Toolchain**: Node.js standard library (`fs`, `path`), CommonJS (`.cjs`), declarative JSON schemas, Markdown / YAML routing.  

---

## Physical Storage & Transit Contract (`INV-DATA-TRANSIT-001`)

- **Storage Target**: Local repository filesystem (`.agent/domain-graph-config.json`, `.agent/skills/repo-taxonomy-graph/SKILL.md`, `.claude/skills/repo-taxonomy-graph/SKILL.md`, `scripts/generate-domain-graph.cjs`), tracked in git.
- **Multi-Device & Cross-Repo Transit**: Turnkey distribution via `/sap-sync` line-replacement blocks (`<!-- shared:std.agent.repo-taxonomy-graph:start -->`) and standardized JSON configs.
- **Client-Storage Prohibition**: Pure static build and verification artifacts; zero browser or `localStorage` persistence.

---

## Sequential Phased Definition of Done (DoD v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Config Schema / Syntax | `.agent/domain-graph-config.json` authored with valid JSON schema; `scripts/generate-domain-graph.cjs` parameterization passes `node --check`. |
| **T2** | **Functional** | Parameterized Tests | `scripts/test-domain-graph.cjs` extended to verify: (1) loading custom config file, (2) custom prefix link matching, (3) CLI argument parsing (`--root`, `--config`, `--out`), and (4) graceful fallback to defaults when config is absent. |
| **T3** | **Integrated** | Cross-Repo Package & Regeneration | Scaffold portable skill `.agent/skills/repo-taxonomy-graph/SKILL.md` (and `.claude/skills/` mirror); running `node scripts/generate-domain-graph.cjs` re-generates `graphify-out/` cleanly with 82 entity nodes and 196 edges using the new declarative config. |
| **T4** | **Governance** | Governance Wiring | `STD-UNIVERSAL-TAXONOMY-001` registered in `.agent/standards-catalog.json`; `repo-taxonomy-graph` skill wired into `.agent/skill-router.yaml` and `GEMINI.md`; `npm run verify:governance-wiring:all` passes 100% green. |

---

## Phase 3 Implementation Tasks

### Task 3.1: Author Declarative Config (`.agent/domain-graph-config.json`)

**Files:**
- Create: `.agent/domain-graph-config.json`

**Step 1: Implementation**
Declare the Sree_Krushna repository topology in `.agent/domain-graph-config.json`:
- `repoName`: `"Sree_Krushna"`
- `canonicalPrefixes`: `["EVT", "RIT", "SAM", "PER", "FAM", "VEN", "VDR", "CTR", "TSK", "DEC", "PAY", "RSK", "AST", "CHG", "GATE", "CP", "TRS", "SHP", "GFT", "OBL", "EXC"]`
- `targetDirectories`: `["00_GOVERNANCE", "01_TIMELINE_EVENTS", "02_RITUALS_CULTURE", "03_PEOPLE_GUESTS", "04_PROCUREMENT_VENDORS", "05_OPERATIONS_LOGISTICS", "06_FINANCE_COMMERCIALS", "07_DOCUMENTS_ARCHIVE", "08_RESEARCH_REFERENCE", "docs"]`
- `rootFiles`: `["ARCHITECTURE_SPEC.md", "DOCS_HUB.md", "README.md", "ENHANCEMENT-MASTER-REGISTRY.md"]`
- `ignoreDirectories`: `["node_modules", ".git", "graphify-out", "scratch", "User_Created"]`
- `outputDir`: `"graphify-out"`

**Step 2: JSON Validation**
Verify valid JSON syntax.

---

### Task 3.2: Parameterize Generator Script (`scripts/generate-domain-graph.cjs`)

**Files:**
- Modify: `scripts/generate-domain-graph.cjs`

**Step 1: Implementation**
Refactor `scripts/generate-domain-graph.cjs` to:
1. Accept CLI flags: `--root <dir>`, `--config <path>`, `--out <dir>`.
2. Check for declarative config file (`--config` or `<repoRoot>/.agent/domain-graph-config.json`).
3. If config exists, load prefixes, target directories, root files, ignore list, and output directory.
4. If no config exists, fall back gracefully to discovering top-level directories containing `.md` files and matching general entity patterns.
5. Export internal functions for modular unit testing (`parseFrontmatter`, `extractEntityLinks`, `loadConfig`, `buildGraph`, `findSourceFiles`).

**Step 2: Syntax Verification**
Run: `node --check scripts/generate-domain-graph.cjs`  
Expected: Exit code 0.

---

### Task 3.3: Extended Unit Tests (`scripts/test-domain-graph.cjs`)

**Files:**
- Modify: `scripts/test-domain-graph.cjs`

**Step 1: Implementation**
Add tests:
- Test 5: Verify loading declarative configuration from `.agent/domain-graph-config.json`.
- Test 6: Verify CLI flag parsing and custom config override.
- Test 7: Verify graceful fallback when config is missing.

**Step 2: Run Tests**
Run: `node scripts/test-domain-graph.cjs`  
Expected: All tests PASS with 0 errors.

---

### Task 3.4: Author Portable Skill (`.agent/skills/repo-taxonomy-graph/SKILL.md`)

**Files:**
- Create: `.agent/skills/repo-taxonomy-graph/SKILL.md`
- Create: `.claude/skills/repo-taxonomy-graph/SKILL.md`

**Step 1: Implementation**
Author comprehensive, portable skill definition covering:
- Standard: `STD-UNIVERSAL-TAXONOMY-001` (`PKG-006`)
- Triggers: `"generate domain graph"`, `"repo taxonomy"`, `"build entity graph"`, `"verify taxonomy"`, `"/repo-taxonomy-graph"`
- Capabilities: Graph generation, taxonomy linting, session acceleration protocol, and cross-repo `/sap-sync` deployment instructions.

---

### Task 3.5: Standards Catalog, Skill Router & Governance Verification

**Files:**
- Modify: `.agent/standards-catalog.json` (add `STD-UNIVERSAL-TAXONOMY-001`)
- Modify: `.agent/skill-router.yaml` (register `repo-taxonomy-graph` skill)
- Modify: `GEMINI.md` (add standard and skill cross-references)

**Step 1: Wire standards and router**
Register the new standard and skill across the governance control plane.

**Step 2: Run Verification**
Run:
```powershell
npm run test:graph; npm run build:graph; npm run test:taxonomy; npm run verify:taxonomy; npm run verify:governance-wiring:all
```
Expected: 100% green exit code 0.

**Step 3: Atomic Commit & Check-off**
Update `enhancement-notes/SK-019/00_ENHANCEMENT_INDEX.md` and `ENHANCEMENT-MASTER-REGISTRY.md` to `COMPLETED`. Commit with message: `feat(governance): deliver portable repo-taxonomy-graph package and declarative engine (SK-019 Phase 3)`.
