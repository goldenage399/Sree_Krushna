---
pattern: write-site-contract-verification
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Write-Site Contract Verification (Ground-Truth Gate)

**Category**: Design Gate / Anti-Pattern Prevention  
**Applies to**: `principal-architect`, `safe-implementer`, `writing-plans`, `/cos-invoke`, `/role-activation`  
**Origin**: Session 2026-08-11 (INC-076 & Review 6.1 — `blockingType` vs `type` discriminant drift)  
**Status**: VALIDATED  

---

## Pattern — Write-Site Contract Verification

### Problem
Engineers and AI agents naturally perform "Pattern Copying"—checking nearby read-side caller files to see how data fields or query filters are written, and copying those conventions into new code. If the existing caller file contains a silent bug or stale field name (e.g. `blockingType === 'DEPENDS_ON_TASK'`), copying it propagates the bug across 7+ feature iterations without detection.

### Why it happens
"Consistent with the file" feels correct to human and AI reviewers. But local file consistency is not system ground truth. Read-side callers are secondary consumers, whereas the canonical write service (`TaskUpdateService.js`) and locked SSOT contracts (`ADR-012`) define actual data reality.

### Solution
During Phase 1 Ground-Truth Discovery:
1. **Trace to the Physical Write Site**: Never base field names, enum values, or discriminants on read callers. Locate and inspect the physical file where the record is constructed/written to database (`src/services/XWriterService.js` or `TaskUpdateService.js`).
2. **Inspect Locked ADR/SSOT Contracts**: Cross-reference the write site against `docs/adr/` or `docs/ssot/` to ensure the writer itself hasn't drifted from locked architecture.
3. **Record Findings in Handoff Schema**: Record the inspected write sites and ADRs in the `contract_write_sites_inspected` array in `.agent/session/mode1-output.json`.

### Failure Mode
Treating read-side caller code as canonical ground truth, leading to zero-match queries, silent data drops, or broken UI bindings that pass local unit lints because "all callers agree on the wrong name."

### Task-Dashboard Instance
[INC-076 Case Study](file:///d:/GitHub_Repo/Task-Dashboard/docs/incidents/INC-076-upstream-blocker-read-back-field-name-discriminant-drift.md): TASK-234 blocker queries evaluated `blockingType === 'DEPENDS_ON_TASK'` because 7 successive feature updates copied local caller code. The locked write site (`TaskUpdateService.js:219`) and `ADR-012` set `type: 'depends_on_task'`, causing zero-match queries across all live task queries for 7 sprints.
