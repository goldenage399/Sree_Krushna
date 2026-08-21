# INC-033 — Theme Card Border Specificity Collision

**Date**: 2026-06-26
**Severity**: Medium (State-to-accent border markers not showing; visual feedback broken)
**Status**: Resolved
**Affected Component**: `src/styles/themes-enhanced.css`, `src/components/TaskCard.jsx`
**Related INC**: INC-002 (Tailwind bridge cascade conflict)
**Protocol**: P-CSS-001 (Theme Specificity & Shorthand Rules)

---

## What Happened

The left-accent borders (`border-l-status-[state]`) added to task cards to visually denote status (Blocked, Overdue, Urgent, Active, Success, Default) were not displaying. The cards retained their default theme border colors on all four sides.

---

## Root Cause

In `src/styles/enhanced-themes.css`, the global theme selector overrides set:
```css
[data-theme] .border,
[data-theme] .card {
  border-color: var(--theme-border-glow) !important;
}
```

This rule had a selector specificity of `(0, 2, 0)`.
The status border rules in `src/styles/themes-enhanced.css` were defined as:
```css
.border-l-status-blocked {
  border-left-color: var(--color-status-blocked) !important;
}
```
This rule had a selector specificity of `(0, 1, 0)`.

Because `border-color` is a shorthand property in CSS, it sets all four sides (top, right, bottom, left). When both declarations use `!important`, the browser resolves the conflict using the selector specificity: `(0, 2, 0)` from the theme card selector overrides our `.border-l-status-*` utility class's specificity of `(0, 1, 0)`. As a result, the left border color was overridden back to `var(--theme-border-glow)`.

---

## Fix Applied

We prefix the status border utilities in `src/styles/themes-enhanced.css` to raise their specificity to `(0, 3, 0)` so they override any shorthand border declarations applied to cards:

```css
[data-theme] .card.border-l-status-blocked,
[data-theme] .border.border-l-status-blocked,
[data-theme] .border-l-status-blocked,
.border-l-status-blocked {
  border-left-color: var(--color-status-blocked) !important;
}
```

This is repeated for all status types. This has successfully restored the left border accent lines.

---

## Architectural Surface Mapping

| Surface | Impact | Notes |
|---|---|---|
| **UI Surface** | ✅ Affected | Visual status-to-accent lines on Task Cards were completely overridden and invisible. |
| **Data Surface** | — Unaffected | No database schemas or writes were involved in this visual override. |
| **Reactive Surface** | — Unaffected | State management and component reactive bindings were functioning correctly. |
| **Service Surface** | — Unaffected | No backend or service layers were involved. |
| **Module Surface** | — Unaffected | Static component module dependencies were unchanged. |
| **Governance Surface** | ✅ Affected | Established CSS Specificity & Shorthand rules must govern custom utility priority to prevent shorthand overrides. |

---

## Invariant Reinforced

> **P-CSS-001 — CSS Specificity & Shorthand Rule**: CSS shorthand declarations (like `border-color`, `background`, `margin`) set with `!important` will override specific side properties (like `border-left-color`) even if the latter also carry `!important`, if the shorthand selector has equal or greater specificity. All custom status border classes or visual overlays must declare selectors with high specificity (e.g. `[data-theme] .card.border-l-status-*`) to win the cascade.

---

## DISC-001 Back-Link Added

Added the back-link comment to the status classes at the end of [themes-enhanced.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/themes-enhanced.css):
```css
/* SSOT: docs/ssot/ui-design/spokes/THEME-SYSTEM.md § "State-to-Accent Border Status Tokens" — P-CSS-001 */
```
