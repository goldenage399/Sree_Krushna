# INC-076: Upstream Blocker Read-Back Discriminant Field Name Drift

**Incident Date**: 2026-08-11  
**Severity**: High (Silent Systemic Feature Disablement)  
**Affected Subsystem**: `TaskLinkResolutionService.js`, `taskRiskUtils.js`, `ADR-012`  
**Resolution Commit**: `e4d3d083`  
**Affected Components**: `src/services/TaskUpdateService.js`, `src/services/TaskLinkResolutionService.js`, `src/utils/taskRiskUtils.js`  

---

## Executive Summary

During Sprint 7 hardening, upstream blocker read-backs (`resolveUpstreamBlockers` and `getDependencyImpactSummary`) and blocker risk calculations (`computeBlockerState`) were discovered to be matching **zero documents** across all live task queries since Sprint 1. 

Developers and refactoring agents had consistently copied an unverified read-side convention (`blockingType === 'DEPENDS_ON_TASK'`) from local caller files. However, the locked data contract ([ADR-012](file:///d:/GitHub_Repo/Task-Dashboard/docs/adr/ADR-012-TASK-DEPENDENCY-BLOCKER-DATA-CONTRACT.md)) and the actual physical write site ([TaskUpdateService.js:219](file:///d:/GitHub_Repo/Task-Dashboard/src/services/TaskUpdateService.js#L219)) had locked the discriminant field as `type: 'depends_on_task'` (lowercase).

---

## Symptoms & Impact

- **Silent Zero-Match**: Every blocker calculation evaluated `blockingType === 'DEPENDS_ON_TASK'`, which returned `undefined === 'DEPENDS_ON_TASK'` (false) for 100% of real Firestore task blocker entries.
- **False Idle Warnings**: Blocked tasks were improperly categorized as "Idle" or "Neglected" on Team Oversight dashboards because the blocker detection failed silently.
- **Invisible Upstream Links**: Upstream dependency impact counts failed to resolve titles or display blocker relationships.

---

## Root Cause Analysis

1. **The Pattern Copying Trap**: A developer introduced `blockingType` in an early draft. Subsequent feature updates (F-1 through F-7) checked existing caller files to see "how blockers are checked" and copied `blockingType === 'DEPENDS_ON_TASK'`.
2. **Failure to Inspect Write Site**: None of the 7 iterations physically inspected `TaskUpdateService.js` (the write site) or `ADR-012` (the locked schema contract). They assumed "consistent with the local file" equaled "consistent with ground truth."

---

## Architectural Surface Mapping (6-Surface Audit)

1. **UI Surface**: Blocker status badges in `ProfileDetailView.jsx`, `PositionTaskQueue.jsx`, and `UserSubView.jsx` rendered stale or raw ID fallbacks.
2. **Data Surface**: Locked `blockers[]` array schema in Firestore (`type: 'depends_on_task'`).
3. **Reactive Surface**: `useBlockerTitles` hook and UI state received empty arrays from resolution queries.
4. **Service Surface**: `TaskLinkResolutionService.js` (`resolveUpstreamBlockers`, `getDependencyImpactSummary`) evaluated non-existent field names.
5. **Module Surface**: `taskRiskUtils.js` utility module.
6. **Governance Surface**: Missing physical write-site inspection step in Phase 1 ground-truth discovery protocols (`/role-activation`, `principal-architect`).

---

## Remediations & Invariants Established

1. **Codebase Fix**: Updated all 3 read-side sites in `taskRiskUtils.js` and `TaskLinkResolutionService.js` to match `blocker.type === 'depends_on_task'` or `blocker.type === 'DEPENDS_ON_TASK'` (case-insensitive fallback).
2. **AST-Grep Governance**: Registered `arch-inv-012-blocker-data-contract.yml` to fail any static grep/ast-grep check looking for `blockingType`.
3. **4-Phase Problem-Solving Discipline (4-PPSD)**: Formally added **Phase 1 Write-Site Contract Verification** to `GEMINI.md`, `CLAUDE.md`, `AGENTS.md`, and `/role-activation.md` (Step 4b).

---

## Verification

- **Preflight Scan**: Passed cleanly (`npm run preflight`).
- **Telemetry Event Coverage**: 100% compliant (`npm run check:event-coverage`).
- **Build Verification**: Vite compilation succeeded (`npm run build`).

**Affected Component(s)**: `src/services/TaskUpdateService.js`, `src/services/TaskLinkResolutionService.js`, `src/utils/taskRiskUtils.js`
