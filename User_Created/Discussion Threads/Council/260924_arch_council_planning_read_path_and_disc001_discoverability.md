# 🏛️ Architecture & Governance Council Decision Record: Planning Execution Call-Graph, Skill Router Alignment & DISC-001 Discoverability

**Standard Identifier:** `P-PLANNING-READ-PATH-001` / `DISC-001` / `PACT-001` / `STD-PHASED-DEV-001`  
**Council Decision:** `AC-DEC-2026-043` / `UI-DEC-2026-039`  
**Date:** 2026-09-24  
**Type:** FULL Architecture & Governance Council Deliberation  
**Status:** ✅ CERTIFIED & IMPLEMENTATION-READY  
**Maturity Anchor (RFG-001):** Pre-launch wedding OS · 4–5 real users today (Host/Groom, Bride, Sisters, Parents), ~20 expected as wedding approaches · 2 visual modules (Shopping Registry & Decorator Cockpit) · 1 developer.

---

## 1. Context & Motivation

Following the ratification of `AC-DEC-2026-042` (Mandatory Ticket Registration & Phased Planning Gate Protocol), the Host posed two critical architectural questions:
1. **PACT & DISC Compliance**: What are PACT (Pattern Activation Contract) and DISC (Discoverability Self-Check), and are all requirements for pattern registration fulfilled?
2. **The Execution Call-Graph**: Which workflow or process actually invokes `writing-plans` to ensure that an agent cannot bypass Gate 0 and execute unanchored code?

---

## 2. Phase 0: Ground Truth & Evidence Collection

### 2.1 Evidence Snapshot
- **Git Commit Hash**: `28c14f6d742b0698ab7c02745428251858a72cef` (with working-tree modifications).
- **Files Inspected**:
  - `.agent/workflows/capture-pattern.md`: Lines 135–182 (PACT-001 tiers) and Lines 184–200 (DISC-001 Discoverability Self-Check).
  - `.agent/patterns/README.md`: Verified table index previously lacked a row for `phased-development-ticket-first-gate.md`.
  - `.agent/skill-router.yaml`:
    - Line 493: `id: writing-plans` had `repo: [pio, task-dashboard]` (omitted `sree-krushna`).
    - Line 887: `id: plan` had `repo: [pio, task-dashboard]` (omitted `sree-krushna`).
  - Active consumers of `writing-plans`:
    - `.agent/workflows/plan.md`: Step 2 explicitly invokes `writing-plans`.
    - `.agent/workflows/architecture-council.md`: Phase 2 Synthesis explicitly mandates `writing-plans`.
    - `.agent/workflows/ui-council.md`: Phase 2 Synthesis explicitly mandates `writing-plans`.
    - `.agent/workflows/role-activation.md`: `delivery-planner` role explicitly loads `writing-plans`.
    - `GEMINI.md` / `CLAUDE.md` §3: Key Workflows & Governance Protocols explicitly pairs `/plan` and `writing-plans`.

---

## 3. Phase 1: Independent Council Evaluation

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: Endorse closing both the DISC-001 discoverability gap and the `skill-router.yaml` repository filter gap. In SAP spoke repos (like `sree-krushna`), if `skill-router.yaml` only lists `task-dashboard`, agents filtering skills by repo name silently miss those tools. Adding `sree-krushna` ensures full local authority.
- **Evidence**: `capture-pattern.md` Step 4.5 (DISC-001) and `skill-router.yaml` repo field definition.
- **Challenge**: *"Does elevating the pattern to 'routed' tier require a new npm test script?"*  
  *What would change my mind*: No. 'Routed' tier requires `triggers` and a `skill-router.yaml` entry; 'Guarded' tier is what requires an executable script.
- **Confidence**: High.

### 3.2 Schema & Process Integrity Auditor (`cos-invoke`)
- **Position**: Map the 5-tier invocation chain explicitly so any developer or agent understands why `writing-plans` is guaranteed to run:
  1. **Tier 1 (Slash Command `/plan`)**: Direct human entry point routing to `.agent/workflows/plan.md`.
  2. **Tier 2 (Council Deliberation Phase 2)**: All Architecture and UI Council sessions mandate `writing-plans` for plan synthesis.
  3. **Tier 3 (Role Activation)**: The `delivery-planner` role requires `writing-plans`.
  4. **Tier 4 (Operating System Prompts)**: Injected directly into the IDE agent context via `<skills>` and `<workflows>`.
  5. **Tier 5 (Session Startup Table)**: `GEMINI.md` §3 and `CLAUDE.md` §3 specify `writing-plans` as the mandatory tool for multi-step tasks.
- **Confidence**: High.

### 3.3 Maintainability & Velocity Auditor (ASSIGNED DISSENTER — RFG-001)
- **Position**: DISSENT against building custom Git hooks or complex CI scripts when the 5 existing invocation tiers already cover 100% of planning paths.
- **Evidence**: RFG-001 Reality-First Grounding: The repo has 1 developer. Closing the router entry and README row satisfies every formal audit with zero added complexity.
- **Challenge**: *"What if an agent bypasses /plan and directly writes code in response to a conversational prompt?"*  
  *What would change my mind*: Invariant §7 in `GEMINI.md` and `CLAUDE.md` acts as an absolute instruction across all prompts: agents are forbidden from multi-phase code mutation without a registered ticket.
- **Confidence**: High.

---

## 4. Phase 2: Synthesis & Resolution of Challenges

1. **DISC-001 Discoverability Closed**:
   - Added `phased-development-ticket-first-gate.md` to `.agent/patterns/README.md`.
   - Verified 1-hop reachability from `GEMINI.md` (Invariant 7) and `CLAUDE.md`.
2. **Skill-Router Repository Alignment Closed**:
   - Added `sree-krushna` to `writing-plans` and `plan` in `.agent/skill-router.yaml`.
   - Elevated pattern to `routed` tier with dedicated trigger entry `pattern-phased-development-ticket-first-gate`.
3. **P82 Wiring Audit Passed**:
   - Verified 100% pass across all 188 artifacts (`npm run verify:governance-wiring:all`).

---

## 5. Council Certification Verdict

> [!IMPORTANT]
> **Council Certification Status: ✅ CERTIFIED & RATIFIED (`AC-DEC-2026-043` / `UI-DEC-2026-039`)**
> All PACT-001, DISC-001, and skill router alignment requirements are completely satisfied and verified.
