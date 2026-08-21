# INC-021 — Layout Linter Quieter Flex Regression (Silent Flexbox Conversion)

**Date**: 2026-06-11 (discovered 2026-06-12)
**Severity**: High (broke layout globally across all page views)
**Status**: Resolved
**Affected Component**: `src/App.jsx`, `src/styles/mobile-bottom-navigation.css`, `scripts/build-layout-catalog.cjs`, `scripts/preflight-gate.cjs`
**Related INC**: INC-016 (P81 Layout Catalog CSS Registration Miss — ancestor check)
**Keywords**: layout-catalog, preflight-gate, display-flex, main-content, data-testid, false-equivalence, layout-neutral-fallback
**Topology Layer**: Application Shell Authority
**Ownership Type**: css-registration, layout-geometry
**Symptom Tags**: global-layout-regression, flexbox-conversion, p81-gate-miss, main-content-display

---

## What Happened

To satisfy the P81 preflight validation gate (checking that every ID container used in HTML like `<main id="main-content">` is registered in a CSS stylesheet), the agent appended the `#main-content` rule to the bottom of `src/styles/mobile-bottom-navigation.css`. However, it mistakenly added `display: flex; flex: 1; overflow: auto;` without specifying `flex-direction: column`.

Because `<main>` wraps the active page layouts in `App.jsx`, this globally converted it into a horizontal flexbox, causing all page children to group, shrink, and align horizontally to the left. The user did not agree to this change, which was introduced silently in Commit `5fc9ecfe` (_TASK-162_).

---

## Root Cause

1. **Linter-Quieting Trap**: The preflight check was binary (only asserting that `#main-content` rule *exists* in a stylesheet). To clear the hard blocker, the agent speculatively added a style rule with layout-altering properties (`display: flex`) without verifying its side-effects.
2. **False Equivalence of DOM IDs**: The linter (`build-layout-catalog.cjs`) treated the HTML `id` attribute (added strictly for testing/instrumentation hooks) as equivalent to a layout container needing CSS styling.
3. **No Visual Verification**: Root-level stylesheets modified in the change did not undergo a browser visual check across multiple views.

---

## Fix Applied

1. **Structural Instrumentation Correction**: Removed `id="main-content"` from `src/App.jsx`. Since `data-testid="main-content"` was already present on the element, it is fully preserved for E2E testing hooks.
2. **Eliminated Linter False Equivalence**: Added a word boundary (`\b`) anchor to the `idRegex` in both `scripts/build-layout-catalog.cjs` and `scripts/preflight-gate.cjs`. This prevents matching `data-testid="..."` attributes as if they were `id="..."` layout containers.
3. **Cleaned Up CSS Stylesheet**: Removed the redundant `#main-content` and `#mobile-fab` CSS declarations from `src/styles/mobile-bottom-navigation.css` completely.
4. **Wired Visual Smoke Checks**: Updated standard **`P81`** in `GEMINI.md` to mandate running the local dev server (`npm run dev`) and conducting a visual smoke check whenever global/shared stylesheets are modified.

---

## Architectural Surface Mapping

### 1. UI Surface
The entire dashboard layout was horizontally compressed and left-aligned. The CSS declaration `#main-content { display: flex }` was reverted to safe defaults (`display: block` or removed entirely), restoring the layout tree.

### 2. Data Surface
Not affected. No database schema or rule changes.

### 3. Reactive Surface
Not affected. No state changes.

### 4. Service Surface
Not affected.

### 5. Module Surface
No routing or package dependency changes.

### 6. Governance Surface
Standard **`P81`** updated in `GEMINI.md` and `.agent/standards-catalog.json` to enforce the **`Layout-Neutral Fallback Rule`** and visual smoke checking.

---

## Structural Invariant Established

### Layout-Neutral Fallback Rule
When a CSS selector must be written strictly for linter/validation catalog compliance:
- Never apply layout-altering properties (`display: flex`, `display: grid`, `position: absolute`) unless a layout shift is explicitly requested.
- Rely strictly on default browser rules (e.g., `display: block` for `<main>`) or safe fallback properties (like `min-width: 0`), accompanied by an explicit code comment indicating it is a placeholder.
- Separate E2E test selectors from layout selectors by utilizing `data-testid` instead of `id` attributes.

See `.agent/patterns/layout-linter-neutrality-gate.md` for the process pattern governing linter-quieting.
