# INC-002 — Tailwind Semantic Bridge Cascade Conflict

**Date**: 2026-05-17  
**Severity**: High (silent layout regression — all responsive Tailwind variants app-wide)  
**Status**: Resolved (pattern fix applied; systemic audit pending)  
**Affected Component**: `AdminRequestReview.jsx` (discovery point); blast radius: entire application  
**Keywords**: responsive, breakpoint, tailwind, lg-variant, sm-variant, flex, cascade, bridge, silent-failure, layout-regression
**Topology Layer**: Responsive Authority
**Ownership Type**: responsive
**Symptom Tags**: lg-variant-no-op, cascade-override, bridge-specificity-lock, responsive-frozen

---

## What Happened

The `AdminRequestReview.jsx` page header was being restructured to right-align status text and button rows on desktop while stacking vertically on mobile. Standard mobile-first Tailwind responsive classes were applied:

```jsx
<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-end">
```

Despite repeated edits — trying `lg:flex-row`, `lg:items-end`, `lg:justify-end` — the layout never switched to horizontal on desktop. All `lg:` variants silently no-oped. The component remained left-aligned and vertically stacked at all viewport widths.

---

## Root Cause

**`tailwind-semantic-bridge.css`** (ENH-UI-QUALITY-045) defines static utility classes with the same names as Tailwind base utilities:

```css
/* tailwind-semantic-bridge.css — lines 249-260 */
.flex-col      { flex-direction: column; }
.items-start   { align-items: flex-start; }
.justify-start { justify-content: flex-start; }
/* ... and other overlap classes */
```

**Load order in `App.jsx`** (confirmed via `index.css` line 28 + App.jsx import order):

```
index.css → @tailwind utilities  (specificity 0,1,0)
App.jsx   → tailwind-semantic-bridge.css  (specificity 0,1,0, loaded AFTER)
```

**CSS cascade rule**: equal specificity → later source order wins.

The bridge imports after Tailwind utilities. When an element carries both `.flex-col` and `.lg:flex-row`, the browser evaluates:
- `.flex-col { flex-direction: column }` from bridge (later, wins)
- `.lg:flex-row { flex-direction: row }` from Tailwind (earlier, loses at same specificity)

The responsive variant is silently overridden. No error is thrown. The layout appears "stuck."

---

## What Was Wrong

The bridge was designed to add semantic meaning to raw Tailwind classes, but it inadvertently re-declared those classes as static rules. Any element using a base class that the bridge also defines will lose all responsive variants for that property.

**Blast radius**: This affects **every component in the app** that:
1. Uses a Tailwind class that the bridge also defines (`.flex-col`, `.items-start`, `.justify-start`, and others), AND
2. Relies on a responsive `md:` or `lg:` variant to override it

The failure is silent — no console error, no visible broken rule, just wrong layout.

---

## Resolution

**Immediate fix** (AdminRequestReview.jsx header): Created bridge-safe semantic classes in `src/styles/utilities/components.css` using unique names not present in the bridge, with explicit `@media` blocks:

```css
/* Bridge-safe header layout — components.css */
.page-header-split {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (min-width: 1024px) {
  .page-header-split {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
  }
}

.page-header-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
@media (min-width: 1024px) {
  .page-header-actions {
    flex: 1;
    align-items: flex-end;
  }
}

.page-header-status {
  width: 100%;
  text-align: start;
}
@media (min-width: 1024px) {
  .page-header-status {
    text-align: end;
  }
}

.page-header-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  justify-content: flex-start;
}
@media (min-width: 1024px) {
  .page-header-row {
    justify-content: flex-end;
  }
}
```

**Why this works**: Unique class names (`page-header-split` etc.) don't exist in the bridge, so there is no conflict. The `@media` block wins by conditional specificity regardless of load order.

---

## Lessons Learned

1. **Bridge overlap classes silently kill responsive Tailwind** — any class the bridge defines becomes a static rule that wins over all responsive variants
2. **Responsive debugging checklist must include load order** — before assuming the breakpoint is wrong, check whether the base class appears in the bridge
3. **The escape hatch is scoped semantic names** — create new class names not in the bridge, use `@media` blocks directly
4. **`lg:` prefixed classes are not enough** — Tailwind's JIT generates them at specificity 0,1,0, same as the bridge; media queries don't add specificity
5. **Systemic audit needed** — any component in the app that appears visually correct may still be silently locked; audit required for all components using overlapping base classes

---

## Files Affected

| File | Change |
|------|--------|
| `src/components/AdminRequestReview.jsx` | Header refactored: removed conflicting Tailwind responsive classes, replaced with bridge-safe `page-header-*` classes |
| `src/styles/utilities/components.css` | Added `.page-header-split`, `.page-header-actions`, `.page-header-status`, `.page-header-row` with explicit `@media` blocks |
| `src/styles/tailwind-semantic-bridge.css` | **Not modified** — root cause file; modification would break bridge's designed purpose |
| `docs/incidents/INC-002-tailwind-bridge-cascade-conflict.md` | Created: this file |
| `docs/adr/ADR-008-BRIDGE-SAFE-CSS-PATTERN.md` | Created: architectural decision to adopt bridge-safe pattern going forward |

---

## Follow-Up Actions

- [ ] Audit all components for silent bridge-overridden responsive classes (grep: `flex-col.*lg:flex-row`, `items-start.*lg:items-end`)
- [ ] Add bridge conflict warning to `RESPONSIVE-DESIGN.md` spoke
- [ ] Add cascade load-order note to `CSS-TO-COMPONENT-MAP.md`
- [ ] Add Case Study 5.6 to `DEBUGGING_HANDBOOK.md`
- [ ] Consider adding ESLint rule to flag co-located base+responsive classes that appear in the bridge

---

## References

- **ADR-008**: [Bridge-Safe CSS Pattern](../adr/ADR-008-BRIDGE-SAFE-CSS-PATTERN.md)
- **Bridge file**: `src/styles/tailwind-semantic-bridge.css` (load order #3 in App.jsx)
- **Fix location**: `src/styles/utilities/components.css`
