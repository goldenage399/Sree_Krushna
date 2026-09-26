# SK-019 Implementation Plan: Universal Cross-Repo Graph & Taxonomy Engine (Phase 1 Baseline)

> **Governing Ticket**: [`enhancement-notes/SK-019/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-019/00_ENHANCEMENT_INDEX.md)  
> **Certifying Decisions**: [`AC-DEC-2026-059`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/260926_arch_council_session_acceleration_and_discovery_infrastructure.md) & [`AC-DEC-2026-060`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/260926_arch_council_cross_repo_graph_taxonomy_and_session_acceleration.md) (`GOV-DEC-2026-002`)  
> **Standard References**: `STD-UNIVERSAL-TAXONOMY-001` / `PKG-006` / `STD-PCL-001`  
> **Target Release**: `v2.9.0`  
> **Goal**: Build Phase 1 baseline of the Universal Cross-Repository Graph & Taxonomy Engine: a zero-dependency Node.js domain entity scanner (`scripts/generate-domain-graph.cjs`) in Sree_Krushna that parses all 9 domain hubs, generating `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json` before parameterizing for SAP rollout in Phases 2–3.  
> **Architecture**: Implements the foundation of `STD-UNIVERSAL-TAXONOMY-001`. A fast file-system walker parses markdown YAML frontmatter (`id:`, `event_id:`, `status:`) and intra-document markdown cross-reference links (`[EVT-001](...)`), constructing an in-memory entity graph and emitting Markdown summary + JSON adjacency lists. Prepares declarative config interfaces for cross-repo parameterization.  
> **Tech Stack / Toolchain**: Node.js standard library (`fs`, `path`), CommonJS (`.cjs`), static assertion unit test runner.  

---

## Physical Storage & Transit Contract (`INV-DATA-TRANSIT-001`)

- **Storage Target**: Local repository filesystem (`graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`), tracked in git version control.
- **Multi-Device / Agent Transit**: Git-tracked files checked into the repository branch; readable immediately by fresh agent sessions and subagents without dynamic compilation or runtime setup.
- **Client-Storage Prohibition**: No `localStorage` or browser persistence involved; purely static CLI build artifact.

---

## Sequential Phased Definition of Done (DoD v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax / Lint | Clean CommonJS code; zero external npm/python dependencies; passes syntax check via `node --check scripts/generate-domain-graph.cjs`. |
| **T2** | **Functional** | Unit / Parser | `scripts/test-domain-graph.cjs` verifies: regex extraction of entity IDs, forward/reverse relationship detection, missing reference detection, and JSON schema compliance. |
| **T3** | **Integrated** | Artifact Generation | Running `node scripts/generate-domain-graph.cjs` writes `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json` containing ≥100 canonical entities across all 9 domains. |
| **T4** | **Governance** | Compliance & Wiring | npm script `build:graph` registered in `package.json`; `DOCS_HUB.md` updated with direct link to `graphify-out/GRAPH_REPORT.md`; governance verification clean. |

---

## Phase 1 Implementation Tasks

### Task 1.1: Automated Test Suite for Domain Graph Generator (`scripts/test-domain-graph.cjs`)

**Files:**
- Create: `scripts/test-domain-graph.cjs`

**Step 1: Write failing test**
Author an isolated test suite validating:
1. `parseFrontmatter(content)` correctly extracts YAML `id`, `event_id`, `hub`, `status`.
2. `extractEntityLinks(content)` finds markdown links matching entity prefixes (`EVT-###`, `RIT-###`, `PER-###`, `TRS-###`, `PAY-###`, `GFT-###`).
3. Graph compilation collects all entities and records outbound edges.
4. Formatting function produces markdown report with entity summary tables and cross-reference counts.

**Step 2: Run test to verify it fails**
Run: `node scripts/test-domain-graph.cjs`  
Expected: `FAIL` with `Cannot find module './generate-domain-graph.cjs'` (exit code non-zero).

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code !== 0 AND output matches `Cannot find module.*generate-domain-graph`

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Task 1.2.
- **Fail (1st)**: If test unexpectedly passes or throws unrelated syntax error, check file path.
- **Fail (2nd)**: Halt and surface error.

---

### Task 1.2: Core Domain Entity Graph Generator (`scripts/generate-domain-graph.cjs`)

**Files:**
- Create: `scripts/generate-domain-graph.cjs`

**Step 1: Write implementation**
Implement the lightweight scanner:
- Define canonical prefixes: `EVT`, `RIT`, `PER`, `FAM`, `VEN`, `VDR`, `CTR`, `TSK`, `DEC`, `PAY`, `RSK`, `AST`, `CHG`, `GATE`, `CP`, `TRS`, `SHP`, `SAM`, `GFT`.
- Recursively walk directories `00_GOVERNANCE` through `08_RESEARCH_REFERENCE` plus `docs/` and root `.md` files.
- Extract frontmatter metadata and regex markdown links (`/\[([A-Z]{2,4}-\d{2,3}[a-zA-Z0-9_-]*)\]/g`).
- Build node adjacency list `{ id, type, title, file, outbound: [], inbound: [] }`.
- Ensure output directory `graphify-out/` exists.
- Write `graphify-out/graph.json` and human-readable `graphify-out/GRAPH_REPORT.md`.

**Step 2: Run unit test to verify it passes**
Run: `node scripts/test-domain-graph.cjs`  
Expected: `PASS` with 0 errors (exit code 0).

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code === 0 AND output matches `ALL DOMAIN GRAPH TESTS PASSED`

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Task 1.3.
- **Fail (1st)**: Inspect failed assertions in `test-domain-graph.cjs` and adjust parser logic.
- **Fail (2nd)**: Halt and surface failure output to user.

---

### Task 1.3: Artifact Generation & npm Script Integration

**Files:**
- Modify: `package.json` (add `"build:graph": "node scripts/generate-domain-graph.cjs"`)
- Output: `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`

**Step 1: Execute generator**
Run: `npm run build:graph`  
Expected: Generates `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json` without errors.

**Step 2: Verify generated artifacts**
Assert `graphify-out/GRAPH_REPORT.md` exists and contains summary counts for all active domain prefixes.

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code === 0 AND file `graphify-out/GRAPH_REPORT.md` size > 2000 bytes.

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Task 1.4.
- **Fail (1st)**: Check file writing permissions and paths in `generate-domain-graph.cjs`.
- **Fail (2nd)**: Halt and surface error.

---

### Task 1.4: Root Hub Linkage & Atomic Commit

**Files:**
- Modify: `DOCS_HUB.md` (add section indexing `graphify-out/GRAPH_REPORT.md` as the Canonical Entity Graph)

**Step 1: Update DOCS_HUB.md**
Add direct navigation pointer to `graphify-out/GRAPH_REPORT.md`.

**Step 2: Verification Suite**
Run: `npm run verify:governance-wiring:all`  
Expected: PASS (exit code 0).

**Step 3: Atomic Commit**
Run:
```bash
git add scripts/generate-domain-graph.cjs scripts/test-domain-graph.cjs graphify-out/ package.json DOCS_HUB.md enhancement-notes/SK-019/
git commit -m "feat(governance): implement native domain entity graph generator (SK-019 Phase 1)"
```

---

## Plan Hard-Stop & Intent Decoupling (`AC-DEC-2026-044`)

> [!IMPORTANT]
> **Mandatory Plan Hard-Stop**: In strict compliance with `AC-DEC-2026-044` and `STD-PLANNING-ENGINE-001`, this planning document concludes with the Phase 1 specification saved to disk. **No implementation code or task executions may be performed in this turn.** The agent must halt and request explicit user confirmation to proceed to Phase 1 execution.
