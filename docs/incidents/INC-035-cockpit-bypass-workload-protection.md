# Incident Report: INC-035 - Cockpit Reassignment Bypass of Workload Protection

**Status:** Resolved
**Date:** 2026-06-28
**Severity:** High (Data integrity and business logic bypass)
**Affected Component:** `src/components/TaskDetailsModal.jsx`, `src/pages/MyTasksPage.jsx`, `src/pages/TeamOversightPage.jsx`, `src/services/EnhancedTaskService.js`

---

## ❓ 1. Symptoms & Incident Log
When reassigning profiles from the task details cockpit view inside `MyTasksPage` or `TeamOversightPage`, the assignments succeeded even when a profile was over 75% congested. The workload protection limits and warnings (DecisionSupportWarningModal) were bypassed. Additionally, those write paths did not emit lifecycle events to `tasks/{taskId}/events`, resulting in a violation of the `ARCH-INV-012` event coverage protocol.

---

## 🔍 2. Root Cause Analysis
1. **Logic Duplication**: `TaskDetailsModal` implemented its own `handleProfileReassign` function that directly updated Firestore via `updateDoc`. It was completely isolated from the parent page workflow limits, acting as a direct backdoor.
2. **Missing Lifecycle Events (ARCH-INV-012)**: The duplicated writes in the pages and modal did not log lifecycle events via `EnhancedTaskService.appendTaskEvent()`.
3. **Stale useCallback Closure**: `MyTasksPage` had a stale dependency array for its task action handlers, leading to state synchronization bugs.

---

## 🛠️ 3. Remediation & Fix
1. **Logic Centralization**: Created centralized `EnhancedTaskService.completeTask` and `reassignTask` static methods.
2. **Integrated Lifecycle Logs**: The centralized methods automatically pair writes to the task with `appendTaskEvent` and `appendTaskProgressUpdate` logs.
3. **Delegation Refactoring**: Removed internal Firestore writes and nested dialogs from `TaskDetailsModal`. All reassignments and completions are now routed via the parent page's `onTaskAction` dispatcher.
4. **Workload Warning Checks**: Wired `WorkloadCalculationService` checks and `DecisionSupportWarningModal` popup dynamically within the `MyTasksPage` and `TeamOversightPage` reassign handlers.
5. **Collection Read Optimization**: Added an optional `resolvedUser` parameter to `reassignTask` to leverage client-side cached user lists and minimize Firestore database read overhead.

---

## 📐 4. Architectural Surface Mapping
* **UI Surface**: **Affected**. Renders `ProfileSelectionModal` and `DecisionSupportWarningModal` from the page container context, and updated `TaskDetailsModal` to delegate buttons.
* **Data Surface**: **Affected**. Enforced standard data mutation event tracing with paired event subcollection logs.
* **Reactive Surface**: **Affected**. Corrected `useCallback` hook dependency structures in page controllers.
* **Service Surface**: **Affected**. Created new static mutation layers in `EnhancedTaskService`.
* **Module Surface**: N/A.
* **Governance Surface**: **Affected**. Fixed broken relative links in `TASK-MANAGEMENT.md` and `DOCUMENTATION-INDEX.md`.

---

## 💡 5. Lessons Learned
- **Logic Belongs in Services**: Do not place database write logic or complex business constraints inside visual modals. Modals must act as pure presenters and delegate actions to page controllers or services.
- **Enforce Invariants Programmatically**: Every mutation path should pass through a centralized service that guarantees side-effects (like lifecycle event emission) are not skipped.
- **Cache Leverage**: Centralized services that perform user calculations should support passing resolved records to prevent unnecessary collection-wide reads in environments that already have the user lists cached.
