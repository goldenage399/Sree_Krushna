# SK-019 Implementation Plan: SAP Dual-Block Taxonomy Isolation & Scoped Vocabulary Linter (Phase 2)

> **Governing Ticket**: [`enhancement-notes/SK-019/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-019/00_ENHANCEMENT_INDEX.md)  
> **Certifying Decisions**: [`AC-DEC-2026-060`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/260926_arch_council_cross_repo_graph_taxonomy_and_session_acceleration.md) & [`AC-DEC-2026-063`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/260927_arch_council_sap_dual_block_taxonomy_and_cross_repo_portability.md) (`GOV-DEC-2026-003`)  
> **Standard References**: `STD-UNIVERSAL-TAXONOMY-001` / `INV-SAP-DUAL-BLOCK-001` / `PKG-006`  
> **Target Release**: `v2.9.0`  
> **Goal**: Implement Phase 2 of the Universal Cross-Repository Graph & Taxonomy Engine: author the dual-block `.agent/taxonomy_dictionary.cjs` (shared universal terms vs. local Sree_Krushna terms), author the scoped vocabulary linter (`scripts/verify-taxonomy-vocabulary.cjs`), and author `docs/SYSTEM_CLARITY_SNAPSHOT.md`.  
> **Architecture**: Implements `INV-SAP-DUAL-BLOCK-001`. The taxonomy dictionary is authored in CommonJS with explicit `<!-- shared:std.agent.taxonomy.core:start -->` markers for text-block `/sap-sync` compatibility across all 9 SAP repositories, while isolating `<!-- repo-specific:sree-krushna:start -->` terms from sync overwrites. The linter enforces canonical phrasing on SSOTs and PRDs while strictly excluding raw user discussion scratchpads (`User_Created/`).  
> **Tech Stack / Toolchain**: Node.js standard library (`fs`, `path`), CommonJS (`.cjs`), static regex AST tokenization.  

---

## Physical Storage & Transit Contract (`INV-DATA-TRANSIT-001`)

- **Storage Target**: Local repository filesystem (`.agent/taxonomy_dictionary.cjs`, `scripts/verify-taxonomy-vocabulary.cjs`, `docs/SYSTEM_CLARITY_SNAPSHOT.md`), tracked in git.
- **Multi-Device & Cross-Repo Transit**: CommonJS dual-block text structure natively compatible with `/sap-sync` line-replacement regex across all 9 SAP repositories.
- **Client-Storage Prohibition**: Pure static build and verification artifacts; zero browser or `localStorage` persistence.

---

## Sequential Phased Definition of Done (DoD v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax / Lint | Clean CommonJS code; zero external dependencies; `.agent/taxonomy_dictionary.cjs` passes `node --check`. |
| **T2** | **Functional** | Unit / Linter | `scripts/test-taxonomy-linter.cjs` verifies: prohibited synonym detection, valid canonical term pass, code block/URL exclusion, and `--shared-only` mode execution. |
| **T3** | **Integrated** | Scoped Linting Pass | Running `node scripts/verify-taxonomy-vocabulary.cjs` across canonical docs (`docs/`, `00_GOVERNANCE/`, `enhancement-notes/`) reports 0 prohibited synonyms. |
| **T4** | **Governance** | Compliance & Wiring | npm script `verify:taxonomy` registered in `package.json`; `docs/SYSTEM_CLARITY_SNAPSHOT.md` authored and indexed in `DOCS_HUB.md`; governance verification suite passes 100% green. |

---

## Phase 2 Implementation Tasks

### Task 2.1: Author Dual-Block Taxonomy Dictionary (`.agent/taxonomy_dictionary.cjs`)

**Files:**
- Create: `.agent/taxonomy_dictionary.cjs`

**Step 1: Implementation**
Author `.agent/taxonomy_dictionary.cjs` with explicit SAP dual-block markers:
- `<!-- shared:std.agent.taxonomy.core:start -->`:
  - `governance`: Preferred "Definition of Done (DoD v1.7)", "Validation Gate (VG)", "Decision Node (DN)", "Reality-First Grounding (RFG-001)". Prohibited: `"Completion Checklist"`, `"Signoff Criteria"`, `"assert step"`, `"decision point"`.
  - `documentation`: Preferred "Spoke & Wheel SSOT". Prohibited: `"parent/child docs"`, `"hub and spoke hierarchy"`.
- `<!-- repo-specific:sree-krushna:start -->`:
  - `events`: Preferred "Nirbandha & Ashirbad", "Kanyadaan & Hastaganthi". Prohibited: `"Ring ceremony"`, `"Hand tying"`.
  - `entities`: Canonical prefixes (`EVT-###`, `RIT-###`, `TRS-###`, `OBL-###`, `GFT-###`).

**Step 2: Syntax Verification**
Run: `node --check .agent/taxonomy_dictionary.cjs`  
Expected: Exit code 0 with no syntax errors.

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code === 0 AND file exports `.shared` and `.repo_specific` objects.

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Task 2.2.
- **Fail (1st)**: Fix syntax in `.agent/taxonomy_dictionary.cjs`.
- **Fail (2nd)**: Halt and surface error.

---

### Task 2.2: Unit Test Suite for Taxonomy Linter (`scripts/test-taxonomy-linter.cjs`)

**Files:**
- Create: `scripts/test-taxonomy-linter.cjs`

**Step 1: Write failing test**
Author an isolated unit test checking:
1. Detection of prohibited synonyms in synthetic text.
2. Acceptance of canonical preferred terms.
3. Ignoring occurrences inside markdown inline code (`` `code` ``) and fenced blocks (```` ``` ````).
4. Ignoring occurrences inside markdown links (`[text](url)`).
5. Verification of `--shared-only` filtering.

**Step 2: Run test to verify it fails**
Run: `node scripts/test-taxonomy-linter.cjs`  
Expected: `FAIL` with `Cannot find module './verify-taxonomy-vocabulary.cjs'`.

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code !== 0 AND output matches `Cannot find module.*verify-taxonomy-vocabulary`

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Task 2.3.
- **Fail (1st)**: Verify test assertions.
- **Fail (2nd)**: Halt and surface error.

---

### Task 2.3: Scoped Taxonomy & Vocabulary Linter (`scripts/verify-taxonomy-vocabulary.cjs`)

**Files:**
- Create: `scripts/verify-taxonomy-vocabulary.cjs`

**Step 1: Implementation**
Implement the linter:
- Load `.agent/taxonomy_dictionary.cjs`.
- Parse CLI flags: `--shared-only`, `--target <path>`, `--strict`.
- Scan target directories: `docs/`, `00_GOVERNANCE/`, `enhancement-notes/`, root `.md` files.
- Strictly ignore: `User_Created/`, `node_modules/`, `.git/`, `scratch/`.
- Strip code blocks and link URLs prior to word-boundary regex matching (`\b<term>\b`).
- Format report showing file, line number, prohibited term found, and recommended preferred replacement.

**Step 2: Run unit test to verify it passes**
Run: `node scripts/test-taxonomy-linter.cjs`  
Expected: `PASS` with 0 errors.

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code === 0 AND output matches `ALL TAXONOMY LINTER TESTS PASSED`

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Task 2.4.
- **Fail (1st)**: Fix regex or scanner logic in `verify-taxonomy-vocabulary.cjs`.
- **Fail (2nd)**: Halt and surface error.

---

### Task 2.4: System Clarity Snapshot (`docs/SYSTEM_CLARITY_SNAPSHOT.md`)

**Files:**
- Create: `docs/SYSTEM_CLARITY_SNAPSHOT.md`

**Step 1: Author document**
Author a clean, one-page status snapshot using 100% canonical taxonomy:
- Active Tickets & Milestones (`SK-019` in progress, `SK-020` in planning).
- Recent Certified Decisions (`AC-DEC-2026-059`, `AC-DEC-2026-060`, `AC-DEC-2026-063`).
- Open Domain Gaps & Unresolved Items (the 8 unresolved items from Response 1.0).
- Indexed pointers to `DOCS_HUB.md` and `graphify-out/GRAPH_REPORT.md`.

**Step 2: Run linter on snapshot**
Run: `node scripts/verify-taxonomy-vocabulary.cjs --target docs/SYSTEM_CLARITY_SNAPSHOT.md`  
Expected: 0 violations found.

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code === 0.

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Task 2.5.
- **Fail (1st)**: Replace any prohibited synonyms in `docs/SYSTEM_CLARITY_SNAPSHOT.md`.
- **Fail (2nd)**: Halt and surface error.

---

### Task 2.5: Toolchain Wiring & Governance Verification

**Files:**
- Modify: `package.json` (add `"verify:taxonomy": "node scripts/verify-taxonomy-vocabulary.cjs"`)
- Modify: `DOCS_HUB.md` (index `docs/SYSTEM_CLARITY_SNAPSHOT.md`)

**Step 1: Register script and update hub**
Add `verify:taxonomy` to `package.json` and add link in `DOCS_HUB.md`.

**Step 2: Run full verification suite**
Run:
```powershell
npm run verify:taxonomy; npm run verify:governance-wiring:all
```
Expected: PASS with 0 errors.

**Step 3: Atomic Commit**
Run:
```powershell
git add .agent/taxonomy_dictionary.cjs scripts/test-taxonomy-linter.cjs scripts/verify-taxonomy-vocabulary.cjs docs/SYSTEM_CLARITY_SNAPSHOT.md package.json DOCS_HUB.md enhancement-notes/SK-019/
git commit -m "feat(governance): implement SAP dual-block taxonomy dictionary and scoped linter (SK-019 Phase 2)"
```

---

## Mandatory Plan Hard-Stop (`AC-DEC-2026-044`)

> [!IMPORTANT]
> **Mandatory Plan Hard-Stop**: In strict compliance with `AC-DEC-2026-044` and `STD-PLANNING-ENGINE-001`, this planning document concludes with Phase 2 saved to disk. **No implementation code or task executions may be performed in this turn.** The agent must halt and request explicit user confirmation to proceed to Phase 2 execution.
