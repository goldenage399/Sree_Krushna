---
pattern: ui-primitive-codebase-wide-standardization
activation_tier: reference
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# UI Primitive Codebase-Wide Standardization

**Category**: Process Pattern  
**Applies to**: Any task phrased as "standardize X across the app", "make all Y use Z", "unify loading states" etc.  
**Origin**: Session 2026-06-27 — Loading spinner alignment standardization task  
**Status**: HYPOTHESIS

---

## Pattern — Full Codebase Audit Before Declaring Complete

### Problem
When standardizing a shared UI primitive (spinner, loader, button variant, etc.) across the codebase, it is tempting to update only the files you personally touched or know about. This leaves instances in less-frequented pages or admin components untouched, producing the exact inconsistency the task was meant to eliminate.

In this session: 8+ pages were updated in the first pass, but `FeatureFlagManagement.jsx` (a component-as-page in `/admin`) and `ArchivedAccessRequestsPage.jsx` were missed because they weren't in the agent's active working set.

### Why it happens
Agents (and developers) build a mental model of the "known" files. When a component lives in a subdirectory (`components/admin/`) but renders as a full-page experience, it falls outside the expected scan path of `src/pages/`.

### Solution
Before declaring "standardization complete" for any UI primitive, run a **two-phase audit**:

**Phase 1 — grep the old pattern:**
```powershell
# Find all remaining instances of the old implementation
grep -r "animate-spin rounded-full" src/ --include="*.jsx"
grep -r "animate-spin rounded-full" src/ --include="*.tsx"
```

**Phase 2 — grep for all usages of the component being standardized:**
```powershell
# Confirm every usage of the NEW component is using the correct variant
grep -rn "<LoadingSpinner" src/ --include="*.jsx" | grep -v "fullPage"
```

Cross-reference both lists. Any file appearing in Phase 1 or missing `fullPage` in Phase 2 is a missed instance.

**Phase 3 — check admin-subdirectory components specifically:**
Admin panels often contain component-level pages that render like full pages but live in `src/components/admin/` not `src/pages/`. Always include this directory in the audit.

### Failure Mode
Declaring "done" after updating the pages you know about, while admin subdirectory components (e.g. `FeatureFlagManagement.jsx`) retain the old pattern. User correctly calls out the inconsistency.

### Task-Dashboard instance
Session 2026-06-27: `FeatureFlagManagement.jsx` retained a custom CSS-class-based `.loading-spinner` div after all `src/pages/` were updated. The grep audit in `src/components/admin/` was the corrective step.
