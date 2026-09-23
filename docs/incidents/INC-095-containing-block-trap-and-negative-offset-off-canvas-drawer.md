# INC-095 — Containing-Block Trap & Negative-Offset Off-Canvas Drawer (`#quickActionsDropdown`)

**Incident ID**: `INC-095`  
**Date**: `2026-09-23`  
**Severity**: High (Mobile UX Functional Blindness / Off-Screen Negative Space Render)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Governing Standard**: `P-BRAND-NAV-HYBRID-001`, `AC-DEC-2026-036`, `UI-DEC-2026-032`  
**Affected Components**: `index.html`, `public/index.html`, `css/main.css`, `public/css/main.css`  
**Related Patterns**: `.agent/patterns/containing-block-viewport-escape-gate.md`, `.agent/patterns/page-anchors-neutrality.md`  

---

## Architectural Surface Mapping

1. **UI Surface**: The 13-Module Executive Navigation Drawer (`#quickActionsDropdown`) provides universal access across all modules in the Marriage OS.
2. **Data Surface**: Zero data corruption; state machine active.
3. **Reactive Surface**: The drawer opened and responded to clicks/keyboard, but 90% of the interactive surface was rendered in negative coordinate space above the top of the viewport.
4. **Service Surface**: No service layer impact.
5. **Module Surface**: `#stickyHeaderShell` and `#quickActionsDropdown`.
6. **Governance Surface**: Codified `P-BRAND-NAV-HYBRID-001` and `.agent/patterns/containing-block-viewport-escape-gate.md`.

---

## 1. Executive Summary & Symptom

During responsive mobile engineering for the Top-Left Brand Seal compound trigger (`#brandNavTrigger`), users tapping the `👑 ☰` seal on mobile screens observed that the navigation drawer appeared to "go up into negative space" rather than sliding up from the bottom of the viewport.

Upon visual inspection in DevTools (`media_1790185665453.png`):
- The drawer had computed dimensions of `455.2px × 712.6px`.
- Instead of resting at `bottom: 0` of the screen, only the bottom two items (Group 5: `Custody` and `Intake Ledger`) peeked out from underneath the ~76px sticky header.
- The top ~636px of the drawer (Groups 1–4: `Command Center`, `Swimlanes`, `Planning`, `DAG`, `Vedic Liturgy`, `Decorator Cockpit`, `Shopping Registry`, etc.) were positioned above the browser window in negative coordinate space.

---

## 2. The 9-Step Diagnostic Engine

### Step 1: Root Cause Timeline & Technical Anatomy
- **Introduction**: The drawer container `<div id="quickActionsDropdown">` was initially nested inside `<header id="stickyHeaderShell">`.
- **Incorrect Assumption**: Assumed that because `.quick-actions-drawer-container` declared `position: fixed; bottom: 0; left: 0; right: 0;`, the browser would position it relative to the initial viewport containing block (the screen window).
- **The W3C Trap**: `#stickyHeaderShell` declared `backdrop-filter: blur(16px)` and `will-change: transform`. Per the **W3C CSS Transforms Module Level 1** (§ 6) and **CSS Filter Effects Module Level 1** (§ 4) specifications:
  > *Any element with a `transform`, `filter`, `backdrop-filter`, or `perspective` property other than `none` becomes the containing block for all its `position: fixed` and `position: absolute` descendants.*
- **The Consequence**: Because `#stickyHeaderShell` is ~76px tall and positioned at the top of the document, `bottom: 0` for its children is the bottom of `#stickyHeaderShell` (~76px from viewport top). A 712px tall element anchored with `bottom: 0` to a 76px container has its top edge at `76px - 712px = -636px`. It was pushed 636px above the visible screen!

### Step 2: Escape Analysis
- **Why did it pass automated checks?**
  Pre-flight gates checked that `#quickActionsDropdown` existed in the DOM, had proper classes, and that the state machine toggled `.active`. Headless DOM testing without layout geometry does not compute CSS bounding box positions.
- **How was it discovered?**
  User manual validation in mobile emulation captured the anomaly (`media_1790185665453.png`).

### Step 3: Systemic Weaknesses
Nesting overlays, drawers, backdrops, or modals inside header shells or cards rather than at document root creates hidden containing block dependencies whenever ancestors adopt modern blur, opacity, or transform styling.

### Step 4: Change Impact Analysis
Decoupling `#quickActionsDropdown` outside `#stickyHeaderShell` ensures its containing block is the true viewport root (`100vw × 100vh`), restoring intended mobile bottom-sheet behavior and desktop left-anchored panel behavior.

### Step 5: Missed Signals
DevTools computed styles clearly indicated `containing block: #stickyHeaderShell` instead of `containing block: viewport`.

### Step 6: Preventive Guardrails
1. **DOM Placement Invariant (`INV-OVERLAY-ROOT-001`)**: All slide-over drawers, modals, and backdrops must be mounted as direct children of the document root (e.g. direct children of `<body>` or adjacent to `<main>`), completely outside any headers, navbars, or transformed shells.
2. **CSS Audit Gate**: No ancestor of a `position: fixed` element may declare `backdrop-filter`, `transform`, `filter`, or `perspective`.

### Step 7: Generalized Defect Pattern
**The Containing-Block Trap**: Placing `position: fixed` elements inside containers with `backdrop-filter` or `transform` causes them to lose viewport coordinate grounding and inherit the parent's layout bounds.

### Step 8: Repository Scan
Audited other modals in `index.html`:
- `#inspirationModal`: Direct child of body. (Safe)
- `#intakeLedgerModal`: Direct child of body. (Safe)
- `#executiveShareModal`: Direct child of body. (Safe)
- `#skOptionIntakeBackdrop`: Sibling in body. (Safe)

### Step 9: Knowledge Capture
- Codified into `.agent/patterns/containing-block-viewport-escape-gate.md`.
- Documented in `User_Created/Discussion Threads/Council/260923_arch_council_top_left_brand_seal_and_navigation_drawer_architecture.md`.

---

## 3. Remediation & Code Changes

1. **DOM Tree Decoupling (`index.html` & `public/index.html`)**:
   Extracted `<div class="quick-actions-drawer-container" id="quickActionsDropdown">` and `<div class="quick-actions-backdrop" id="headerQuickActionsBackdrop">` outside `<header class="app-sticky-shell" id="stickyHeaderShell">`, placing them as direct siblings right before `<main>`.
2. **CSS Positioning Calibration (`css/main.css` & `public/css/main.css`)**:
   - Desktop ($\ge 768\text{px}$): `position: fixed; top: 52px; left: 14px; bottom: auto; right: auto;`.
   - Mobile ($< 768\text{px}$): `position: fixed; top: auto; bottom: 0; left: 0; right: 0; max-height: 85vh; border-radius: 18px 18px 0 0;`.
3. **PWA Cache Invalidation**: Bumped service worker cache to `sree-krushna-os-v4.3.1` to force instant client refresh.

---

## 4. Certification & Verification

- `fc.exe /b index.html public\index.html` — `100%` byte identical.
- `npm run verify:ui-lifecycle` — `100% GREEN`.
- `npm run verify:mobile` — `16/16 PASSED`.
- `npm run verify:deployment` — `10/10 LAYERS PASSED`.
