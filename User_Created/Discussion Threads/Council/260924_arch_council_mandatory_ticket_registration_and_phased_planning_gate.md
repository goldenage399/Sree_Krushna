# 🏛️ Architecture & Governance Council Decision Record: Mandatory Ticket Registration & Phased Planning Gate

**Standard Identifier:** `STD-PHASED-DEV-001` / `P-TICKET-FIRST-PHASING-001` / `P-4PPSD`  
**Council Decision:** `AC-DEC-2026-042` / `UI-DEC-2026-038`  
**Date:** 2026-09-24  
**Type:** FULL Architecture & Governance Council Deliberation  
**Status:** ✅ CERTIFIED & IMPLEMENTATION-READY  
**Maturity Anchor (RFG-001):** Pre-launch wedding OS · 4–5 real users today (Host/Groom, Bride, Sisters, Parents), ~20 expected as wedding approaches · 2 visual modules (Shopping Registry & Decorator Cockpit) · 1 developer.

---

## 1. Context & Motivation

During the resolution of multi-faceted enhancements in `User_Created/Discussion Threads/Shopping/260918_ShoppingList.md` (Lines 4736–5165), an operational failure pattern was observed:
When requests involve **multi-directional, multi-surface, or multi-phased initiatives** (e.g., combining live hosting diagnosis, local persistence bugfixes, 30-day soft-delete retention, Host RBAC, and modular comments engine), agents have a natural tendency to jump into immediate, unanchored file modifications or unstructured execution plans.

The Host observed the successful intervention in Query 5.1—where execution was halted, an enhancement ticket (`SK-007`) was formally scaffolded with a 4-phase sequential Definition of Done (DoD) matrix, and registry configurations were synchronized before code was touched—and directed:
> *"Capture pattern and plan to enforce this always whenever there is multi-directional and multi-phased long development work that a ticket must be registered before proceeding and maybe we can add this to any of the skills that forces the local agent to adhere to it and plan in phases before proceeding with the implementation or when creating an implementation plan."*

---

## 2. Phase 0: Ground Truth & Evidence Collection

### 2.1 Evidence Snapshot
- **Git Commit Hash**: `28c14f6d742b0698ab7c02745428251858a72cef` (with working-tree modifications).
- **Files Inspected**:
  - `User_Created/Discussion Threads/Shopping/260918_ShoppingList.md:4736-5165`: Observed transition from ad-hoc multi-feature proposal to structured `SK-007` 4-phase DoD matrix.
  - `.agent/skills/writing-plans/SKILL.md`: Observed previous lack of a pre-planning ticket gate; agents were permitted to save unstructured plans to `docs/plans/` without tracking.
  - `.agent/workflows/plan.md`: Step 1 previously only checked for PIO context as an optional suggestion rather than a hard gate.
  - `.agent/skills/enhancement-protocol-enforcer/SKILL.md`: Observed Gate 3/5 complexity definitions that required `00_ENHANCEMENT_INDEX.md` but did not mandate sequential phased decomposition.
  - `scripts/verify-governance-wiring.cjs`: Confirmed P82 pattern activation contract (PACT-001) requires explicit bidirectional linking.
  - `enhancement-config.json`: Confirmed `canonical_prefix: "SK"`, `next_id: 8`.

### 2.2 External Industry Benchmarks & Research
1. **Linear / Jira Issue-First Workflow (Linear Method)**: In modern engineering environments, no non-trivial development work or PR is opened without an associated Issue/Epic ID. The issue serves as the single source of truth for scope boundaries, DoD, acceptance criteria, and rollback contingencies. Without an issue anchor, features suffer from uncommitted scope creep.
2. **RFC / ADR-First Process (Rust, Kubernetes, AWS)**: Any complex architectural initiative requires a written RFC or design doc specifying phases and milestones *before* writing code.
3. **Spotify Squad Health / Milestone Gating**: Breaking complex initiatives into discrete, verifiable phases prevents the "90% done" trap where a monolithic PR sits unmergeable and unverifiable.
4. **Git Feature Branch & Commit Isolation**: Atomic phased commits tied to ticket IDs (`SK-###: Phase 1 ...`) ensure git bisectability and clean rollback boundaries.

---

## 3. Phase 1: Independent Council Evaluation

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: Strongly endorse institutionalizing this standard. Unanchored plans in `docs/plans/` create "ghost features" that never enter `ENHANCEMENT-MASTER-REGISTRY.md` or domain cluster documents. Mandating ticket registration guarantees 100% SSOT traceability across `enhancement-notes/`, cluster files, and git history.
- **Evidence**: `ENHANCEMENT_PROTOCOL.md` §1 and `P-SSOT-DOCS`.
- **Challenge**: *"If every tiny 5-line bugfix requires an enhancement ticket, agent velocity will collapse under governance bureaucracy."*  
  *What would change my mind*: Establishing clear exemption boundaries: single-file surgical bugfixes (<50 lines) with a single obvious root cause and documentation typos are exempt. The gate triggers strictly on multi-phase (≥2 phases), multi-surface (≥2 files/modules), or complex (>200 lines) tasks.
- **Confidence**: High.

### 3.2 Schema & Process Integrity Auditor (`cos-invoke`)
- **Position**: Endorse. Enforcing sequential phase breakdowns prevents "execution chaining" where an agent executes Phase 1, Phase 2, and Phase 3 in a continuous loop without running tests or waiting for user validation.
- **Evidence**: `.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md` and `.agent/workflows/governance-workflow.md`.
- **Challenge**: *"Agents might scaffold a ticket but still write vague, monolithic tasks inside the ticket index without actionable validation gates."*  
  *What would change my mind*: Updating `enhancement-protocol-enforcer/SKILL.md` to mandate that Gate 5 implementation plans explicitly break work into numbered phases with binary Validation Gates (VG) and Decision Nodes (DN).
- **Confidence**: High.

### 3.3 Dependency & Impact Auditor (`change-impact-analysis`)
- **Position**: Approve. By wiring this requirement into both `writing-plans/SKILL.md` (Gate 0) and `.agent/workflows/plan.md` (Step 1), we intercept the agent at the exact cognitive entry point before an implementation plan is drafted.
- **Evidence**: Tracing the agent execution graph confirms that all planning workflows route through `writing-plans` or `/plan`.
- **Challenge**: *"If the plan workflow halts to scaffold a ticket, does the agent lose the user's original context or prompt constraints?"*  
  *What would change my mind*: Ensuring the ticket scaffolding step losslessly copies the user's intent and DoD requirements directly into `00_ENHANCEMENT_INDEX.md`, which then becomes the active parent container for `implementation_plan.md`.
- **Confidence**: High.

### 3.4 File Placement Auditor (`file-placement-guardrail`)
- **Position**: Approve. Pattern belongs in `.agent/patterns/phased-development-ticket-first-gate.md`. Standard belongs in `.agent/standards-catalog.json`. Invariants belong in `GEMINI.md` and `CLAUDE.md`.
- **Evidence**: Follows PACT-001 pattern specification and repository file placement conventions.
- **Challenge**: *"Adding a new pattern file without bidirectional PACT-001 links will cause `verify:governance-wiring` to fail."*  
  *What would change my mind*: Registering `consumed_by` references in `CLAUDE.md`, `GEMINI.md`, `plan.md`, and `writing-plans/SKILL.md` and verifying with `npm run verify:governance-wiring:all`.
- **Confidence**: High.

### 3.5 Decision & Standards Auditor (`complex-architecture-blueprint`)
- **Position**: Ratify as `STD-PHASED-DEV-001` / `P-TICKET-FIRST-PHASING-001`. This formalizes the 4-Phase Problem-Solving Discipline (`P-4PPSD`) at the operational task execution layer.
- **Evidence**: `standards-catalog.json` totalStandards bumped to 7.
- **Challenge**: *"Will this pattern conflict with existing ADRs or task lifecycle states?"*  
  *What would change my mind*: Verified zero conflicts; it directly complements `ADR-001` (Task state machines) and `INC-084` (Intent clarity decoupling).
- **Confidence**: High.

### 3.6 Auth & Governance Gatekeeper (`protocol-enforcer-pre-code`)
- **Position**: Approve. Enforcing ticket registration ensures that any destructive operations, RBAC changes, or schema mutations are vetted during ticket scaffolding rather than discovered mid-implementation.
- **Evidence**: `P-ENT-ID` and Protocol 6.
- **Challenge**: *"Agents running in subagent or automated modes might bypass `ask_question` during scaffolding."*  
  *What would change my mind*: Enforcing that `enhancement-config.json` increments programmatically and the ticket folder structure is generated deterministically.
- **Confidence**: High.

### 3.7 Maintainability & Velocity Auditor (ASSIGNED DISSENTER — RFG-001)
- **Position**: DISSENT against creating a complex multi-tool enforcement engine or heavy CLI linter when simple skill markdown hooks achieve 100% compliance with zero runtime overhead.
- **Evidence**: RFG-001 Reality-First Grounding: For a 1-developer, pre-launch wedding OS, adding an AST parser or Git pre-commit hook to parse tickets is severe over-engineering. Skill-level gates (`Gate 0` in `writing-plans/SKILL.md`) and workflow checks (`Step 1` in `plan.md`) completely solve the problem.
- **Challenge**: *"Will this create unnecessary friction that slows down development of active features like Shopping and Decorator Cockpit?"*  
  *What would change my mind*: Explicitly scoping the gate to multi-phase and multi-surface work only, ensuring that single-scope bugfixes remain rapid and lightweight, while complex initiatives benefit from structured safety.
- **Confidence**: High.

---

## 4. Phase 2: Synthesis & Resolution of Challenges

1. **SSOT Authority Auditor & Dissenter Challenge**:
   > *"If every tiny 5-line bugfix requires an enhancement ticket, agent velocity will collapse under governance bureaucracy."*
   - **Resolution**: Certified. The gate defines explicit trigger thresholds:
     - **Triggers**: Work requiring ≥2 phases, spanning ≥2 modules/sub-engines, or exceeding 200 lines of changes.
     - **Exemptions**: Surgical single-file bugfixes (<50 lines) with an obvious root cause, typos, and minor styling tweaks.

2. **Schema & Process Integrity Auditor Challenge**:
   > *"Agents might scaffold a ticket but still write vague, monolithic tasks inside the ticket index without actionable validation gates."*
   - **Resolution**: Certified. Gate 5 of `enhancement-protocol-enforcer/SKILL.md` was upgraded to mandate that `00_ENHANCEMENT_INDEX.md` break work into sequential numbered phases, each with its own scope, target files, and binary Validation Gates (VG) / Decision Nodes (DN).

3. **File Placement Auditor Challenge**:
   > *"Adding a new pattern file without bidirectional PACT-001 links will cause verify:governance-wiring to fail."*
   - **Resolution**: Certified. Bidirectional PACT-001 links were registered across `CLAUDE.md`, `GEMINI.md`, `.agent/workflows/plan.md`, and `.agent/skills/writing-plans/SKILL.md`. Verified 100% green (`188/188` artifacts pass).

---

## 5. Multi-Dimensional Option Evaluation

| Dimension | Option 1: Full Governance Integration (Certified Hybrid) | Option 2: Surgical Skill Patch Only | Option 3: Monolithic Free-Form Execution |
| :--- | :--- | :--- | :--- |
| **Similarities** | Both enforce planning checks before code is written. | Both enforce planning checks before code is written. | None (unconstrained execution). |
| **Distinctions** | Authoritative: Codifies PACT-001 pattern, updates standards catalog, `GEMINI.md`, `CLAUDE.md`, `writing-plans`, and `plan.md`. | Only edits `writing-plans/SKILL.md` without registering standards or patterns. | Relies purely on conversational memory; no persistent standard. |
| **Trade-offs** | Requires updating governance catalogs, but provides permanent multi-session immunity against unanchored work. | Faster to edit, but vulnerable to drift and invisible to governance verification suites. | Fast start, but high failure rate, lost context on refresh, and messy uncommitted diffs. |
| **Blast Radius** | Controlled strictly to `.agent/` governance specifications and core docs. | Confined to `writing-plans/SKILL.md`. | Unbounded: spreads across operational code files. |
| **Complexity** | **Low-Medium** (clean documentation and schema updates). | **Minimal** (1 file edited). | **High** (creates technical and cognitive debt). |
| **Risks** | Zero regression risk to operational code. | High risk of future agents bypassing the check. | Fatal regression cascades and abandoned partial implementations. |
| **Architectural Fit** | **Optimal**: 100% compliant with `P-4PPSD`, PACT-001, and RFG-001. | Incomplete: fails P82 completeness. | Violates all repository invariants. |

---

## 6. Recommended Course of Action (RFG-001 Classified)

### Required Now (Executed & Verified)
1. **Author Canonical PACT-001 Pattern**: Deploy `.agent/patterns/phased-development-ticket-first-gate.md` defining triggers, boundaries, and the 3-gate lifecycle (`P-TICKET-FIRST-PHASING-001`).
2. **Update Planning Skills**:
   - Embed **Gate 0: Mandatory Ticket Registration & Phased Scaffolding** into `.agent/skills/writing-plans/SKILL.md`.
   - Update **Step 1: Mandatory Ticket Registration Gate** in `.agent/workflows/plan.md`.
   - Upgrade **Gate 5** in `.agent/skills/enhancement-protocol-enforcer/SKILL.md` to mandate sequential phased DoD breakdowns.
3. **Register Governance Standard**: Add `P-TICKET-FIRST-PHASING-001` to `.agent/standards-catalog.json` (7 total standards) and update `GEMINI.md` and `CLAUDE.md` under Invariant §7.
4. **P82 Verification**: Execute `npm run verify:governance-wiring:all` to certify 100% read-path wiring across all 188 artifacts.

### Recommended Soon (Next Session)
- Resume active operational development on `SK-007` Phase 1 (Look Lifecycle & Refresh Bugfix in `shopping_src/scripts/controller.js`) under the newly ratified phased execution rules.

---

## 7. Council Certification Verdict

> [!IMPORTANT]
> **Council Certification Status: ✅ CERTIFIED & RATIFIED (`AC-DEC-2026-042` / `UI-DEC-2026-038`)**
> All 7 disciplinary evaluations, dissenter challenges, and RFG-001 requirements have been satisfied.
> The pattern is codified in [`.agent/patterns/phased-development-ticket-first-gate.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/patterns/phased-development-ticket-first-gate.md) and registered in [`Council_Ledger.md`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/Council_Ledger.md#L46).
