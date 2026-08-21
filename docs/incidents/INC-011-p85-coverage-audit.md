# P85 Coverage Audit — createUserContext Stub Violations
**Date**: 2026-06-16  
**Standard**: P85 — createUserContext Full-Object Contract  
**Audit Command**: `grep -r "createUserContext(\s*{\s*uid" src/`  

---

## Finding Summary

The P85 violation pattern regex matched **44 call sites** across `src/`. 
These fall into two distinct tiers:

---

## Tier A — Exempt (Internal Service Accounts)

These pass `uid: 'service-name', level: 1` intentionally. They are background services or admin operations
that need unrestricted task access — not personal user queries. The stub is **correct** here because
`systemRole: 'super_admin'` path in `buildScopedTaskQuery` is the intended behavior.

These should have `// @compliance-ignore P85 — service account context, not user query` comment added.

| File | Line | Service UID |
|---|---|---|
| `AcceptanceTimeoutService.js` | 50, 178 | `acceptance-timeout-service` |
| `ComprehensiveTimeoutManagementService.js` | 352, 581 | `timeout-management-service` |
| `ExternalVendorIntegrationService.js` | 441, 646, 724 | `vendor-integration-service` |
| `ProfileRecommendationEngine.js` | 131 | `profile-mapping-engine` |
| `projectService.js` | 278, 340 | `project-service` |
| `WorkloadCalculationService.js` | 388, 427 | `workload-calc-service` |
| `WorkloadBalanceService.js` | 486, 512 | `workload-balance-service` |
| `TaskEscalationService.js` | 134 | `escalation-service` |
| `SampleDataService.js` | 318 | `sample-data-service` |
| `PriorityEscalationAuthorityService.js` | 455 | `priority-escalation-service` |
| `DependencyResolutionService.js` | 113, 250 | `dependency-service` |
| `DeadlineMonitoringService.js` | 158, 304 | `deadline-monitoring-service` |
| `BlockerWorkflowService.js` | 507, 528 | `blocker-workflow-service` |
| `AuditLogsPage.jsx` | 166 | `audit-service` |
| `AdvancedProfileManagement.jsx` | 314 | `profile-mgmt-service` |
| `ArchiveUserModal.jsx` | 47 | `archive-operation` |
| `ArchiveProfileModal.jsx` | 67 | `archive-service` |
| `EnhancedTaskService.js` | 839 | `team-oversight` |

**Action needed**: Add `// @compliance-ignore P85 — service account context` comment to each.

---

## Tier B — True Violations (Personal User Queries)

These pass a real user's `uid` but strip `profileAssignments` because they use level prop/fallback
instead of `userData`. For a user with profile assignments but no hardcoded level, these will either
silently break (wrong query path) or use the `__no_profile__` sentinel.

| File | Line | Risk | Notes |
|---|---|---|---|
| `MyTasksPage.jsx` | 84 | 🔴 CRITICAL | `fallbackCtx = createUserContext({ uid: user.uid, level: 5 })` — this is the INC-010 regression path |
| `AssociateDashboard.jsx` | 148, 165 | 🔴 CRITICAL | Same pattern — fallbackCtx used when userData is unavailable |
| `TaskStagingPage.jsx` | 82 | 🟡 HIGH | `level: 3` hardcoded — assumes reviewer, ignores profile assignments |
| `NotificationPanel.jsx` | 25 | 🟡 HIGH | `level: 5` hardcoded — notification query misses profile-assigned tasks |
| `OverdueTasksPanel.jsx` | 32 | 🟡 HIGH | Uses `level` prop, no `profileAssignments` |
| `NotificationCenter.jsx` | 41 | 🟡 HIGH | `level || 5` fallback, no profiles |
| `UpcomingDeadlines.jsx` | 55, 392 | 🟡 HIGH | Two call sites — both pass level only |
| `WorkloadBalancer.jsx` | 47 | 🟡 HIGH | Uses `level || 3` prop fallback |
| `MonitorTab.jsx` | 325 | 🟡 HIGH | `level || 3` — monitor query could miss profile tasks |
| `EnhancedTaskService.js` | 42, 244, 690 | 🟡 HIGH | `userId || 'service'` — when real userId passed, no profileAssignments |
| `TaskOverloadProtectionService.js` | 276, 354, 498 | 🟡 HIGH | Same — userId passed, no profileAssignments |
| `CrossDepartmentService.js` | 39 | 🟡 HIGH | `userContext?.uid` but no profileAssignments from context |

---

## Remediation Plan

### Priority 1 — MyTasksPage & AssociateDashboard (INC-010 regression risk)
The `fallbackCtx` lines must either:
- Be eliminated by ensuring `userData` is always available before query setup, OR
- Receive the full `userData` object: `createUserContext(userData || { uid: user.uid, level: 5, profileAssignments: [] })`

**Verification**: `npm run db:simulate -- <affected-user-email>` → `Missing (gap): 0`

### Priority 2 — UI Panels (NotificationPanel, OverdueTasksPanel, UpcomingDeadlines, etc.)
Each should receive `userData` from `AuthContext` and pass it to `createUserContext(userData)`.
If `userData` is not yet loaded, defer the query rather than using a stub.

### Priority 3 — Service Stubs with real userId
`EnhancedTaskService`, `TaskOverloadProtectionService`, `CrossDepartmentService` — when a real user's
`uid` is passed, `profileAssignments` must come with it. These should receive the full user object,
not just the uid.

### Priority 4 — @compliance-ignore comments on Tier A
All Tier A service accounts should have the exemption comment added in a single cleanup commit.

---

## Status
- [x] Audit complete
- [ ] Priority 1 remediation — MyTasksPage, AssociateDashboard
- [ ] Priority 2 remediation — UI panels
- [ ] Priority 3 remediation — Service stubs with real userId
- [ ] Priority 4 — Tier A exemption comments
