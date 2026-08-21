---
pattern: modal-gating-by-active-view
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Modal Gating by Active View

**Category**: Design Gate
**Applies to**: Frontend pages containing tabbed views or child view outlets that render their own decoupled modals.
**Origin**: 2026-07-09 (INC-052 Double Modal Overlap)
**Status**: VALIDATED (Applied and verified in `TeamOversightPage.jsx`)

---

## Pattern — Modal Gating by Active View

### Problem
When navigating between different sub-views or tabs on a parent page (e.g. switching from Profile Queues to a flat All Tasks list), a details modal triggered from one tab stays mounted in background state while a second details modal is triggered in the active sub-view. This causes dual dark backdrops, stacked dialog panels, and double click events.

### Why it happens
React pages often render page-level modal overlays (e.g. `{isDetailsOpen && <Modal />}`) to handle list item clicks. However, if a nested child component (e.g. `<TaskCockpitView />`) also implements its own internal decoupled modal states to support complex transitions, both the parent page-level modal and the child component-level modal can mount simultaneously if the parent's visibility state was not unmounted when switching sub-views.

### Solution
Whenever a parent page renders sub-views or tabs, and any of those child sub-views manage their own internal decoupled modal states:
1. **Gate the parent modal**: Add the tab/view condition to the parent modal's rendering gate.
   ```javascript
   // Parent page JSX
   {isDetailsOpen && activeTab !== 'nested-cockpit' && (
     <TaskDetailsModal ... />
   )}
   ```
2. **Clear state on tab swap**: Explicitly set the parent page's modal open states to `false` when the active tab/view changes.

### Failure Mode
If the gate is omitted, clicking an element in the child sub-view might open its local modal while the parent modal is also active, leading to visual overlap and unusable UI overlays.

### Task-Dashboard instance
In [TeamOversightPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/TeamOversightPage.jsx#L1566-L1570), the page-level `TaskDetailsModal` is gated by `mainView !== 'all-tasks'` to prevent overlapping with the `TaskDetailsModal` inside `TaskCockpitView`.
