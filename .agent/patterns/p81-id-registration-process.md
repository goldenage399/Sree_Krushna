---
pattern: p81-id-registration-process
activation_tier: reference
canonical_source: task-dashboard
status: VALIDATED
portability: universal
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

---

# P81 Layout Catalog — ID Registration Process

## Problem

When you add `id="my-element"` to a JSX component (e.g. a `<form>`, `<section>`, `<div>` that acts as a layout anchor), the P81 preflight gate will block your next commit because `#my-element` is not indexed in `dist/layout-catalog.json`.

The catalog is built from CSS files only — inline JSX `id=` attributes are invisible to it.

## Required Steps (do all three in the same changeset)

1. **Add a CSS rule** for the selector in the appropriate stylesheet:
   ```css
   /* In src/styles/components/modals-overlays.css (for modal IDs)
      or src/styles/pages/<PageName>.css (for page-level IDs) */
   #my-element {
     display: block; /* minimum: at least one layout property */
   }
   ```
   Use a meaningful layout property if one applies (`position: relative`, `overflow: hidden`, etc.). If no layout property is meaningful, `display: block` is acceptable as a registration marker.

2. **Rebuild the catalog**:
   ```bash
   npm run cache:build:layout
   ```

3. **Verify the entry**:
   ```bash
   node -e "const c=require('./dist/layout-catalog.json'); console.log(c.selectors['#my-element'])"
   ```
   Confirm `consumedIn` includes the JSX file where you added the `id`.

## Why

`dist/layout-catalog.json` is the authoritative index of all layout-relevant DOM selectors. P81 uses it to enforce that every layout container with a named ID is intentionally registered — preventing orphaned IDs that have no CSS counterpart and may indicate an incomplete implementation.

## What qualifies as a "layout container"?

Any element with `id=` that:
- Is a structural container (form, section, article, div acting as a panel)
- Is referenced by another element via `form="id"` or `aria-controls="id"`
- Has layout CSS (position, display, overflow, height, width)

Purely decorative or semantic IDs (e.g., `<label for="field">`, `id` used only for `aria-labelledby`) are still caught by P81 and must be registered.

## Modal Accessibility & Layout ID Rule (Rule 5)

Whenever implementing W3C ARIA modal accessibility per `.agents/AGENTS.md` (which mandates passing `id` to `<ResponsiveModal>`), always append `#{id} { display: block; }` to `src/styles/components/modals-overlays.css` in the same changeset.

## Preflight Auto-Healing & Context Diagnostics (INC-085)

`scripts/preflight-gate.cjs` includes built-in auto-healing:
1. **On-Demand Auto-Rebuild**: If a selector is present in a CSS stylesheet but `dist/layout-catalog.json` was not recompiled, preflight automatically executes `build-layout-catalog.cjs` in memory to sync the catalog, allowing the gate to pass without manual build steps.
2. **Actionable Diagnostics**: If the selector is missing from CSS entirely, preflight outputs the exact target file (`modals-overlays.css` for modals/drawers vs `page-anchors.css` for pages) and the declaration snippet.

## Pre-commit checklist when adding `id=` to JSX

- [ ] Added CSS rule in relevant stylesheet (`src/styles/components/modals-overlays.css` for modals, `src/styles/page-anchors.css` for page containers)
- [ ] Ran `npm run cache:build:layout` (or let `npm run preflight` auto-sync)
- [ ] Ran `node -e "require('./dist/layout-catalog.json').selectors['#my-id']"` — confirms indexed entry
- [ ] `npm run preflight` passes with Exit Code 0

