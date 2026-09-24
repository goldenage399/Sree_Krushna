# SK-008: Universal Canonical Planning Engine & Cross-Repo SAP Synchronization

## 📊 Metadata

- **Category**: GOVERNANCE / REFACTOR
- **Priority**: MEDIUM
- **Status**: IN_PROGRESS (Phase 1 Complete)
- **Estimate**: 12 hours
- **Target Release**: v2.4.0
- **Risk Level**: LOW
- **Owner**: goldenage399
- **Cluster**: `[GOVERNANCE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - None (Foundational)
  related:
    - AC-DEC-2026-042  # Mandatory Ticket Registration & Phased Planning Gate Protocol (P-TICKET-FIRST-PHASING-001)
    - AC-DEC-2026-043  # Planning Execution Call-Graph, Skill Router Alignment & DISC-001 Discoverability
    - AC-DEC-2026-044  # Universal Planning Engine Consolidation & Reusable Prompt Integration
    - PACT-001         # Pattern Activation Contract
    - DISC-001         # Discoverability Self-Check
  blocks:
    - None (Foundational)
```

---

## 🎯 Purpose & Problem Statement

### 1. The Core Problem: Multi-Skill Planning Fragmentation
Across the Standard Agent Protocols (SAP) ecosystem (`Sree_Krushna`, `Task-Dashboard`, `PIO`, `Capsicum`), planning instructions are currently fragmented across multiple competing files:
1. `.agent/skills/writing-plans/SKILL.md` (TDD bite-sized planning, recently upgraded with Gate 0 `P-TICKET-FIRST-PHASING-001`).
2. `.agent/skills/planning-with-files/SKILL.md` (Manus-style file planning: `task_plan.md`, `findings.md`, `progress.md`).
3. `.agent/workflows/plan.md` (Slash command workflow `/plan`).
4. `.agent/workflows/implementation-plan-template.md` (External review template).
5. `.agent/workflows/complex-architecture-blueprint.md` (AVP protocol blueprinting).

### 2. Failure Modes Caused by Fragmentation
- **Cognitive Drift**: When moving between repositories or prompts, agents select different planning styles unpredictably.
- **Taxonomy Collision**: `Task-Dashboard` uses `TASK-###` and React/Firestore rules; `Sree_Krushna` uses `SK-###` and vanilla SDCA (`_src/`). If a planning skill hardcodes repo conventions, it cannot be shared; if it omits repo conventions, agents generate code in the wrong folders.
- **Token Waste**: Storing 5 different planning instructions across `.agent/skills/` and `.agent/workflows/` consumes token context and causes maintenance burden.

### 3. The Canonical Target Architecture: The SAP Dual-Block Marker System
Consolidate all planning instructions into a single canonical skill (anchored in `.agent/skills/writing-plans/SKILL.md` with `/plan` aliases) partitioned by standard SAP delimiters:

```markdown
<!-- shared:std.agent.planning-engine.core:start -->
# Universal Planning Engine (Repo-Agnostic Core)
- 4-PPSD Problem-Solving Discipline & Reality-First Grounding (RFG-001).
- Gate 0: Mandatory Ticket Registration Gate (P-TICKET-FIRST-PHASING-001).
- Sequential Phased Definition of Done (DoD v1.7) Matrix generation (T1–T4).
- Bite-Sized TDD Task Structure (Step 1 Failing Test -> Step 2 Run Fail -> Step 3 Minimal Implementation -> Step 4 Run Pass -> Step 5 Atomic Commit).
- Binary Validation Gates (VG) & Decision Nodes (DN) per phase.
- Mandatory Plan Hard-Stop & Intent Decoupling (INC-079).
<!-- shared:std.agent.planning-engine.core:end -->

<!-- repo-specific:<repo>:start -->
# Repository Extensions (Configured Per-Repo)
- Dynamic Prefix & Counter: Reads enhancement-config.json (canonical_prefix, next_id).
- Compiler & Build Toolchain: e.g. SDCA node <module>_src/build.cjs --all.
- Shared UI Primitives: ui_primitives/ (Carousel, Lightbox, Option Intake, Comments).
- Parity & Release Invariants: Root (/) and Public (/public) 100% byte parity.
- Verification Commands: npm run verify:governance-wiring:all, verify:modular-architecture, etc.
<!-- repo-specific:<repo>:end -->
```

Running `/sap-sync` synchronizes the `shared:std.agent.planning-engine.core` block losslessly across all repositories while preserving each repository's local `repo-specific` block intact.

---

## 🧭 Definition of Ready (DoR) / 5 Lenses Analysis

1. **User Value**: Zero cognitive overhead for human operators. Any agent in any repo prompted with `/plan` or a multi-phase task will automatically follow the exact same disciplined, ticket-anchored, TDD process.
2. **Drawbacks / Risks**: Merging multiple planning documents into one could make the file too large if not edited tightly. *Mitigation*: Strictly enforce succinct, bulleted instructions under 350 lines total.
3. **Efficiency Impact**: Removes duplicate planning files, standardizes test-first methodology, and guarantees automatic cross-repo synchronization via `/sap-sync`.
4. **Codebase Complexity**: Net negative complexity (deletes redundant workflows, unifies disparate planning docs).
5. **Net Justification**: Highly justified. Ratified by Architecture Council Decision `AC-DEC-2026-044` / `UI-DEC-2026-040`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### 🛡️ 4-Tier Verification Matrix (v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax/Lint | Valid YAML in `.agent/skill-router.yaml`, valid JSON in `standards-catalog.json`, clean markdown formatting. |
| **T2** | **Functional** | Router & Triggers | Prompting `/plan` or "create implementation plan" routes cleanly to the consolidated skill without errors. |
| **T3** | **Integrated** | Cross-Repo SAP | `shared:std.agent.planning-engine.core` extracted cleanly with standard SAP start/end comment delimiters. |
| **T4** | **Standard** | Governance | 100% pass on `npm run verify:governance-wiring:all` (all 188+ artifacts green) and DISC-001 discoverability compliant. |

---

### Phase 1: Planning Inventory & Cross-Repo Drift Audit

**Objective**: Audit all active planning artifacts across `Sree_Krushna`, `Task-Dashboard`, and `PIO`, identify overlapping or contradictory instructions, and formulate the canonical specification.

- [x] **Task 1.1: Multi-Repo Artifact Inventory**
  - Inspect `.agent/skills/writing-plans/SKILL.md`.
  - Inspect `.agent/skills/planning-with-files/SKILL.md`.
  - Inspect `.agent/workflows/plan.md`.
  - Inspect `.agent/workflows/implementation-plan-template.md`.
  - Inspect `.agent/workflows/complex-architecture-blueprint.md`.
- [x] **Task 1.2: Commonalities & Delta Extraction**
  - Extract universal invariants: Gate 0 ticket check (`P-TICKET-FIRST-PHASING-001`), TDD 5-step tasks, binary Validation Gates (VG), Decision Nodes (DN), plan hard-stop (`INC-079`).
  - Extract repo-specific variables: ID prefix (`canonical_prefix`), test frameworks (`node --test`, `jest`, `pytest`), compiler hooks.
- [x] **Task 1.3: Document Specification**
  - Author `enhancement-notes/SK-008/01_SPEC_PLANNING_ENGINE.md` capturing the final consolidated layout.

**🔍 Validation Gate (VG-1)**:
- Run: `node -e "assert(require('fs').existsSync('enhancement-notes/SK-008/01_SPEC_PLANNING_ENGINE.md'))"`
- Binary Check: Spec file exists and contains both `shared:std.agent.planning-engine.core` and `repo-specific` sections.

**🚦 Decision Node (DN-1)**:
- **Pass**: Proceed to Phase 2.
- **Fail**: Refine draft specification against `AC-DEC-2026-044` before proceeding.

---

### Phase 2: Design & Author the SAP-Partitioned Canonical Skill

**Objective**: Author the unified canonical planning skill in `.agent/skills/writing-plans/SKILL.md` embedding both SAP marker blocks.

- [ ] **Task 2.1: Author Repo-Agnostic Core (`shared:std.agent.planning-engine.core`)**
  - Embed Gate 0: Mandatory Ticket Registration Gate (`P-TICKET-FIRST-PHASING-001`).
  - Embed 4-Tier DoD v1.7 Generation template (T1 Static, T2 Functional, T3 Integrated, T4 Governance).
  - Embed Bite-Sized TDD Task Structure (Step 1 Failing Test -> Step 2 Run Fail -> Step 3 Minimal Implementation -> Step 4 Run Pass -> Step 5 Atomic Commit).
  - Embed Binary Validation Gates (max 2 checks, exit code + output regex) and Decision Nodes (Pass, Fail 1st retry, Fail 2nd escalate).
  - Embed Mandatory Plan Hard-Stop: halt after Phase 1 planning without writing code.
- [ ] **Task 2.2: Author Repo-Specific Extension (`repo-specific:sree-krushna`)**
  - Read `canonical_prefix` (`SK`) and `next_id` dynamically from `enhancement-config.json`.
  - Configure SDCA module compilers: `node shopping_src/build.cjs --all`, `node cockpit_src/build.cjs --all`.
  - Configure shared UI primitives (`ui_primitives/`).
  - Configure verification commands: `npm run verify:modular-architecture`, `npm run verify:ui-lifecycle`, `npm run verify:deployment`, `npm run verify:governance-wiring:all`.
- [ ] **Task 2.3: Keep Skill File Under 350 Lines**
  - Verify `.agent/skills/writing-plans/SKILL.md` is tight, highly disciplined, and under 350 lines.

**🔍 Validation Gate (VG-2)**:
- Run: `grep -c "shared:std.agent.planning-engine.core:start" .agent/skills/writing-plans/SKILL.md`
- Expected: Exactly 1 match.
- Run: `grep -c "repo-specific:sree-krushna:start" .agent/skills/writing-plans/SKILL.md`
- Expected: Exactly 1 match.

**🚦 Decision Node (DN-2)**:
- **Pass**: Proceed to Phase 3.
- **Fail**: Fix missing SAP delimiter tags in `writing-plans/SKILL.md`.

---

### Phase 3: Skill Deprecation, Consolidation & Router Wiring

**Objective**: Align skill routers, slash command workflows, and deprecate redundant planning files with clean pointers.

- [ ] **Task 3.1: Update `.agent/workflows/plan.md`**
  - Ensure `/plan` delegates directly to `.agent/skills/writing-plans/SKILL.md` without duplicating template logic.
- [ ] **Task 3.2: Deprecate Redundant Workflows**
  - Add deprecation headers to `.agent/skills/planning-with-files/SKILL.md` and `.agent/workflows/implementation-plan-template.md` pointing to `writing-plans`.
- [ ] **Task 3.3: Skill Router Alignment**
  - Verify `.agent/skill-router.yaml` routes `/plan`, `writing-plans`, and planning keywords directly to `writing-plans/SKILL.md`.
- [ ] **Task 3.4: Invariants & Standards Catalog Synchronization**
  - Register `STD-PLANNING-ENGINE-001` / `P-UNIVERSAL-PLANNING-ENGINE-001` in `.agent/standards-catalog.json`.
  - Update `GEMINI.md` and `CLAUDE.md` under Core Operating Protocols.

**🔍 Validation Gate (VG-3)**:
- Run: `npm run verify:governance-wiring:all`
- Expected: 100% green pass across all registered artifacts (188+ green).

**🚦 Decision Node (DN-3)**:
- **Pass**: Proceed to Phase 4.
- **Fail**: Fix broken link or router path identified by `verify-governance-wiring.cjs`.

---

### Phase 4: Cross-Repo SAP Synchronization & Verification Gate

**Objective**: Validate the engine under live test scenarios and package the SAP sync manifest for cross-repo propagation.

- [ ] **Task 4.1: Live Plan Generation Smoke Test**
  - Test the newly unified engine by simulating a planning request: verify it halts at Gate 0 if un-ticketed, verifies active ticket, generates sequential phased DoD matrix, outputs Phase 1 TDD steps, and halts.
- [ ] **Task 4.2: Prepare Cross-Repo `/sap-sync` Manifest**
  - Document the exact `/sap-sync` payload in `enhancement-notes/SK-008/02_SAP_SYNC_MANIFEST.md` for propagation to `Task-Dashboard` and `PIO`.
- [ ] **Task 4.3: Update Enhancement Status & Cluster Index**
  - Mark `SK-008` as `COMPLETED` in `enhancement-notes/SK-008/00_ENHANCEMENT_INDEX.md`, `docs/enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md`, and `ENHANCEMENT-MASTER-REGISTRY.md`.

**🔍 Validation Gate (VG-4)**:
- Run: `npm run verify:governance-wiring:all`
- Expected: 100% pass (Exit code 0).

**🚦 Decision Node (DN-4)**:
- **Pass**: Close ticket SK-008.
- **Fail**: Diagnose validation failure, correct, and re-run.

---

## 🛠️ Delegated Agent Turnkey Runbook

If you are an agent picking up this ticket to implement:

1. **Rule 1: Reality-First Grounding (`RFG-001`)**
   - Ground all edits in actual disk files. Never guess file paths.
2. **Rule 2: Sequential Phased Execution (`STD-PHASED-DEV-001`)**
   - Execute strictly Phase 1 -> Phase 2 -> Phase 3 -> Phase 4.
   - Do NOT chain multiple phases into a single uncommitted execution turn.
   - Run the binary Validation Gate (`VG-#`) after completing each phase.
3. **Rule 3: Boundary Protection**
   - Do NOT edit operational files in `shopping_src/`, `cockpit_src/`, or `ui_primitives/`. This is a pure Governance/Architecture ticket.
4. **Rule 4: Preservation of SAP Delimiters**
   - Every shared block MUST start with `<!-- shared:std.agent.planning-engine.core:start -->` and end with `<!-- shared:std.agent.planning-engine.core:end -->`.
   - The repo-specific block MUST start with `<!-- repo-specific:sree-krushna:start -->` and end with `<!-- repo-specific:sree-krushna:end -->`.
5. **Rule 5: Verification Suite Command**
   - After any edit, run:
     ```bash
     npm run verify:governance-wiring:all
     ```
     Ensure all checks remain 100% green.
