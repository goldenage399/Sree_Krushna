# 🏛️ Architecture & Governance Council Decision Record: Universal Planning Engine Consolidation & Reusable Prompt Integration

**Standard Identifier:** `P-UNIVERSAL-PLANNING-ENGINE-001` / `STD-PHASED-DEV-001` / `P-TICKET-FIRST-PHASING-001` / `SK-008`  
**Council Decision:** `AC-DEC-2026-044` / `UI-DEC-2026-040`  
**Date:** 2026-09-24  
**Type:** FULL Architecture & Governance Council Deliberation  
**Status:** ✅ CERTIFIED & IMPLEMENTATION-READY  
**Maturity Anchor (RFG-001):** Pre-launch wedding OS · 4–5 real users today (Host/Groom, Bride, Sisters, Parents), ~20 expected as wedding approaches · 2 visual modules (Shopping Registry & Decorator Cockpit) · 1 developer.

---

## 1. Context & Motivation

Following the ratification of `AC-DEC-2026-042` (Mandatory Ticket Registration & Phased Planning Gate) and `AC-DEC-2026-043` (Planning Call-Graph & DISC-001 Discoverability), the Host posed two foundational workflow and architectural design questions:
1. **Prompt Boundary & Response Bulkiness**: In the reusable hybrid evaluation prompt, why didn't we explicitly instruct the agent to *"write the plan using the writing-plans skill that we just updated"*? Would doing so make the prompt or the resulting response too bulky, and what is the optimal separation of concerns between intent clarification, council deliberation, and implementation planning?
2. **Universal Cross-Repo Planning Skill (SAP Consolidation)**: Planning workflows are currently fragmented across multiple overlapping artifacts (`writing-plans`, `planning-with-files`, `implementation-plan-template`, `/plan`, `complex-architecture-blueprint`). Can we consolidate them into a single canonical planning skill partitioned into:
   - A **repo-agnostic core block** (`<!-- shared:std.agent.planning-engine.core:start -->`) synchronized losslessly across all repositories via `/sap-sync`, AND
   - A **repo-specific extension block** (`<!-- repo-specific:<repo>:start -->`) managing local taxonomy and toolchains?

---

## 2. Phase 0: Ground Truth & Evidence Collection

### 2.1 Evidence Snapshot
- **Git Commit Hash**: `28c14f6d742b0698ab7c02745428251858a72cef` (with working-tree modifications).
- **Files Inspected**:
  - `User_Created/Discussion Threads/Shopping/260918_ShoppingList.md`: Queries 5.1 through 5.7.
  - `.agent/skills/writing-plans/SKILL.md`: 164 lines. Gate 0 enforces ticket check. Each task requires Steps 1–5 (failing test, run fail, minimal implementation, run pass, commit) with binary VG/DN blocks.
  - `.agent/workflows/architecture-council.md`: Phase 2 Synthesis produces the architectural plan; implementation planning executes downstream in Phase 3.
  - Existing Shared SAP Blocks: Inspected `.agent/skill-router.yaml` (`shared:std.agent.skill-router`), `web-deployment-gate.md` (`shared:std.agent.web-deployment-gate`), and `architecture-council.md` (`shared:std.governance.rfg-001-classification`). Confirmed that SAP synchronization via `/sap-sync` relies strictly on `<!-- shared:<tag>:start -->` ... `<!-- shared:<tag>:end -->` delimiters.
  - `enhancement-config.json`: `canonical_prefix: "SK"`, `next_id: 8`.

---

## 3. Phase 1: Independent Council Evaluation

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: Strongly support partitioning planning into SAP-shared core and repo-specific blocks under **`SK-008`**. Today, `Task-Dashboard` uses `TASK-###` with `ServiceRegistry`, while `Sree_Krushna` uses `SK-###` with SDCA. Having divergent planning skills creates cognitive drift when moving between repos. A single canonical skill with SAP delimiters guarantees 100% cross-repo parity.
- **Evidence**: Protocol 6 (`ENHANCEMENT_PROTOCOL.md`) and `/sap-sync` workflow.
- **Challenge**: *"Will updating the planning skill across repos break existing in-flight tickets that use legacy formats?"*  
  *What would change my mind*: Backward compatibility: the repo-agnostic core preserves existing TDD Steps 1–5 and DoD v1.7 structures, so no existing ticket format is invalidated.
- **Confidence**: High.

### 3.2 Schema & Process Integrity Auditor (`cos-invoke`)
- **Position**: Address the prompt bulkiness question directly: Attempting to output both a full Architecture Council decision AND a complete 4-phase, 50-step TDD implementation plan in a single chat turn is an anti-pattern.
- **Evidence**: A full council deliberation is ~200 lines. A full 4-phase `writing-plans` specification is 600+ lines. Combining them in one response exceeds token ceilings, causes truncation, and encourages agents to write shallow, hand-waving steps instead of real TDD tests.
- **Challenge**: *"If the council turn doesn't output the plan, does the user have to prompt a second time to get code execution started?"*  
  *What would change my mind*: The council turn should output the **Architectural Decision**, the **Scaffolded Ticket with the 4-Phase DoD Matrix**, and the **Phase 1 Implementation Plan specifically**, concluding with a plan hard-stop before mutating code. Phases 2–4 remain in the DoD matrix to be planned when Phase 1 finishes.
- **Confidence**: High.

### 3.3 Maintainability & Velocity Auditor (ASSIGNED DISSENTER — RFG-001)
- **Position**: DISSENT against trying to execute `SK-008` (cross-repo planning skill consolidation) immediately in this session while active shopping bugfixes (`SK-007`) are still pending!
- **Evidence**: RFG-001 Burden of Proof: `SK-007` Phase 1 (eradicating the `TRS-BR-01` startup wipe) fixes a live bug reported by the user. `SK-008` is an architectural enhancement for multi-repo hygiene. We must scaffold `SK-008` into `GOVERNANCE-ENHANCEMENT-CLUSTER.md` as `PENDING`, but resume operational code execution on `SK-007` first.
- **Challenge**: *"If we don't consolidate planning skills now, will future agents get confused by writing-plans vs planning-with-files?"*  
  *What would change my mind*: `writing-plans` Gate 0 is already wired and active in `plan.md` and `GEMINI.md`. It safely governs current work. `SK-008` can be tackled as a dedicated governance sprint.
- **Confidence**: High.

---

## 4. Phase 2: Synthesis & Resolution of Challenges

1. **Resolution of Prompt Bulkiness vs. Implementation Planning**:
   - The user asked: *Why didn't we explicitly say "write the plan using writing-plans" in that prompt sentence?*
   - **Council Ruling**: The reusable prompt SHOULD explicitly demand `writing-plans`, but scoped to **Phase 1**:
     > *"If the hybrid approach requires multi-phase or multi-surface development, ensure an enhancement ticket is formally registered/scaffolded with a sequential phased Definition of Done (DoD) matrix, and output the Phase 1 implementation plan using writing-plans before concluding."*
   - This ensures the ticket is physically minted on disk, the full roadmap is anchored in the DoD matrix, and Phase 1 has exact file paths and test steps, without overloading the context window with speculative tasks for Phases 2, 3, and 4.

2. **Scaffolding of SK-008 (Universal Planning Engine)**:
   - Certified: Formally scaffold **`SK-008: Universal Canonical Planning Engine & Cross-Repo SAP Synchronization`** in `docs/enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md` and `enhancement-notes/SK-008/00_ENHANCEMENT_INDEX.md`.
   - Increment `next_id` to `9` in `enhancement-config.json`.
   - Update `ENHANCEMENT-MASTER-REGISTRY.md`.
   - Sequencing: `SK-008` is registered in `PLANNING` status, allowing the active session to resume `SK-007` Phase 1 code implementation.

---

## 5. The Certified Reusable Hybrid Prompt (v1.2 Canonical)

```markdown
Conduct a thorough evaluation of the available options, comparing their similarities, distinctions, trade-offs, dependencies, impact radius, complexity, risks, and architectural implications.
Use the provided repository context and relevant established best practices/research from the web.
Mandatory governance: Execute this review using the applicable /plan-review and architecture-council.md skills/standards as the authoritative governance framework. Do not merely reference or summarize them—perform all applicable mandatory reviews, gates, evidence checks, artifacts, traces, and validation requirements defined by those standards.
Using the resulting evidence, design a hybrid approach where appropriate that closes identified gaps without unnecessary complexity. If the hybrid approach requires multi-phase or multi-surface development, ensure an enhancement ticket is formally registered/scaffolded with a sequential phased Definition of Done (DoD) matrix, and output the Phase 1 implementation plan using writing-plans before concluding.
Conclude with an Architecture Council–certified decision only if all mandatory /plan-review and Architecture Council requirements have actually been satisfied. If any blocking requirement remains incomplete, explicitly identify it and mark the decision NOT YET CERTIFIED.
The objective is a governance-complete, evidence-backed, implementation-ready architectural decision, not merely a recommendation.
```

---

## 6. Council Certification Verdict

> [!IMPORTANT]
> **Council Certification Status: ✅ CERTIFIED & RATIFIED (`AC-DEC-2026-044` / `UI-DEC-2026-040`)**
> 1. Prompt boundary clarified: The v1.2 reusable prompt mandates ticket scaffolding, phased DoD matrix, and Phase 1 TDD planning.
> 2. `SK-008` is formally scaffolded in the Governance cluster to consolidate all planning skills into an SAP-delimited universal engine.
> 3. Active execution unblocked for `SK-007` Phase 1.
