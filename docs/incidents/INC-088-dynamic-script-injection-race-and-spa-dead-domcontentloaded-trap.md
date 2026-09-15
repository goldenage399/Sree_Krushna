# INC-088 — Dynamic Script Injection Race & SPA Zombie DOMContentLoaded Trap

**Incident ID**: `INC-088`  
**Date**: `2026-09-15`  
**Severity**: High (Host Navigation Runtime Crash & Interactive Overlay Stagnation)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Governing Standard**: `STD-UI-LIFECYCLE-001` / `DEC-003`  

---

## 1. Executive Summary & Root Cause

Following the deployment of the Master Decision Registry (`#tab-decision-registry`) and the Collaborative Comments Drawer (`#skCommentsDrawer`) into the host SPA, user testing revealed two severe failures:
1. **Dynamic Tab Mount Runtime Crash**:
   - Navigating to `http://localhost:5000/#tab-decision-registry` threw an uncaught error:
     `VM46:1072 Uncaught TypeError: Cannot read properties of undefined (reading 'icon') at renderMilestones`.
   - **Root Cause**: In `public/js/app.js`, `mountDecisionRegistryTab()` extracted `<script>` tags from `decision-registry-fragment.html` and appended them sequentially to the DOM. Under the W3C HTML5 specification, dynamically appended external script tags (`<script src="...">`) are fetched and executed **asynchronously**, while subsequent inline `<script>` tags execute **immediately**. The inline script `initDecisionRegistry()` executed before `js/decision-registry-data.js` finished downloading and parsing into `window.DECISION_REGISTRY_DATA`, leaving milestone data `undefined`.
2. **Zombie `DOMContentLoaded` Event Listener & Unclosable Drawer**:
   - Opening `#skCommentsDrawer` rendered the drawer permanently stuck open; clicking `#skBtnCloseComments`, clicking the backdrop `#skCommentsDrawerBackdrop`, or pressing `Escape` failed to dismiss it.
   - **Root Cause**: `ui_primitives/scripts/comments_engine.js` attached DOM event handlers inside `document.addEventListener('DOMContentLoaded', ...)`. In single-page applications, dynamic fragments are mounted long after initial page load when `document.readyState === 'complete'`. Because `DOMContentLoaded` is a one-shot event that never fires again, the event listeners were **silent zombies** and were never attached to the DOM elements.
3. **Closed-Over Scope & Missing Hydration Fallbacks**:
   - `decision_registry_src/scripts/controller.js` initialized state arrays using closed-over `const` variables evaluated at load time, without reactive re-hydration or defensive null guards.

---

## 2. Architectural Surface Mapping (6-Surface Audit)

| Surface | Status | Impact & Remediation |
|---|---|---|
| **UI Surface** | **AFFECTED** | Slide-over comments drawer (`#skCommentsDrawer`) was completely unclosable via click or keyboard. Remedied by enforcing the WAI-ARIA 1.2 3-Trigger Dismissibility Contract (Close Button, Backdrop Click, and Escape Key). |
| **Data Surface** | **AFFECTED** | `DECISION_REGISTRY_DATA` arrived asynchronously after script injection. Remedied by making data bindings reactive (`let`), adding defensive null checks in `renderMilestones()`, and exporting a refresh hook `renderDecisionRegistry()`. |
| **Reactive / State Surface** | **AFFECTED** | Host app script loader in `public/js/app.js` suffered from race conditions. Remedied by converting script injection loops in `mountDecisionRegistryTab()` and `mountCockpitTab()` to sequential Promise chains awaiting `newScript.onload`. |
| **Service / API Surface** | **AFFECTED** | UI primitive APIs lacked programmatic global hooks. Remedied by exporting `window.closeCommentsDrawer()` and `window.SKPrimitives.closeComments()` for idempotent programmatic dismissal. |
| **Module Surface** | **AFFECTED** | Rebuilt and synchronized SDCA artifacts (`decision-registry.html`, `decision-registry-fragment.html`, `cockpit-fragment.html`), asserting 100% byte parity between root and `public/`. |
| **Governance Surface** | **AFFECTED** | Ratified Architecture Council Decision `DEC-003` / `STD-UI-LIFECYCLE-001`, registered `.agent/patterns/dynamic-fragment-lifecycle-and-modal-dismiss-contract.md`, and created pre-flight gate `scripts/verify-ui-lifecycle.cjs` wired as Layer 10 of deployment verification. |

---

## 3. Timeline of Events

1. **16:00 IST**: User reported runtime crash upon clicking Decision Registry tab (`TypeError: Cannot read properties of undefined (reading 'icon') at renderMilestones`).
2. **16:05 IST**: User reported `#skCommentsDrawer` was completely stuck open and could not be closed.
3. **16:15 IST**: User prompted `/prompt-clarity` asking why triage took multiple turns, how the mistake was allowed to happen, and what validation gates from sister repo `Task-Dashboard` should be deployed.
4. **16:25 IST**: Traced root cause to W3C dynamic script injection async execution order and SPA `DOMContentLoaded` zombie listener trap.
5. **16:30 IST**: Formulated `DEC-003` / `AC-DEC-2026-024` ratifying `STD-UI-LIFECYCLE-001`.
6. **16:35 IST**: Implemented `scripts/verify-ui-lifecycle.cjs`. The new gate immediately caught and proactively fixed a dormant race condition in `mountCockpitTab()`.
7. **16:40 IST**: Wired Layer 10 into `scripts/verify-deployment.cjs` and registered Prime Invariant 5 in `GEMINI.md`. Verified all 8 test suites 100% green.

---

## 4. Invariant Classification & New Structural Standards

1. **`INV-LIFECYCLE-01` (Dynamic Script Sequencing Contract)**:
   - Dynamic SPA loaders MUST sequentially await `newScript.onload` for external scripts before appending or evaluating dependent inline scripts.
2. **`INV-LIFECYCLE-02` (Zombie DOMContentLoaded Prohibition)**:
   - UI primitives and modular tab controllers MUST NOT rely on naked `DOMContentLoaded` event listeners. They MUST guard with `document.readyState !== 'loading'` and re-bind defensively on activation.
3. **`INV-LIFECYCLE-03` (3-Trigger Modal/Drawer Dismissibility Standard — WAI-ARIA 1.2)**:
   - Every modal dialog, bottom sheet, or slide-over drawer MUST implement all three dismiss triggers:
     1. Explicit Close Button click.
     2. Backdrop overlay click.
     3. Global `Escape` keydown.
     4. Programmatic global hook on `window`.
4. **`INV-LIFECYCLE-04` (Headless Interactive State Machine Simulation)**:
   - Pre-flight test suites MUST simulate state transitions in a headless VM sandbox rather than relying on static regex string matching.

---

## 5. Verification Evidence & Hard Proof

1. `npm run verify:ui-lifecycle`: 4/4 Checks 100% Green.
2. `npm run verify:deployment`: Layers 1 through 10 100% Green.
3. `npm run test:decision-registry`: VM async execution and close vectors 100% Green.
4. `npm run test:cockpit`: Topic extraction and Rayagada slide deck 100% Green.
5. `npm test`: Local smoke server and asset probe 100% Green.
