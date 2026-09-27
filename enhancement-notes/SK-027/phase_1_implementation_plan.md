---
schema_version: "1.0.0"
ticket: "SK-027"
phase: "Phase 1: Zero-Config Discovery Engine Upgrade & Real Sibling Onboarding Pilot"
status: "COMPLETED"
standard: "STD-PLANNING-ENGINE-001"
governance_reference: "AC-DEC-2026-069"
dod_mapping:
  - "Config Auto-Detection from enhancement-config.json"
  - "Adaptive Source File & Directory Discovery"
  - "Strict Prefix Validation & Markdown Registry Entity Parsing"
  - "Empirical Onboarding of OperatusOS"
  - "Empirical Validation of Task-Dashboard"
---

# SK-027 Phase 1 Implementation Plan: Zero-Config Discovery Engine Upgrade & Real Sibling Onboarding Pilot

## 1. Executive Summary & Problem-Space Boundary

### 1.1 Problem Statement
Review 3.7 revealed that `scripts/generate-domain-graph.cjs` failed completely when executed against a real sibling repository (`OperatusOS`), indexing 0 entities because:
1. Fallback entity prefixes were hardcoded to Sree Krushna's wedding domains (`EVT`, `TRS`, `OBL`, etc.), ignoring `OPS-###`.
2. Fallback target directories were hardcoded to Sree Krushna's 10 wedding folders (`00_GOVERNANCE`, `01_TIMELINE_EVENTS`), which do not exist in sibling repositories.
3. Fallback root files omitted `ENHANCEMENTS.md` (where `OperatusOS` and `Agri_ERP` track all entities).
4. Entities tracked within markdown lists/headers (e.g. `**OPS-001**: Set up...`) were ignored because the parser only inspected frontmatter `fm.id` or filenames matching `prefix-###.md`.
5. On `Task-Dashboard`, frontmatter parsing lacked uppercase prefix validation, resulting in noisy pseudo-entity types (`page-`, `modal-`, `component-`, `flex-`).

### 1.2 Boundary & Scope
- **In-Scope**:
  - Auto-reading `enhancement-config.json` in target repository to extract `project_name` / `repo` and `id_prefix` / `canonical_prefix`.
  - Dynamic directory discovery when configured directories are not present.
  - Adding `ENHANCEMENTS.md` to default root files.
  - In-file markdown entity declaration parsing (`**PREFIX-###**: Title`) for single-file registries.
  - Strict uppercase prefix validation regex (`^[A-Z]{2,6}$`).
  - Empirical execution and verification on `d:\GitHub_Repo\OperatusOS` and `d:\GitHub_Repo\Task-Dashboard`.
- **Out-of-Scope**:
  - Modifying files inside `OperatusOS` source code (read-only scan + generating `graphify-out/`).
  - Deploying git hooks or pre-commit runners in sibling repositories.

---

## 2. Binary Validation Gates (VG) & Decision Nodes (DN)

| Gate ID | Verification Trigger | Success Criteria | Decision on Failure |
| :--- | :--- | :--- | :--- |
| **VG-1.1** | `node scripts/test-domain-graph.cjs` in Sree_Krushna | 100% pass; 145 nodes, 41 edges; zero regression on local SSOT | Stop and fix regression before testing sibling repos |
| **VG-1.2** | `node scripts/generate-domain-graph.cjs --root d:/GitHub_Repo/OperatusOS` | Auto-detects `OPS` prefix; indexes >30 `OPS-###` entities; exit code 0 | Debug `enhancement-config.json` parser & markdown regex |
| **VG-1.3** | `node scripts/generate-domain-graph.cjs --root d:/GitHub_Repo/Task-Dashboard` | Indexes `INC-###` and `ENH-###`; zero `page-`, `modal-`, or `flex-` noise nodes | Tighten prefix uppercase sanitizer |

---

## 3. Detailed TDD Task Breakdown

### Task 1: Auto-Detect Repository Identity & Entity Prefixes
- **Target File**: `scripts/generate-domain-graph.cjs` (`loadConfig()`)
- **Step 1 (Test)**: Run `test-domain-graph.cjs` to confirm existing config loading tests pass.
- **Step 2 (Implementation)**:
  - In `loadConfig(repoRoot, customConfigPath)`:
    - Check if `path.join(repoRoot, 'enhancement-config.json')` exists.
    - If found, parse JSON and extract `id_prefix` or `canonical_prefix`.
    - If found and not in `canonicalPrefixes`, prepend it to `canonicalPrefixes`.
    - Also extract `project_name` or `repo` to set `repoName` dynamically if not set.
    - Add `ENHANCEMENTS.md` to `rootFiles`.
- **Step 3 (Verification)**: Verify `loadConfig('d:/GitHub_Repo/OperatusOS')` returns `canonicalPrefixes` containing `'OPS'`.

### Task 2: Adaptive Source File Discovery & Dynamic Directory Fallback
- **Target File**: `scripts/generate-domain-graph.cjs` (`findSourceFiles()`)
- **Step 1 (Test)**: Inspect current directory search behavior on non-wedding folder structures.
- **Step 2 (Implementation)**:
  - If none of the configured `targetDirectories` exist on disk in `repoRoot`, dynamically discover top-level directories that contain `.md` or `.jsonl` files (excluding `node_modules`, `.git`, `.cache`, `dist`, `build`, `coverage`, `scratch`).
  - Ensure all existing `rootFiles` (`README.md`, `CLAUDE.md`, `ENHANCEMENTS.md`, `DOCS_HUB.md`, `ARCHITECTURE_SPEC.md`, `ENHANCEMENT-MASTER-REGISTRY.md`) are scanned.
- **Step 3 (Verification)**: Test file count returned for `OperatusOS` increases from 2 to 10+.

### Task 3: In-File Markdown Entity Extraction & Strict Prefix Sanitization
- **Target File**: `scripts/generate-domain-graph.cjs` (`buildGraph()`)
- **Step 1 (Test)**: Run entity extraction against sample `ENHANCEMENTS.md` snippet.
- **Step 2 (Implementation)**:
  - Strict Prefix Validation: Only accept `nodeId` from `fm.id` if `nodeId.split('-')[0]` matches `/^[A-Z]{2,6}$/`. Discard lowercase or kebab-case pseudo-IDs (`page-`, `modal-`, `flex-`).
  - In-File Entity Parsing: When parsing markdown files (such as `ENHANCEMENTS.md`), scan lines matching `/^\*\*([A-Z]{2,6}-\d{2,4})\*\*:\s*(.+)$/gm` and register each match as an explicit entity node if not already present. Extract status from adjacent lines if available.
- **Step 3 (Verification)**: Run on `OperatusOS` and verify that `OPS-001` through `OPS-040` are extracted into `graph.nodes`.

### Task 4: Empirical Onboarding Verification of `OperatusOS` & `Task-Dashboard`
- **Commands**:
  1. `node scripts/generate-domain-graph.cjs --root d:/GitHub_Repo/OperatusOS --out d:/GitHub_Repo/OperatusOS/graphify-out`
  2. `node scripts/generate-domain-graph.cjs --root d:/GitHub_Repo/Task-Dashboard --out d:/GitHub_Repo/Task-Dashboard/graphify-out`
  3. `node scripts/test-domain-graph.cjs`
- **Success Proof**:
  - `OperatusOS`: `GRAPH_REPORT.md` lists `OPS-###` entities (>30 nodes).
  - `Task-Dashboard`: `GRAPH_REPORT.md` lists `INC-###` and `ENH-###` entities with 0 noise types.
  - `Sree_Krushna`: Full regression test passes 100% green.
