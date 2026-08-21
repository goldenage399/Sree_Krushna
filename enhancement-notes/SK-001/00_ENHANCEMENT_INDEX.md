# SK-001: Domain Workflow & SSOT Reconciliation Adaptation

- **Cluster**: `[GOVERNANCE]`
- **Status**: `COMPLETED`
- **Owner**: goldenage399
- **Depends On**: None (Foundational)
- **Target Release**: v1.0.0

## 🎯 Purpose
Adapt portable workflows (`ssot-reconciliation.md`, `debug-backend.md`, `debug-task-architecture.md`, `session-handoff-system.md`) specifically for Marriage OS entity schemas (`EVT`, `RIT`, `PER`, `FAM`, `VEN`, `VDR`, `PAY`, `RSK`).

## 📋 Deliverables
1. Update `.agent/workflows/portable/ssot-reconciliation.md` with Marriage OS hub-and-spoke entity mapping.
2. Update `.agent/workflows/debug-backend.md` and `debug-task-architecture.md` with Marriage OS state machine checks.
3. Validate governance compliance via `npm run verify:governance-wiring:all`.

## ✅ Verification Evidence
- .agent/workflows/portable/ssot-reconciliation.md updated with Marriage OS entity mapping and authority hierarchy.
- Status: COMPLETED 2026-08-22.
