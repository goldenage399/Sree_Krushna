---
pattern: consumer-path-integration-verification
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/role-activation.md
    at: "Step 5.7 — Consumer-Path Integration Verification Standard (CPIV-001)"
triggers: []
guard: ""
portability: universal
canonical_source: Task-Dashboard
porting_effort: low
---

# Consumer-Path Integration Verification (CPIV-001)

**Category**: Verification Standard / Anti-Pattern Prevention  
**Applies to**: Multi-tier data pipelines (Database/Store → Query Service → API Layer → Frontend State → UI Component)  
**Origin**: 2026-08-26 (INC-088: Isolated unit test masked truncated row slice)  
**Status**: VALIDATED  

---

## Pattern — Consumer-Path Integration Verification

### Solution
Enforce **CPIV-001 (Step 5.7 in `role-activation.md`)**:
1. Leaf unit tests alone are **INSUFFICIENT** to claim verification.
2. Verification MUST test or mock the ingestion/range bottleneck.
3. Trace the data path from persistence read all the way to consuming UI component.
