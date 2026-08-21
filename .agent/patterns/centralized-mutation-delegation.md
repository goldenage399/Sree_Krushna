---
pattern: centralized-mutation-delegation
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Centralized Mutation Delegation

**Category**: Design Gate & Anti-Pattern
**Applies to**: UI Components, Page Controllers, and Data Services
**Origin**: 2026-06-28 (INC-035 Cockpit Reassignment Bypass)
**Status**: VALIDATED

---

## Pattern — Centralized Mutation Delegation

### Problem
When a reusable UI component (such as a detail drawer or a modal) contains internal database write operations (e.g. `updateDoc` or `addDoc` to Firestore):
1. **Bypasses Governance Gates**: Page-level validation rules, capacity checks, and warning dialogs (such as checking profile workload limits >75%) are bypassed because the child component executes mutations autonomously.
2. **Skips Auditing Side-Effects**: Local writes often skip standard lifecycle logging commands (like `EnhancedTaskService.appendTaskEvent`), causing data integrity gaps.
3. **Logic Duplication & Drift**: Pages and components duplicate similar mutation paths, leading to maintenance overhead and behavior drift.

### Why it happens
Developers often co-locate behavior with presentation for simplicity (e.g. handling a click and updating the database in the same modal component), neglecting boundary constraints between view layers and data service layers.

### Solution
1. **Decouple View from Mutation**: Components must not perform raw database writes or invoke Firestore update commands directly.
2. **Delegate via Callbacks**: Components must dispatch mutation actions back to the parent context or page controller using event callbacks (e.g., `onTaskAction('reassign', task)`).
3. **Centralize via Service**: Page controllers must execute writes by calling unified, audited static methods on a centralized service (such as `EnhancedTaskService.reassignTask`) which guarantees event logs are appended.

### Failure Mode
If the callback is wired as a dead-end (e.g. `onTaskAction={() => {}}`), the user triggers actions that silently no-op. If pages duplicate the write logic instead of calling a centralized service, one of the pages will eventually drift and skip lifecycle logging.

### Task-Dashboard instance
* **Component Refactored**: [TaskDetailsModal.jsx](../../src/components/TaskDetailsModal.jsx) had its internal `handleProfileReassign` removed and now delegates to parent pages via `onTaskAction`.
* **Centralized Operations**: Centralized in [EnhancedTaskService.js](../../src/services/EnhancedTaskService.js) under `reassignTask` and `completeTask`, which pair task mutations with event emission for ARCH-INV-012 compliance.
* **Page Controllers**: [MyTasksPage.jsx](../../src/pages/MyTasksPage.jsx) and [TeamOversightPage.jsx](../../src/pages/TeamOversightPage.jsx) handle the callbacks and execute mutations via the centralized service.
