# INC-073 Case Study: Incomplete Modal Action Handler Coverage Across Application Shell

**Incident ID**: INC-073  
**Date**: 2026-08-09  
**Severity**: Low (Stale Parent View State / Background Fraction Stagnation)  
**Status**: RESOLVED  
**Component**: `src/pages/MyDayPage.jsx`, `src/pages/PositionWorkspacePage.jsx`, `src/pages/ProjectAuditPage.jsx`, `src/pages/TaskCalendarPage.jsx`, `src/components/activity/ActivityShell.jsx`

---

## 1. Root Cause Timeline

1. **INC-072 Fix**: `INC-072` resolved the primary modal action handler disconnect in `TeamOversightPage.jsx` and `MyTasksPage.jsx`.
2. **Reviewer Audit (Review 6.5)**: Audit revealed that while `TaskDetailsModal`'s internal state update ensured the modal itself re-renders immediately, 6 other callers (`MyDayPage`, `PositionWorkspacePage`, `ProjectAuditPage`, `TaskCalendarPage`, `ActivityShell`) mounted `TaskDetailsModal` without passing `onTaskAction` handlers.
3. **Symptom**: Background task lists and card progress fractions on those 6 pages remained stagnant until modal closure or page refetch.

---

## 2. Escape Analysis

- **Why wasn't it caught during INC-072?**: Initial remediation focused on the primary task views (`TeamOversightPage` and `MyTasksPage`) where user feedback was concentrated, rather than auditing 100% of all AST-grep usages of `<TaskDetailsModal` across `src/`.

---

## 3. Systemic Weakness

- **Partial Caller Audit**: Fixing a shared component interface without performing a full search across all consumer files risks leaving secondary callers in a partially unhandled state.

---

## 4. Corrective Action Taken

Wired `onTaskAction={(action, t) => { if ((action === 'step_completed' || action === 'update') && t) setSelectedTask(t); }}` across all remaining 6 caller pages/components, achieving 100% (8/8) caller coverage across the codebase.

## 5. Architectural Surface Mapping

| Surface | Impact Status | Detailed Justification |
| :--- | :--- | :--- |
| **UI Surface** | **AFFECTED** | Background task card progress fractions across secondary application shell pages (`MyDayPage`, `PositionWorkspace`, `TaskCalendar`, `ProjectAudit`). |
| **Data Surface** | **UNAFFECTED** | Database write API and Firestore rules were fully functioning under INC-072. |
| **Reactive Surface** | **AFFECTED** | Parent page state handlers wired to receive `step_completed` and `update` actions. |
| **Service Surface** | **UNAFFECTED** | `EnhancedTaskService` layer was unaffected. |
| **Module Surface** | **AFFECTED** | 6 secondary modal-mounting components updated across `src/pages/` and `src/components/`. |
| **Governance Surface** | **AFFECTED** | Registered in `docs/incidents/INC-073-...`, `DOCUMENTATION-INDEX.md`, and `frontend-knowledge-index.jsonl`. |

---

## 6. Preventive Guardrails

- **Standard (100% Consumer Audit)**: Whenever a shared modal's `onTaskAction` signature or action set is modified, the developer MUST execute `grep -r "<ModalName" src/` and verify every caller passes `onTaskAction`.

