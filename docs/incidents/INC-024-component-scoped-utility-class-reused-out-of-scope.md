# Incident Report: INC-024 — Component-Scoped Utility Class Reused Out of Scope → Transparent Surfaces

**Date**: 2026-06-23
**Status**: RESOLVED
**ID**: INC-024
**Track**: Frontend / Design Tokens / Semantic-Bridge Discipline
**Resolved By**: Replaced `bg-theme-surface*` / `bg-theme-{info,danger}-bg` (scoped under `.integrated-profile-selector`) with the global semantic-bridge utilities `bg-surface` / `bg-surface-secondary` and Tailwind-mapped tokens in `TaskAssignmentConsoleModal.jsx`.
**Keywords**: scoped-utility-class, bg-theme-surface, semantic-bridge, bg-surface, transparent-background, washed-out-modal, profile-cards.css, design-tokens, ARCH-INV-004
**Topology Layer**: Component Authority ↔ Theme/Token Layer
**Ownership Type**: css-token / utility-scope
**Symptom Tags**: modal-transparent, washed-out, low-contrast, see-through-panel, undefined-class
**Related**: [INC-023](./INC-023-page-anchor-position-static-overrides-fixed-overlay.md) (same component, positioning trap)

---

## 1. Executive Summary

After the INC-023 positioning fix made `TaskAssignmentConsoleModal` visible, the modal rendered **washed-out and see-through** — the dimmed page behind it bled through the panel, header, and priority chips, with no solid surface and poor contrast (most visible on the sepia/ambient theme).

Cause: the component reused class names (`bg-theme-surface`, `bg-theme-surface-subtle`, `bg-theme-info-bg`, `bg-theme-danger-bg`, `text-theme-{info,danger}-text`) copied from `IntegratedProfileSelector`. Those are **not global utilities** — they are hand-written CSS **scoped under a parent selector**:

```css
/* src/styles/components/profile-cards.css */
.integrated-profile-selector .bg-theme-surface        { … }
.integrated-profile-selector .bg-theme-surface-subtle { … }
.integrated-profile-selector .bg-theme-info-bg        { … }
.integrated-profile-selector .bg-theme-danger-bg      { … }
```

Outside the `.integrated-profile-selector` ancestor, those selectors match nothing → the `background`/`color` is never set → transparent. `tailwind.config.cjs` maps `theme-bg`, `theme-fg`, `theme-border`, `theme-primary`, `theme-error/warning/info` — but **not** `theme-surface`. The only reason the overlay dimmed at all is that `.bg-theme-overlay` *is* a global rule.

The trap is invisible in the JSX: the class names look identical to working ones, but their definitions live in another component's stylesheet behind a descendant combinator.

---

## 2. Root Cause

Three overlapping token families with no enforced boundary:

1. **Tailwind-mapped** (global): `theme-bg`, `theme-bg-card`, `theme-fg`, `theme-border`, `theme-primary`, `theme-error/warning/info` (`tailwind.config.cjs`).
2. **Global semantic-bridge utilities**: `.bg-surface`, `.bg-surface-secondary`, `.bg-surface-elevated`, `.bg-surface-sunken` (`tailwind-semantic-bridge.css`) — the canonical surface classes used by `ResponsiveModal.jsx`.
3. **Component-scoped utilities**: `.integrated-profile-selector .bg-theme-surface*`, `.bg-theme-{info,danger}-bg`, etc. (`profile-cards.css`) — only valid inside that component.

Copy-pasting markup from a component in family (3) into a new component silently drops the styling, because the classes carry no background outside their scope.

---

## 3. Resolution

In `TaskAssignmentConsoleModal.jsx`:

| Was (scoped → transparent) | Now (global, theme-safe) |
| :--- | :--- |
| `bg-theme-surface` | `bg-surface` |
| `bg-theme-surface-subtle` | `bg-surface-secondary` |
| `bg-theme-{danger,info}-bg` + `text-theme-{danger,info}-text` (priority chips) | `bg-surface-secondary` + Tailwind-mapped `text-theme-{error,warning,info}` |
| `hover:border-theme-primary-hover` (unmapped) | `hover:border-theme-primary` |

`bg-theme-overlay` was left as-is (it *is* a global rule). Rebuilt clean.

Canonical reference for modal surfaces: `src/components/ResponsiveModal.jsx` (`bg-surface` / `bg-surface-secondary`).

---

## 4. Surface Impact (compact)

- **UI**: ✅ AFFECTED — transparent panel/header/chips; fixed by switching to global surface utilities.
- **Data / Reactive / Service / Security**: ✅ NOT AFFECTED — pure styling.

---

## 5. Prevention (→ P91)

**Invariant**: Components must style surfaces with **global** utilities only — the semantic-bridge `bg-surface*` family or Tailwind-mapped `theme-*` tokens. Never reuse a class that is defined **only** under another component's ancestor selector (e.g. `.integrated-profile-selector .bg-theme-surface`). When copying markup between components, verify every `bg-`/`text-`/`border-` class resolves globally.

**Mechanical check**: enumerate utility classes defined behind a descendant combinator in `src/styles/components/*.css` (e.g. `.integrated-profile-selector .bg-theme-surface`), then grep other components for those class names appearing without the scoping ancestor.

```bash
# scoped utility classes (defined behind a parent selector)
grep -rnE "^\.[a-z-]+ \.(bg|text|border)-theme-[a-z-]+" src/styles/components/
# then confirm those class names are NOT used in other components without that ancestor
grep -rn "bg-theme-surface" src/components src/pages   # should resolve to a global rule, not a scoped one
```

**Canonical surfaces**: panel = `bg-surface`; subtle/secondary fill = `bg-surface-secondary`; elevated = `bg-surface-elevated` (`src/styles/tailwind-semantic-bridge.css`).
