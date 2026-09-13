---
pattern: plan-to-execution-reconciliation
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: universal
canonical_source: Task-Dashboard
porting_effort: low
---

# Plan-to-Execution Reconciliation (PERG-001)

**Category**: Process / Design Gate  
**Applies to**: Phased Execution, Mode 2 to Mode 3 Transition, Session Close Verification  
**Origin**: 2026-08-26 (INC-088: Omission of Pattern G `totalColumns` update between Mode 2 plan and Mode 3 execution)  
**Status**: VALIDATED  

---

## Pattern — Plan-to-Execution Reconciliation

### Problem
During multi-step implementation, a planned sub-task (e.g., updating a backend configuration constant, migrating an index, or adding a test) is silently dropped when execution tasks are renumbered or grouped. The resulting implementation passes claim-based narrative audits (CCIG-001) because every *claimed* task has a matching diff, but the overall feature silently breaks due to the missing planned dependency.

### Why it happens
1. **Plan Mutation / Renumbering**: Delivery planner structures tasks into $N$ steps, but implementer re-indexes or clusters tasks into $M$ steps, dropping intermediate dependencies.
2. **Claim-Scope Bias**: Verification tools audit that claimed diffs exist, but never verify that $100\%$ of planned tasks from the parent specification were accounted for.

### Solution
Enforce **PERG-001 (Step 5.4 in `role-activation.md`)**:
1. Before declaring work complete, the active role must map every task in `mode2-output.json` (`phased-execution-plan`) to an entry in `mode3-output.json` (`implementation-evidence`).
2. Every planned task must have an explicit terminal status:
   - `[EXECUTED: <file>:<line-range>]` (Non-empty diff confirmed via `git diff`)
   - `[EXPLICITLY_DEFERRED: <reason>]` (Approved by user or scope boundary)
   - `[BLOCKED: <blocker-id>]` (Documented in handoff)
3. If any planned task is missing or unaccounted for, the session cannot emit `status: "ready"`.

### Failure Mode
Omitting PERG-001 allows tasks to vanish between planning and execution, leading to runtime failures where one un-updated configuration breaks an otherwise complete multi-file implementation.

### Task-Dashboard Instance
- **INC-088**: Response 3.6 planned `PATTERN_G_CONFIG.totalColumns` increment in `00_PatternG.js`. Response 3.7 executed 8 renumbered steps but dropped `00_PatternG.js`, breaking data rehydration on reopen.
