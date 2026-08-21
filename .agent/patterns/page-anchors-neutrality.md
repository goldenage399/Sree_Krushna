---
pattern: page-anchors-neutrality
activation_tier: reference
status: HYPOTHESIS
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

# Page Anchors Specificity Neutrality

**Category**: Design Gate
**Applies to**: E2E testing, accessibility styling anchors, page-anchors.css modifications
**Origin**: 2026-07-10 INC-055
**Status**: HYPOTHESIS

---

## Pattern — Page Anchors Specificity Neutrality

### Problem
Custom ID selectors (e.g. `#edit-task-details-modal`) in page-anchors stylesheet files override critical positioning properties of core layout primitives (like modal backdrops or layout grids) due to higher CSS specificity. This causes regressions (like modals rendering at the bottom of the body viewport, or grids breaking layout structures).

### Why it happens
React component layout primitives are styled with class names (e.g. `.modal-backdrop-enhanced { position: fixed; ... }`). When E2E testing or accessibility rules reference the root-level container ID using an ID selector (`#some-id { position: relative; }`), the browser prioritizes the ID rule over the class rule, overriding its layout position.

### Solution
Testing and instrumentation ID selectors in `page-anchors.css` or other stylesheet directories MUST NOT define layout-breaking positioning properties (e.g., `position: relative`, `position: absolute`, `top`, `left`, `z-index`, `margin`). 
- Instead, use layout-neutral style declarations like `display: flex`, `content-visibility: auto`, or `min-height: 0` to preserve testing anchor viability without corrupting native coordinates.

### Failure Mode
Declaring a layout position override (such as `position: relative;`) on an ID selector that matches a component's top-level fixed backdrop or flex wrapper container, causing rendering shifts.

### Task-Dashboard instance
[page-anchors.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/page-anchors.css#L28) ID selector `#edit-task-details-modal` overrode `.modal-backdrop-enhanced` fixed layout, shifting the Edit task details modal half-offscreen to the bottom of the page.
