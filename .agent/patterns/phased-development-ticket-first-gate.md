---
pattern: phased-development-ticket-first-gate
activation_tier: routed
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: GEMINI.md
    at: "4. Pattern Activation & PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"
  - file: .agent/skills/writing-plans/SKILL.md
    at: "Gate 0: Mandatory Ticket Registration & Phased Scaffolding"
triggers:
  - "multi-phase planning"
  - "ticket first gate"
  - "register ticket before plan"
  - "multi-surface development"
  - "phased dod matrix"
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Mandatory Ticket Registration & Phased Planning Gate Protocol

**Category**: Governance / SDLC Execution Control & Architecture Lifecycle  
**Identifier**: `P-TICKET-FIRST-PHASING-001` / `STD-PHASED-DEV-001`  
**Applies to**: `writing-plans`, `.agent/workflows/plan.md`, `enhancement-scaffolder`, `enhancement-protocol-enforcer`, `/governance-workflow`, `/architecture-council`  
**Origin**: 2026-09-24 Architecture Council Deliberation (`AC-DEC-2026-042` / `UI-DEC-2026-038` / SK-007 Scaffolding Session)  
**Status**: VALIDATED  

---

## 1. Executive Summary & Core Principle

> **Core Invariant**:  
> *"No multi-directional, multi-surface, or multi-phased development work may proceed to implementation planning or code mutation without a formally registered enhancement ticket and an explicit sequential Definition of Done (DoD) phase matrix."*

When an AI agent or engineer encounters a non-trivial problem involving multiple files, features, sub-systems, or exploratory directions, the natural failure mode is to immediately begin editing code or drafting an ad-hoc implementation plan. 

This leads to:
1. **Unanchored Scope ("The Ghost PR")**: Work is carried out across multiple files without a persistent tracking anchor in `enhancement-notes/` or `ENHANCEMENT-MASTER-REGISTRY.md`.
2. **Context Loss on Reset/Compaction**: When context windows reset or browser sessions refresh, uncommitted multi-surface modifications become impossible to reconstruct or verify.
3. **Execution Chaining & Regression Cascades**: The agent executes Phase 1, Phase 2, and Phase 3 in a continuous, unverified loop, masking regressions and leaving halfway-broken intermediate states.

This pattern institutes a strict **Pre-Planning Gating Check** that forces the registration of an enhancement ticket and decomposition into sequential, independently verifiable phases before code is touched.

---

## 2. Trigger Boundary: When Does This Gate Apply?

An initiative MUST pass through the Ticket Registration & Phased Planning Gate if it meets **ANY ONE** of the following criteria:

| Trigger Axis | Threshold / Condition | Example |
| :--- | :--- | :--- |
| **Phasing** | Requires ≥2 distinct sequential steps or milestones | Phase 1: Bugfix ➔ Phase 2: State machine ➔ Phase 3: UI drawer |
| **Multi-Surface / Blast Radius** | Spans ≥2 architectural domains, engines, or subdirectories | Touches both `shopping_src/` and `ui_primitives/`, or Firestore rules + UI client |
| **Complexity / Volume** | Estimated effort >200 lines of diff OR >1 working session | Refactoring state stores, building recovery drawers, cross-module bridges |
| **Reversibility / Risk** | Involves destructive mutations, schema modifications, or auth rules | Soft-delete state machines, TTL purges, RBAC gates |

**Exemptions (Single-Scope Direct Execution)**:
- Pure single-file bugfixes (<50 lines) with a single obvious root cause.
- Typos, copy edits, or documentation typo corrections.
- Minor token tweaks in CSS files that do not affect layout geometry.

---

## 3. The 3-Gate Enforcement Lifecycle

```
               MULTI-PHASE INITIATIVE IDENTIFIED
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ Gate 1: Ticket Registration & Scaffolding Check        │
  │ - Is active ticket (SK-###, TASK-###) registered?      │
  │ - If NO: Invoke enhancement-scaffolder FIRST           │
  │ - Mint ID, create index, log to cluster & registry    │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ Gate 2: Sequential Phased DoD Matrix Formulation       │
  │ - Decompose initiative into Phase 1 .. Phase N         │
  │ - Define binary Validation Gates (VG) & Decision Nodes │
  │ - Anchor phases in 00_ENHANCEMENT_INDEX.md             │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ Gate 3: Phase-by-Phase Plan Hard-Stop & Execution      │
  │ - Present implementation plan with Phase 1 focus       │
  │ - HARD-STOP: Wait for explicit user review & sign-off  │
  │ - Execute, test, and commit Phase 1 BEFORE Phase 2     │
  └────────────────────────────────────────────────────────┘
```

### Gate 1: Ticket Registration & Scaffolding Check
Before drafting `implementation_plan.md` or opening code files:
1. Check `enhancement-config.json` for active canonical prefix (`SK`, `TASK`, `PIO`).
2. Search `enhancement-notes/` and `ENHANCEMENT-MASTER-REGISTRY.md` for an existing assigned ticket covering this exact problem.
3. If no active ticket exists:
   - Run `enhancement-scaffolder` / `enhancement-protocol-enforcer`.
   - Scaffold `enhancement-notes/{ID}-{Title}/00_ENHANCEMENT_INDEX.md`.
   - Append lean entry to the appropriate cluster in `docs/enhancements/`.
   - Update `ENHANCEMENT-MASTER-REGISTRY.md`.
   - Increment `next_id` in `enhancement-config.json`.

### Gate 2: Sequential Phased DoD Matrix Formulation
The ticket and plan MUST NOT use vague, monolithic milestone markers. They must define a strictly ordered phase matrix:
- **Phase 1: Ground Truth Fix / Baseline State**: Isolate and fix critical bugs or foundational data models first.
- **Phase 2: Administrative / RBAC & Core UI**: Implement state controls, permissions, and administrative interfaces.
- **Phase 3: Cross-Module / Shared Primitives**: Wire shared engines, multi-surface bridges, and real-time broadcasts.
- **Phase 4: Verification, Parity & Pre-Flight Gate**: Enforce 100% test coverage, dual-release byte parity, and deployment readiness.

Each phase must declare:
- **Target Files**: Exact absolute paths and line ranges.
- **Step-by-Step TDD Verification**: Shell commands and expected stdout/exit codes.
- **Binary Validation Gate**: Concrete condition that either passes or halts.

### Gate 3: Phase-by-Phase Plan Hard-Stop & Execution
In compliance with `.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md`:
1. The agent presents the complete phased roadmap to the user.
2. The agent executes a **MANDATORY HARD-STOP** asking for confirmation to begin Phase 1.
3. Once approved, the agent executes ONLY Phase 1.
4. Phase 1 must be verified (tests pass, clean diff) and committed before proceeding to Phase 2.
5. **No execution chaining**: The agent is strictly prohibited from executing multiple phases in a single unreviewed turn.

---

## 4. Verification and Governance Traceability

To ensure agents adhere to this pattern automatically:
1. **Writing-Plans Hook**: `writing-plans/SKILL.md` contains "Gate 0: Mandatory Ticket Registration & Phased Scaffolding (`P-TICKET-FIRST-PHASING-001`)" halting planning if no ticket is registered.
2. **Plan Workflow Hook**: `.agent/workflows/plan.md` enforces `Step 1: Mandatory Ticket Registration Gate`.
3. **Enhancement Enforcer Hook**: `enhancement-protocol-enforcer/SKILL.md` requires a phased DoD matrix for all complex tickets.
4. **Automated Verification**: Registered in `.agent/standards-catalog.json` under `P-TICKET-FIRST-PHASING-001`, verified by `npm run verify:governance-wiring:all`.
