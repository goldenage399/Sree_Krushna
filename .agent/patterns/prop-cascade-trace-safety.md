---
pattern: prop-cascade-trace-safety
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Prop Cascade Trace Safety

**Category**: Design Gate / Process Invariant
**Applies to**: Frontend Refactoring, View Simplification, Prop Cleanup
**Origin**: 2026-07-10 INC-054
**Status**: VALIDATED

---

## Pattern — Prop Cascade Trace Safety

### Problem
Removing or simplifying a prop (such as a shared styling `variant`) from a parent container because it appears obsolete for one target component (e.g., a modal) can silently break styling and behavior in other sibling or child components (e.g., a card list) that reuse the same prop. This leads to silent layout regressions that pass syntax compilation checks but fail visual inspection.

### Why it happens
React props are often passed down through multiple wrapper components (prop drilling) or shared among different component interfaces under the same name. Static type checks and bundle tools (like Vite/Rollup) only detect reference errors, not visual state regressions caused by missing design-toggle props.

### Solution
1. **Multi-Consumer Search (AVP Gate)**: Before removing or modifying any prop or styling variable from a layout wrapper, run a global grep query matching the prop name against all child components instantiated within that wrapper's subtree.
2. **Hardcode Localized Sub-Component States**: If a sub-component (like `TaskCard`) is hosted inside a dedicated view (like `TaskCockpitView`) that has a permanent design standard, hardcode the styling prop (`variant="cockpit"`) directly onto that sub-component instead of forwarding it from parent configuration objects.
3. **Typography Block Enforcements**: Avoid utilizing default inline elements (like `<span>`) for multiline metadata layouts. Always explicitly override the tag using block elements (`as="div"` or `<p>`) to prevent layout-smashing regressions.

### Failure Mode
Allowing parent components to drop layout configuration parameters globally, causing nested child cards to collapse to wide default legacy states.

### Task-Dashboard instance
[INC-054](file:///d:/GitHub_Repo/Task-Dashboard/docs/incidents/INC-054-task-card-layout-regression.md) in [TaskCockpitView.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskCockpitView.jsx) and [TaskCard.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskCard.jsx).
