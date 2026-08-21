# Incident Report: INC-050 — Task Details and Task Update Modal Swapping Pattern

## Incident Summary

A usability issue was raised concerning the user experience when switching between task details inspection (`TaskDetailsModal.jsx`) and daily work entry logging (`TaskUpdateModal.jsx`). Because the two views were separate, users had to close one modal and manually open the other from the task list dashboard, causing friction and visual layout jumps. 

A proposal was made to combine both modals as tabs within the same parent modal. However, doing so would create a massive 3,500+ line component, violating **Protocol 11** (File Growth Threshold) and creating visual nested tab issues on mobile screens.

- **Affected Components**: `src/components/TaskDetailsModal.jsx`, `src/components/TaskUpdateModal.jsx`, `src/components/TaskCockpitView.jsx`
- **Symptom**: Visual jump and multi-click friction when transitioning between inspecting task timelines and entering work logs.
- **Fix**: 
  1. Added an `onSwapToUpdate` callback to `TaskDetailsModal.jsx` to render a "Log Progress" button and trigger a parent-orchestrated transition.
  2. Added an `onSwapToDetails` callback to `TaskUpdateModal.jsx` to render a "View Details" button in the form actions footer.
  3. Configured transition handlers inside `TaskCockpitView.jsx` with a `150ms` delay to allow the outgoing modal to completely unmount before opening the incoming modal, avoiding visual layout flash and double backdrops.
  4. Formally registered the swap transition pattern as design invariant `FKL-DI-019` in `docs/ssot/ui-design/spokes/COMPONENTS.md`.

---

## Root Cause Analysis

Historically, `TaskDetailsModal.jsx` (2,074 lines) and `TaskUpdateModal.jsx` (1,467 lines) were designed as standalone overlay dialogs for different user contexts:
- Details modal: read-heavy auditing tool for supervisors and admins.
- Update modal: transactional work log form for associates.

As features evolved, the boundary between checking a task's history and logging a progress update blurred. While combining them into a single tabbed component seemed like an easy fix, it would cause:
1. **P11 violations**: Code footprint would grow beyond 3,500 lines.
2. **Performance bloat**: Loading write validation schemas and active stopwatches during simple read operations.
3. **Responsive layout failures**: Nested top and bottom tab bars on mobile viewports (<768px).

A parent-orchestrated "Quick Swap" transition provides the visual continuity of a unified modal while preserving complete component decoupling and single-responsibility boundaries in the code.

---

## Architectural Surface Mapping

1. **UI Surface**: `TaskDetailsModal` header actions and `TaskUpdateModal` footer actions render swap triggers. Transitions utilize `--dt-duration-fast` (150ms) to ensure smooth backdrop swaps.
2. **Data Surface**: N/A.
3. **Reactive Surface**: `TaskCockpitView` coordinates visibility states using standard `useModalFlow` controls, clearing and mounting each view sequentially.
4. **Service Surface**: N/A.
5. **Module Surface**: Components are decoupled, avoiding circular imports and keeping individual file sizes within acceptable bounds.
6. **Governance Surface**: Registered new design invariant `FKL-DI-019` in `COMPONENTS.md` with bidirectional back-links in all three source components to prevent future developers from violating the decoupled modal pattern.

---

## Corrective Actions & Resolution

1. **Decoupled Swapping callbacks**: Implemented `onSwapToUpdate` and `onSwapToDetails` props.
2. **Transition Orchestration**: Added a `150ms` timeout in `TaskCockpitView.jsx` modal rendering to synchronize the close/open transitions.
3. **Standards Hardening**: Added design invariant `FKL-DI-019` definition at the end of `docs/ssot/ui-design/spokes/COMPONENTS.md`.
4. **Discoverability Back-links**: Added standard reference comments above the signatures/modals in `TaskCockpitView.jsx`, `TaskDetailsModal.jsx`, and `TaskUpdateModal.jsx` linking back to `COMPONENTS.md`.

---

## Prevention & Invariants

- **FKL-DI-019 (SSOT Invariant)**: Multi-modal views that transition between read-only auditing and transactional write paths MUST be kept as separate, decoupled components. Visual continuity must be solved via parent orchestrator transitions (e.g. using a 150ms delay) rather than unifying components into a single bloated file.
