---
pattern: containing-block-viewport-escape-gate
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"
triggers: []
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Containing-Block Viewport Escape Gate

**Category**: Design Gate & Anti-Pattern  
**Applies to**: Any modal dialog, slide-over drawer, bottom sheet, full-screen backdrop, or floating tooltip styled with `position: fixed`  
**Origin**: 2026-09-23 (`INC-095`, Top-Left Brand Seal Navigation Drawer)  
**Status**: VALIDATED  

---

## Pattern — Containing-Block Viewport Escape Gate

### Problem
When developers build sticky header bars or navigation shells, they frequently apply modern CSS styling such as:
- `backdrop-filter: blur(...)`
- `transform: translate(...)`
- `will-change: transform`
- `filter: ...`
- `perspective: ...`

If an overlay, drawer, or backdrop with `position: fixed` is placed inside this parent element, developers assume it will anchor to the browser viewport (`100vw × 100vh`). However, according to the **W3C CSS Transforms Module Level 1** (§ 6) and **CSS Filter Effects Level 1** (§ 4) specifications:

> *Any element declaring a `transform`, `filter`, `backdrop-filter`, or `perspective` property other than `none` establishes a new containing block for all its `position: fixed` and `position: absolute` descendants.*

### The Consequence
Because the parent sticky header is typically short (e.g. ~76px) and positioned at the top of the screen:
1. `position: fixed; bottom: 0;` inside this parent anchors the overlay to the **bottom of the 76px header**, not the bottom of the screen.
2. A 712px tall bottom-sheet will have its top edge calculated as `76px - 712px = -636px`.
3. The vast majority of the overlay is projected upwards off the top of the browser into negative space, rendering it invisible or unusable on mobile devices.

---

## The Rule: Root-Level Overlay Mounting (`INV-OVERLAY-ROOT-001`)

1. **Mandatory Root-Level Mounting**:
   All slide-over drawers, bottom sheets, modal dialogs, and full-screen backdrops MUST be mounted as direct children of the document root (e.g. direct children of `<body>`, or direct siblings of `<main>`), completely external to any header, navbar, card, or shell container.

2. **Prohibition of Filtered Ancestors**:
   No DOM element that is an ancestor of a `position: fixed` overlay may declare `backdrop-filter`, `transform`, `filter`, or `perspective` unless that ancestor intentionally matches the full viewport dimension (`100vw × 100vh`).

---

## Verification & Detection

### Automated Inspection Check
```javascript
function verifyOverlayContainingBlock(overlayElement) {
  let parent = overlayElement.parentElement;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    const style = window.getComputedStyle(parent);
    const hasTransform = style.transform && style.transform !== 'none';
    const hasFilter = style.filter && style.filter !== 'none';
    const hasBackdropFilter = style.backdropFilter && style.backdropFilter !== 'none';
    const hasPerspective = style.perspective && style.perspective !== 'none';

    if (hasTransform || hasFilter || hasBackdropFilter || hasPerspective) {
      throw new Error(`Containing Block Trap detected! Ancestor <${parent.tagName} id="${parent.id}" class="${parent.className}"> establishes a containing block for fixed overlay <${overlayElement.tagName} id="${overlayElement.id}">.`);
    }
    parent = parent.parentElement;
  }
  return true;
}
```

### Pre-Flight Checklist
- [ ] Is the modal, drawer, or backdrop mounted outside the `<header>` element?
- [ ] Does `#stickyHeaderShell` or any parent container declare `backdrop-filter` or `transform`?
- [ ] When inspecting in DevTools on mobile viewports ($< 768\text{px}$), does `position: fixed; bottom: 0` compute relative to `viewport` rather than a parent container?
