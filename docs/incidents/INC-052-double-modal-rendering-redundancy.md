# Incident Report: INC-052 — Double Modal Overlap and State Leakage

## Incident Summary

A critical UI bug was reported where clicking "View Details" on a task card within the `TeamOversightPage` dashboard resulted in two overlapping modal overlays or double backdrops. 

Forensic analysis revealed two distinct runtime failure modes causing this symptom:
1. **View-Level Stacking Duplicate**: Parallel mounting of both the page-level `TaskDetailsModal` (used for Profile Queues) and the cockpit-level `TaskDetailsModal` (used for All Tasks).
2. **Nested Action Modal State Leak**: Persistent state flags (`showEditModal`, etc.) in the unconditionally mounted details modal causing stale nested views to open immediately on the next details view.

- **Affected Components**: `src/pages/TeamOversightPage.jsx`, `src/components/TaskDetailsModal.jsx`, `src/components/TaskCockpitView.jsx`
- **Symptom**: Two overlapping dialog boxes, same task, or double dark backdrops rendered on a single "View Details" click.
- **Fix**:
  1. Gated the page-level `TaskDetailsModal` conditional rendering in [TeamOversightPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/TeamOversightPage.jsx#L1566) by checking `mainView !== 'all-tasks'`, unmounting the duplicate modal when on the cockpit tab.
  2. Reset all 5 nested-modal state flags (`showEditModal`, `showDelegationModal`, `showDelegationHistory`, `showWorkloadBalancer`, `showEscalationPreview`) to `false` inside the `useEffect` reset block of [TaskDetailsModal.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskDetailsModal.jsx#L337-L341).

---

## Root Cause Analysis

### 1. View-Level Stacking Duplicate
`TeamOversightPage.jsx` coordinates multiple task-inspection layouts:
- Profile swimlanes render tasks that open details using page-level state: `{isTaskDetailsOpen && selectedTask && <TaskDetailsModal ... />}`.
- The "All Tasks" tab renders `TaskCockpitView`, which manages its own decoupled instances of `TaskDetailsModal` and `TaskUpdateModal` to support fast transition swaps.
If a user had the page-level modal open (or the state was not explicitly cleared) and navigated to the "All Tasks" tab, both modals could mount simultaneously since there was no tab-scoping check on the page-level render condition.

### 2. Nested Action Modal State Leak
Inside `TaskCockpitView.jsx`, the details modal `<TaskDetailsModal isOpen={detailsModal.isOpen} .../>` is rendered unconditionally. When closed, it returns `null` from its render method rather than unmounting. Consequently, all internal React state is preserved.
If a user opened task details, clicked "Edit" (setting `showEditModal` to `true`), and closed the modal, `showEditModal` remained `true`. On opening *any* other task, the stale `true` flag caused the nested edit modal to instantly render on top of the fresh details modal, resulting in two overlapping dialogs for the same task.

---

## Architectural Surface Mapping

1. **UI Surface**: Overlapping backdrops and layout crowding on desktop viewports. Resolved by ensuring only a single modal shell mounts at any given time.
2. **Data Surface**: N/A.
3. **Reactive Surface**:
   - Tab-state tracking (`mainView`) in `TeamOversightPage` was wired to the page-level modal mount conditional.
   - Local state variables (`showEditModal`, `showDelegationModal`, etc.) in `TaskDetailsModal` were wired to the transition reset `useEffect` hook.
4. **Service Surface**: N/A.
5. **Module Surface**: N/A.
6. **Governance Surface**: Registered new design invariant `FKL-DI-020` (tab-based modal gating) and verified the correct enforcement of Rule of Hooks in `TaskDetailsModal`.

---

## Corrective Actions & Resolution

1. **Gate Page-Level Modal**: Added `mainView !== 'all-tasks'` to `TeamOversightPage.jsx:1566`.
2. **Reset Nested Modal Flags**: Added state resets to `TaskDetailsModal.jsx:337-341` inside the task-transition `useEffect` block.
3. **Verification**: Executed automated browser sanity scans (`npm run test:quick`) to confirm no page load failures or console exceptions remain.

---

## Prevention & Invariants

- **FKL-DI-020 (SSOT Invariant)**: In layouts containing tabbed interfaces where a child view renders its own decoupled modals, the parent view's details modals MUST be conditionally gated to unmount when the child view is active.
