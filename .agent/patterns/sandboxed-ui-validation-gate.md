---
pattern: sandboxed-ui-validation-gate
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

# Sandboxed UI Validation Gate

**Category**: Process / Design Gate
**Applies to**: All major UI screen redesigns, feature layout components, and visual enhancements.
**Origin**: User requested process logic in session 2026-07-02.
**Status**: VALIDATED

---

## Pattern — Sandboxed UI Validation Gate

### Problem
Directly implementing or editing complex UI components within production routing contexts can lead to visual regressions, viewport responsiveness breakages across devices, or database context state failures. Finding bugs in a fully integrated layout with live asynchronous database hooks is difficult, slow, and risks polluting production components.

### Why it happens
1. Production pages rely on complex layout grids, global CSS theme overrides, and parent containers that dictate width, margins, and overflow.
2. In-place visual editing lacks a controlled playground, making it difficult to isolate browser render bugs (such as flexbox misalignment or dark-theme contrast issues).

### Solution
Before replacing or integrating any major UI screen or refactored component into the production codebase:
1. **Create a Sandboxed Test Component/Page**: Set up a dedicated preview page or component (e.g., `src/components/activity/ActivityShellPreview.jsx` or similar) staffed with mock or static test data.
2. **Conduct Multi-Theme Parity Review**: Open the sandbox page in the browser and test it under all 5 available visual themes (Light, Dim Dark, Grayscale, Sepia, Velvet-Dark) to check for text legibility, contrast accessibility, and style overrides.
3. **Conduct Multi-Viewport Verification**: Inspect layout behavior across standard breakpoints (320px, 768px, 1024px, 1280px) to confirm margins, wrapping, and scroll behavior comply with responsive contracts.
4. **Promotion to Production**: Once verified and approved in the sandbox, swap the new component into production layouts/routes.

### Failure Mode
Skipping the sandbox stage and directly modifying integrated production components, which results in hard-to-debug cascading flex regressions on mobile viewports, unverified CSS selector wars in custom themes, and compilation regressions that block standard unit tests.

### Task-Dashboard instance
During the `ActivityShell` unification, the visual layouts were successfully prototyped and validated using a dedicated `ActivityShellPreview.jsx` page before integration.
