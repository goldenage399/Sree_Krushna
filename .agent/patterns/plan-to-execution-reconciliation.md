---
pattern: plan-to-execution-reconciliation
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/role-activation.md
    at: "Step 5.4 — Plan-to-Execution Reconciliation Gate (PERG-001)"
triggers: []
guard: ""
portability: universal
canonical_source: Task-Dashboard
porting_effort: low
---

# Plan-to-Execution Reconciliation (PERG-001)

**Category**: Process / Design Gate  
**Applies to**: Phased Execution, Mode 2 to Mode 3 Transition, Session Close Verification  
**Origin**: 2026-08-26 (INC-088: Omission of configuration updates between Mode 2 plan and Mode 3 execution)  
**Status**: VALIDATED  

---

## Pattern — Plan-to-Execution Reconciliation

### Problem
During multi-step implementation, a planned sub-task is silently dropped when execution tasks are renumbered or grouped. The resulting implementation passes claim-based narrative audits (CCIG-001) because every *claimed* task has a matching diff, but the overall feature silently breaks due to the missing planned dependency.

### Solution
Enforce **PERG-001 (Step 5.4 in `role-activation.md`)**:
1. Map every task in `mode2-output.json` (`phased-execution-plan`) to an entry in `mode3-output.json` (`implementation-evidence`).
2. Every planned task must have an explicit terminal status (`[EXECUTED]`, `[EXPLICITLY_DEFERRED]`, or `[BLOCKED]`).
3. If any planned task is missing, the agent is **BLOCKED** from emitting `status: "ready"`.
