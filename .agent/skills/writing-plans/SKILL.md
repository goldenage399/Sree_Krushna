---
name: writing-plans
description: Universal canonical planning engine for multi-step tasks, phased TDD implementation plans, and cross-repo SAP synchronization
---

# Universal Canonical Planning Engine

## Overview

Use this skill when you have requirements, an architectural decision, or an enhancement specification for a multi-step task before touching any code. Document everything needed: target files, exact line numbers, code snippets, test commands, validation gates, and commit boundaries.

Assume the implementer is a skilled engineer who has zero prior context for this repository, requires unambiguous step-by-step guidance, and practices strict Test-Driven Development (TDD) with frequent atomic commits.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

---

<!-- shared:std.agent.planning-engine.core:start -->
## Universal Planning Core (Repo-Agnostic Engine)

### 1. 4-Phase Problem-Solving Discipline & Reality-First Grounding (4-PPSD / RFG-001)
Every plan must be grounded in physical codebase reality:
- **Phase 1 (Ground Truth & Intent)**: Verify existing files, line numbers, caller trees, and data structures on disk before proposing changes. Never assume paths exist.
- **Phase 2 (Domain & External Benchmarks)**: Search existing codebase patterns and established industry standards before inventing custom abstractions.
- **Phase 3 (Objective Rule Synthesis)**: Declare explicit precedence ladders, state invariants, and data contracts.
- **Phase 4 (Evidence-Based Execution)**: Structure every task with reproducible binary tests, validation gates, and atomic commits.

---

### 2. Gate 0: Mandatory Ticket Registration & Phased Scaffolding (P-TICKET-FIRST-PHASING-001)

> **Governing Pattern**: [`.agent/patterns/phased-development-ticket-first-gate.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/patterns/phased-development-ticket-first-gate.md)  
> **Standard**: `STD-PHASED-DEV-001` / `AC-DEC-2026-042`

Before drafting any implementation plan or code steps, evaluate complexity thresholds:
1. **Multi-phased**: Work requiring ≥2 sequential phases or milestones.
2. **Multi-surface / Cross-layer**: Work touching ≥2 files, modules, or sub-systems.
3. **Substantial complexity**: Work exceeding 200 lines estimated or >1 working session.

**Enforcement Rules:**
- **HALT before planning**: If ANY of the above apply, verify whether a corresponding ticket is formally registered in `enhancement-notes/` and `ENHANCEMENT-MASTER-REGISTRY.md`.
- **Scaffold Ticket First**: If no active ticket exists, invoke `enhancement-scaffolder` / `enhancement-protocol-enforcer` to mint the ID, scaffold `00_ENHANCEMENT_INDEX.md`, and log to the domain cluster before drafting the plan.
- **Exemptions**: Single-file surgical bugfixes (<50 lines) with a single obvious root cause and documentation typos are exempt from ticket scaffolding, saving standalone plans to `docs/plans/YYYY-MM-DD-<name>.md`.
- **Sequential Decomposition**: Multi-phase plans must generate an explicit sequential Definition of Done (DoD) phase matrix. Never combine multiple phases into a single uncommitted turn.

---

### 3. Mandatory Plan Hard-Stop & Intent Decoupling (INC-079 / AC-DEC-2026-044)

> **Governing Pattern**: [`.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md)

- **Halt After Planning**: The planning phase concludes once the plan is saved to disk. The agent MUST NOT write implementation code in the same prompt turn.
- **Scoping Boundary (Phase 1 Detail First)**: For multi-phase initiatives, document the full sequential DoD matrix (Phases 1–N) in the ticket index, but detail the 5-step TDD tasks specifically for **Phase 1** first. Detailing speculative tasks for Phases 2–4 before Phase 1 passes validation causes token exhaustion and plan drift.

---

### 4. Plan Document Header & Phased DoD Matrix

Every implementation plan must begin with this standardized header:

```markdown
# [Ticket ID / Feature Name] Implementation Plan

> **Governing Ticket**: `enhancement-notes/{ID}/00_ENHANCEMENT_INDEX.md`  
> **Target Release**: [e.g. v2.4.0]  
> **Goal**: [One clear sentence describing what this builds or fixes]  
> **Architecture**: [2-3 sentences explaining architectural approach and affected layers]  
> **Tech Stack / Toolchain**: [Frameworks, test runners, compilers, design tokens]  

---

## Sequential Phased Definition of Done (DoD v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax/Lint | Valid schemas, clean markdown formatting, zero linter warnings. |
| **T2** | **Functional** | Unit/Component | Core business logic verified by passing unit/component tests. |
| **T3** | **Integrated** | Cross-Module | Inter-module wiring, build compilers, and byte-parity verified. |
| **T4** | **Governance** | Compliance | Governance verification suites green and patterns wired. |
```

---

### 5. Bite-Sized TDD Task Structure (5-Step Atomic Pattern)

Decompose each phase into discrete tasks. Every task must follow the strict 5-step TDD cycle:

```markdown
### Task N.M: [Imperative Component Name]

**Files:**
- Create: `exact/path/to/file.js`
- Modify: `exact/path/to/existing.js:123-145`
- Test: `exact/path/to/test.js`

**Step 1: Write failing test**
[Provide complete, executable test code]

**Step 2: Run test to verify it fails**
Run: `npm test -- <test-path>` or `<test-command>`
Expected: FAIL with specific error message

**🔍 Validation Gate (VG)**:
  1. (Binary) Exit code non-zero AND output matches "<expected failure message>"

**🚦 Decision Node (DN)**:
  - **Pass**: Proceed to Step 3.
  - **Fail (1st)**: Test unexpectedly passed. Inspect file at specified path before continuing.
  - **Fail (2nd)**: Halt. Surface to user: "Step 2 gate failed after retry — test is not failing as expected."

**Step 3: Write minimal implementation**
[Provide exact minimal implementation code to pass test]

**Step 4: Run test to verify it passes**
Run: `npm test -- <test-path>` or `<test-command>`
Expected: PASS with 0 errors

**🔍 Validation Gate (VG)**:
  1. (Binary) Exit code 0 AND output matches "<expected pass indicator>"

**🚦 Decision Node (DN)**:
  - **Pass**: Proceed to Step 5.
  - **Fail (1st)**: Roll back changes using `git checkout -- <file>`, diagnose failure, and re-implement.
  - **Fail (2nd)**: Halt. Surface to user: "Step 4 gate failed after retry. Test output: [output]."

**Step 5: Atomic Commit**
Run: `git add <files>` && `git commit -m "<type>(<scope>): <clear description>"`
```

---

### 6. Binary Validation Gate (VG) Rules & Decision Nodes (DN)

Apply these rules to all task verification gates:
- **Max 2 gate checks per step/phase**: If more than 2 checks are needed, split the step.
- **Binary Only**: Validation checks must produce a boolean result (exit code 0/non-zero, exact output regex). Advisory visual or design checks must be marked `[human-review]` and do not block automation.
- **Actionable Retry on Fail (1st)**: Always name a concrete rollback command or diagnostic step. Never use vague terms like "investigate".
- **Escalate on Fail (2nd)**: Halt and surface error context to the user. Silent looping past two failures on the same gate is strictly prohibited.

---

### 7. Execution Handoff
After saving the plan, present the execution approach to the user:
1. **Subagent-Driven**: Dispatch fresh subagent per phase/task with checkpoints.
2. **Sequential Session**: Execute Phase 1 tasks sequentially with atomic commits.
3. **Governed Execution**: Require user gate sign-off after each phase.
<!-- shared:std.agent.planning-engine.core:end -->

---

<!-- repo-specific:sree-krushna:start -->
## Repository Extensions (Sree Krushna Marriage OS)

### 1. Dynamic ID Prefix & Counter Configuration
- **Configuration SSOT**: `enhancement-config.json` (`canonical_prefix: "SK"`, `next_id: <N>`).
- **Ticket Directory**: `enhancement-notes/SK-###/` (scaffolded via `/enhancement-scaffolder`).
- **Master Registry**: `ENHANCEMENT-MASTER-REGISTRY.md` and `docs/enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md` (or relevant cluster file).
- **Implementation Plan Path**:
  - Active ticket: `enhancement-notes/SK-###/implementation_plan.md`
  - Single-scope patch (exempt): `docs/plans/YYYY-MM-DD-<feature-name>.md`

### 2. Static Decoupled Component Assembler (SDCA) Toolchain
- **Zero Monolithic UI Scripts (`STD-MOD-COMP-001`)**: No web module script or assembler may exceed 500 lines or embed raw monolithic HTML/CSS inline.
- **Modular Directory Structure**: All UI engines reside in `<module>_src/` (`components/`, `styles/`, `scripts/`, `template.html`, `build.cjs`).
- **Compiler Commands**:
  - Shopping Registry: `node shopping_src/build.cjs --all`
  - Decorator Cockpit: `node cockpit_src/build.cjs --all`
- **Dual-Release Byte Parity**: Root (`/`) and Public (`/public`) artifacts must maintain 100% byte parity:
  - `shopping-registry.html` == `public/shopping-registry.html`
  - `shopping-fragment.html` == `public/shopping-fragment.html`
  - `decorator-cockpit.html` == `public/decorator-cockpit.html`
  - `cockpit-fragment.html` == `public/cockpit-fragment.html`

### 3. Shared UI Primitives (`ui_primitives/`)
Cross-cutting UI features must be imported from `ui_primitives/` rather than re-invented:
- Carousel & Lightbox: `ui_primitives/components/`, `ui_primitives/scripts/`
- Option Intake Modal: `ui_primitives/components/option_intake_modal.html`
- Collaborative Comments Engine: `ui_primitives/scripts/comments_engine.js`, `ui_primitives/styles/03_comments_drawer.css`
- WhatsApp Share & Toast: `ui_primitives/scripts/`

### 4. Pre-Flight Governance Verification Suites
Plans modifying UI, governance, or schemas must pass these checks prior to phase completion:
- **Governance Wiring Parity (P82)**:
  ```bash
  npm run verify:governance-wiring:all
  ```
- **Modular Architecture & Parity**:
  ```bash
  npm run verify:modular-architecture
  ```
- **Dynamic UI Lifecycle & Modal Dismissibility**:
  ```bash
  npm run verify:ui-lifecycle
  ```
- **Web Deployment Readiness Gate**:
  ```bash
  npm run verify:deployment
  ```
<!-- repo-specific:sree-krushna:end -->
