# INC-004 — Transparent Backdrop Bleed-Through & Ghost Class Proliferation

**Date**: 2026-05-18  
**Severity**: High (visual layout break, contrast/legibility failure on active modals)  
**Status**: Resolved (bridge safety net applied; ast-grep static rule active)  
**Affected Component**: `ResponsiveModal.jsx` (and 300+ legacy class references codebase-wide)  
**Keywords**: modal, backdrop, transparent, bleed-through, overlay, bg-surface, theme, tablet, viewport, ghost-class
**Topology Layer**: Responsive Authority, Component Authority
**Ownership Type**: backdrop, overlay
**Symptom Tags**: modal-transparent, theme-bleed, ghost-class, sepia-theme-break

---

## What Happened

During visual validation under tablet viewports and reading-comfort themes (specifically Sepia), opening the user profile assignment dialog or other modals rendered the modal dialog containers with a **completely transparent background**. 

This caused severe visual bleed-through of page contents behind the active modal interface (such as statistics cards, buttons, and user lists), leading to overlapping text, unreadable labels, and an broken visual experience that violates WCAG AA accessibility contrast compliance.

---

## Root Cause

1. **Legacy Ghost Class Proliferation**: The modal wrapper in the tablet path of `ResponsiveModal.jsx` (and dozens of other components across the app) used legacy background classes like `bg-surface-base`, `bg-surface-base-secondary`, and `bg-surface-base-inverse` for backdrop overlays.
2. **Missing System Declarations**: These background utility classes were never mapped or configured in the Tailwind build config (`tailwind.config.cjs`) or the CSS bridge stylesheet (`tailwind-semantic-bridge.css`). As a result, the browser rendered them as undefined classes, defaulting to transparent backgrounds.
3. **No Automated Invariant Scan**: Because there was no automated parser searching for visual style mismatches, these unmapped background classes remained silent in desktop paths (which used different selectors or themes) and only surfaced under responsive, theme-specific overlays.

---

## Resolution

1. **Centralized CSS Bridge Mapping**: Rather than a high-risk refactoring of 30+ JSX files containing over 300 instances, we implemented a 100% safe, centralized bridge mapping in [tailwind-semantic-bridge.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/tailwind-semantic-bridge.css):
   ```css
   .bg-surface-base           { background: var(--color-surface); }
   .bg-surface-base-secondary { background: var(--color-surface-secondary); }
   .bg-surface-base-tertiary  { background: var(--color-surface-sunken); }
   .bg-surface-base-card      { background: var(--color-surface-elevated); }
   .bg-surface-base-highlight { background: var(--color-accent-muted); }
   .bg-surface-base-input     { background: var(--color-surface); }
   .bg-surface-base-inverse   { background-color: var(--modal-backdrop, rgba(0, 0, 0, 0.6)); }
   ```
   This instantly restores solid, theme-adaptive surface backgrounds and backdrops to all current and legacy pages globally, eliminating bleed-through across Light, Dim, Dark, Sepia, and Velvet themes.

2. **Upgraded `ResponsiveModal.jsx`**: Migrated target classes in `ResponsiveModal.jsx` to clean, modern, bridges-safe variables:
   - `bg-surface-base` ➔ `bg-surface`
   - `bg-surface-base-secondary` ➔ `bg-surface-secondary`

3. **Integrated `ast-grep` Static Invariant Checker**: Deployed a dedicated structural linting rule in [ghost-class-remediation.yml](file:///d:/GitHub_Repo/Task-Dashboard/.claude/sg-rules/ghost-class-remediation.yml) to automatically catch any usage of unmapped legacy classes like `bg-surface-base` during local and CI scans.
   - Run command: `npm run sg:scan`
   - Scans 100% of `.jsx` and `.js` files using tree-sitter AST nodes (`jsx_attribute`).

---

## Lessons Learned

1. **Semantic Bridge Safety Net**: When designing a dynamic theme system, configure fallback styles or mappings for all legacy structural tokens. A single bridge file configuration is far safer and more robust than an ad-hoc, multi-file refactoring.
2. **AST-Based Style Auditing**: Standard text search (regex) is useful, but utilizing AST-level structural analysis (`ast-grep`) allows us to compile-time check that styling tokens used in JSX are strictly mapped to the design system.

---

## Structural Invariant Established

### Protocol 62: Ghost Class Prevention
* **Rule**: Any background utility class utilized in a JSX file (e.g. `bg-surface-base-*`) must be explicitly mapped to a CSS custom property in [tailwind-semantic-bridge.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/tailwind-semantic-bridge.css) or mapped dynamically inside `tailwind.config.cjs`.
* **Verification Gate**: Running `npm run sg:scan` must return `Exit: 0` before any pull request or deployment is approved.
