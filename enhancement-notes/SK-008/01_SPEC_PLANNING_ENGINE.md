# SK-008: Universal Canonical Planning Engine Specification

> **Standard Identifier:** `P-UNIVERSAL-PLANNING-ENGINE-001` / `STD-PLANNING-ENGINE-001`  
> **Council Decisions:** `AC-DEC-2026-042` (Ticket Gate) & `AC-DEC-2026-044` (Planning Engine Consolidation)  
> **Target Skill:** `.agent/skills/writing-plans/SKILL.md`  
> **Canonical Slash Command:** `.agent/workflows/plan.md` (`/plan`)  
> **Date:** 2026-09-24  
> **Status:** SPECIFICATION APPROVED (Phase 1 Deliverable)

---

## 1. Executive Summary & Problem Context

Across the Standard Agent Protocols (SAP) ecosystem (`Sree_Krushna`, `Task-Dashboard`, `PIO`, `Capsicum`), planning instructions have historically suffered from multi-skill fragmentation across five competing artifacts:
1. `.agent/skills/writing-plans/SKILL.md`
2. `.agent/skills/planning-with-files/SKILL.md`
3. `.agent/workflows/plan.md`
4. `.agent/workflows/implementation-plan-template.md`
5. `.agent/workflows/complex-architecture-blueprint.md`

### Identified Failure Modes
- **Cognitive Drift**: Agents choose planning styles unpredictably depending on prompt phrasing.
- **Taxonomy Collision**: Hardcoded repo-specific conventions (e.g. `TASK-###` vs `SK-###`) prevent clean skill sharing across repos.
- **Maintenance Debt & Token Waste**: Maintaining duplicate template logic across workflows and skills consumes tokens and leads to divergent validation rules.
- **Monolithic Execution Chaining**: Agents attempt to draft and execute multi-phase plans in a single uncommitted turn without binary validation gates.

---

## 2. Multi-Repo Artifact Inventory & Disposition Matrix

| Artifact | Current Role | Strengths | Failure Modes / Gaps | Disposition under SK-008 |
| :--- | :--- | :--- | :--- | :--- |
| `.agent/skills/writing-plans/SKILL.md` | Core TDD bite-sized planning engine | High discipline, Gate 0 ticket check, strict 5-step TDD tasks, binary VG/DN blocks | Lacked SAP delimiters; contained python-only test examples; did not parameterize repo build tools | **CANONICAL HOST**: Upgraded to host both SAP-shared core and repo-specific extension (<350 lines). |
| `.agent/skills/planning-with-files/SKILL.md` | Manus-style persistent markdown planner | Working memory on disk, 3-strike error protocol | Creates loose root files (`task_plan.md`, `findings.md`) outside ticket folders, causing unanchored state drift | **DEPRECATED**: Add deprecation header pointing to `writing-plans`. Preserved as legacy reference. |
| `.agent/workflows/plan.md` | `/plan` slash command workflow | Step 0.1 pattern references, INC-068 query gate, 4-PPSD check | Duplicated template selection logic; ambiguously routed to `planning-with-files` | **CONSOLIDATED**: Kept as slim workflow router delegating directly to `writing-plans/SKILL.md`. |
| `.agent/workflows/implementation-plan-template.md` | Feature planning review template | Structured sections (State Machine, Data, Permissions) | Static template ported from Task-Dashboard; hardcoded React/Firestore assumptions | **DEPRECATED**: Add deprecation header pointing to `writing-plans`. |
| `.agent/workflows/complex-architecture-blueprint.md` | C4/AVP multi-module blueprinting | C4 diagrams, gap analysis, ADR documentation | Architectural blueprinting, not tactical task planning | **RETAINED AS ARCHITECTURAL WORKFLOW**: Kept for Phase A/B architecture blueprints, but tactical implementation plans route to `writing-plans`. |

---

## 3. Architecture: The Dual-Block SAP Partition

The canonical planning engine is split into two explicit marker blocks:

```
┌────────────────────────────────────────────────────────────────────────┐
│ .agent/skills/writing-plans/SKILL.md                                  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ <!-- shared:std.agent.planning-engine.core:start -->             │  │
│  │                                                                  │  │
│  │  1. 4-PPSD Problem Solving Discipline (Ground Truth First)       │  │
│  │  2. Gate 0: Mandatory Ticket Registration Gate                   │  │
│  │  3. Sequential Phased DoD Matrix Generation (T1–T4 Standard)      │  │
│  │  4. Bite-Sized TDD Task Structure (5-Step Atomic Pattern)        │  │
│  │  5. Binary Validation Gates (VG) & Decision Nodes (DN)           │  │
│  │  6. Mandatory Plan Hard-Stop & Intent Decoupling (INC-079)       │  │
│  │                                                                  │  │
│  │ <!-- shared:std.agent.planning-engine.core:end -->               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ <!-- repo-specific:sree-krushna:start -->                        │  │
│  │                                                                  │  │
│  │  1. Dynamic Taxonomy: Reads enhancement-config.json (SK-###)     │  │
│  │  2. Toolchain & Compilers: SDCA build.cjs --all, parity check    │  │
│  │  3. Shared UI Primitives: ui_primitives/ contracts               │  │
│  │  4. Governance Commands: npm run verify:governance-wiring:all    │  │
│  │                                                                  │  │
│  │ <!-- repo-specific:sree-krushna:end -->                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Universal Invariants (`shared:std.agent.planning-engine.core`)

### 4.1 Reality-First Grounding & 4-PPSD (`RFG-001`)
- **Phase 1 (Ground Truth)**: Analyze existing files, disk schemas, and callers before proposing changes.
- **Phase 2 (External Benchmarks)**: Check standard library and ecosystem standards before creating new abstractions.
- **Phase 3 (Objective Rules)**: Formulate explicit precedence ladders and validation contracts.
- **Phase 4 (Evidence-Based Execution)**: Every task must have an exact binary test command and expected output.

### 4.2 Gate 0: Mandatory Ticket Registration Gate (`P-TICKET-FIRST-PHASING-001` / `AC-DEC-2026-042`)
- **Trigger**: Work requiring ≥2 phases, spanning ≥2 modules/sub-engines, or exceeding 200 lines of changes.
- **Exemptions**: Surgical single-file bugfixes (<50 lines) with an obvious root cause, documentation typos.
- **Rule**: If triggered, halt and verify that a ticket is scaffolded in `enhancement-notes/{ID}/` and `ENHANCEMENT-MASTER-REGISTRY.md`. Never write unanchored multi-phase plans.

### 4.3 Sequential Phased DoD Matrix Generation (DoD v1.7 Standard)
Plans must generate a 4-Tier DoD table:
- **T1 Static**: Syntax, linting, schema validation.
- **T2 Functional**: Feature behavior, unit tests, component state.
- **T3 Integrated**: Cross-module wiring, build toolchain, public parity.
- **T4 Governance**: Governance wiring parity, standards catalog registration.

### 4.4 Bite-Sized TDD Task Structure
Every execution task must strictly follow the 5-step TDD cycle:
1. **Step 1**: Write failing test.
2. **Step 2**: Run test to verify it fails.
3. **Step 3**: Write minimal implementation.
4. **Step 4**: Run test to verify it passes.
5. **Step 5**: Commit atomically.

### 4.5 Binary Validation Gates (VG) & Decision Nodes (DN)
- **Max 2 gate checks per step/phase**.
- Checks must be binary (exit code 0/non-zero, exact output regex). Human visual review must be marked `[human-review]` (advisory only).
- **Decision Nodes**:
  - `Pass`: Proceed to next step.
  - `Fail (1st)`: Explicit rollback command and targeted diagnose step.
  - `Fail (2nd)`: Halt and surface error output to user. Silent looping forbidden.

### 4.6 Mandatory Plan Hard-Stop & Intent Decoupling (`INC-079` / `AC-DEC-2026-044`)
- The planning phase concludes with the plan saved to disk and a formal hard-stop.
- Agents MUST NOT chain planning and code execution into a single prompt turn.
- Implementation plans scope detailed 5-step TDD tasks to **Phase 1**, with subsequent phases outlined in the sequential DoD matrix.

---

## 5. Repository Extensions (`repo-specific:sree-krushna`)

In `Sree_Krushna`, the planning engine binds to:
- **Taxonomy**: `canonical_prefix: "SK"` read from `enhancement-config.json`. Active tickets live in `enhancement-notes/SK-###/`.
- **Architecture**: Static Decoupled Component Assembler (SDCA). Modules compiled via `node <module>_src/build.cjs --all`.
- **Dual-Release Parity**: Root (`/`) and Public (`/public`) artifacts must maintain 100% byte parity (`npm run verify:modular-architecture`).
- **UI Primitives**: Cross-cutting primitives imported from `ui_primitives/` (Carousel, Lightbox, Option Intake Modal, Comments Engine).
- **Governance Gate**: `npm run verify:governance-wiring:all` must pass 100% green before ticket closure.

---

## 6. Cross-Repo Propagation Specification (`/sap-sync`)

When `/sap-sync` runs:
1. It locates `<!-- shared:std.agent.planning-engine.core:start -->` and `<!-- shared:std.agent.planning-engine.core:end -->` in `writing-plans/SKILL.md`.
2. It propagates this block into target repositories (`Task-Dashboard`, `PIO`, `Capsicum`).
3. It leaves each repository's local `<!-- repo-specific:<repo>:start -->` block completely untouched.
4. In `Task-Dashboard`: local block configures `TASK-###`, Vite/React, and `src/components/admin/`.
5. In `PIO`: local block configures `PIO-###`, GAS/Python, and service layer maps.

---

## 7. Phased Implementation Roadmap for SK-008

- [x] **Phase 1: Planning Inventory & Drift Audit** (Completed — `01_SPEC_PLANNING_ENGINE.md` created)
- [ ] **Phase 2: Design & Author the SAP-Partitioned Canonical Skill** (Target: `.agent/skills/writing-plans/SKILL.md` under 350 lines)
- [ ] **Phase 3: Skill Deprecation, Consolidation & Router Wiring** (Target: `/plan`, `planning-with-files`, `skill-router.yaml`, `standards-catalog.json`)
- [ ] **Phase 4: Cross-Repo SAP Synchronization & Verification Gate** (Target: Smoke test, `02_SAP_SYNC_MANIFEST.md`, governance 100% pass)
