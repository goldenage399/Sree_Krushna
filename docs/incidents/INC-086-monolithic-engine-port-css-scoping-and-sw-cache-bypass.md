# INC-086 — Monolithic Engine Port CSS Scoping Bleed, Service Worker Localhost Cache Lock, and Sub-Engine Shadowing Collision

**Incident ID**: `INC-086`  
**Date**: `2026-08-22`  
**Severity**: High (UI Bleed & View Regression on Tab Switch)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & System Owner  

---

## 1. Executive Summary & Root Cause

During the migration and porting of the authentic 5-Zone DO-PKOS Topology Engine from `UG-Farmhouse` into `Sree_Krushna`:
1. **Sub-Engine Shadowing Collision**: An older 1,200-line legacy implementation of `renderDoPkosStudio()` remained inside `public/js/app.js`. When navigating across tabs (`tab-dashboard` ➔ `tab-dopkos`), `app.js`'s local function was executed instead of the standalone module `public/js/modules/dopkos-engine.js`, overwriting `#dopkos-canvas-container` with the old static 2D grid matrix.
2. **PWA Service Worker Localhost Cache Lock**: On `http://localhost:5000`, the active Service Worker served stale cached versions of `app.js` and `dopkos-engine.js` under the `Stale-While-Revalidate` strategy, causing code edits to not immediately appear on local reload without a hard refresh.
3. **Monolithic CSS Scoping Bleed**: When copying `swimlane-engine.css` from the standalone canvas project, global element resets (`*`, `html, body { overflow: hidden; font-family: ... }`, `.card-header`, `.btn`, etc.) leaked out and broke the host application's typography, scrolling, and card layout across all tabs.

---

## 2. Architectural Surface Mapping (6-Surface Audit)

| Surface | Status | Impact & Remediation |
|---|---|---|
| **UI Surface** | **AFFECTED** | Global CSS resets distorted font hierarchy, hid scrollbars, and corrupted card padding. Remedied by strictly scoping all DO-PKOS CSS under `#tab-dopkos #dopkos-5zone-frame`. |
| **Reactive Surface** | **AFFECTED** | Tab navigation state in `app.js` collided with duplicate local render functions. Remedied by delegating tab hydration exclusively to `window.renderDoPkosStudio()` and `window.renderPlanningSuite()`. |
| **Service / Worker Surface** | **AFFECTED** | Service Worker was caching dynamic local development scripts. Remedied by adding an explicit `localhost` / `127.0.0.1` cache bypass in `sw.js` and bumping `CACHE_NAME` to `sree-krushna-os-v4.1.0`. |
| **Module Surface** | **AFFECTED** | Dual ownership of DO-PKOS between `app.js` and `dopkos-engine.js`. Resolved by removing 1,206 lines of legacy code from `app.js` and consolidating all studio logic in `public/js/modules/dopkos-engine.js`. |
| **Data Surface** | **UNAFFECTED** | Firestore data schema, marriage-state storage keys, and task entities remained intact. |
| **Governance Surface** | **AFFECTED** | Captured 3 structural patterns (`monolithic-engine-port-css-scoping-gate`, `localhost-sw-cache-bypass-gate`, `sub-engine-shadowing-and-tab-reconciliation`), updated standards catalog, and wired PACT-001 contracts. |

---

## 3. Timeline of Events

1. **22:15 IST**: User requested 5-Zone DO-PKOS Studio from `UG-Farmhouse` to become the primary default on `🕸️ Precedence DAG` (`#tab-dopkos`).
2. **22:45 IST**: Monolithic engine ported to `public/js/modules/dopkos-engine.js`.
3. **23:10 IST**: User reported: *"onve i go to another tab and come back http://localhost:5000/#tab-dopkos shows the 🕸️ 2D Precedence Matrix - why"*.
4. **23:21 IST**: Identified legacy duplicate `renderDoPkosStudio()` in `app.js` shadowing `dopkos-engine.js`. Purged legacy code.
5. **23:25 IST**: User reported: *"still its doing the same"*. Diagnosed Service Worker stale cache lock on `localhost:5000` and viewport height collapse in `#tab-dopkos`.
6. **23:39 IST**: User reported: *"but the css got mesed up"*. Diagnosed unscoped global styles in `public/css/dopkos-engine.css` (`*`, `html`, `body { overflow: hidden }`).
7. **23:41 IST**: 100% scoped all styles in `dopkos-engine.css` under `#tab-dopkos #dopkos-5zone-frame`. Passed 8/8 pre-flight gates and verified clean render across all tabs.

---

## 4. Invariant Classification & New Structural Standards

1. **`STD-CSS-SCOPE-001` (Monolithic Engine CSS Scoping Gate)**:
   - When porting external standalone engines or canvases into a multi-tab web application, all CSS rules MUST be strictly scoped under the tab's container ID (`#tab-id #frame-id`).
   - Global selectors (`*`, `html`, `body`, un-prefixed tags/classes) are STRICTLY FORBIDDEN in sub-module stylesheets.
2. **`STD-PWA-DEV-001` (Localhost Service Worker Cache-Bypass Invariant)**:
   - Service Worker `fetch` handlers MUST check `self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1'` and bypass caching entirely during local development.
3. **`STD-MOD-SHADOW-001` (Sub-Engine Shadowing & Delegation Invariant)**:
   - Application shell files (`app.js`, `main.js`) MUST act exclusively as coordinators and MUST NOT retain duplicate fallback implementations of standalone feature modules.

---

## 5. Verification Evidence

- `npm run verify:deployment`: 100% Green across all 8 pre-flight verification layers.
- `npm run verify:governance-wiring:all`: Passed with 100% PACT compliance.
- `npm test`: Smoke test passed with 100% healthy asset checks.
