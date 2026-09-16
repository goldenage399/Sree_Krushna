# INC-090 — SPA Pathname Drift in Stakeholder Share Links & Unauthenticated Portal Bypass

**Incident ID**: `INC-090`  
**Date**: `2026-09-16`  
**Severity**: High (Critical UX Barrier & Family Onboarding Failure)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Affected Component**: `ui_primitives/scripts/primitives_core.js`, `shopping_src/components/body.html`, `decision_registry_src/components/body.html`

---

## 1. Executive Summary & Symptom

During multi-surface rollout of the collaborative shopping registry and event decision engine, the groom and wedding council sought to distribute frictionless voting and styling review links directly to parents, extended elders, and sisters via WhatsApp:
- Parents & Extended Family: `https://sree-krushna-forever.web.app/shopping-registry.html?mode=family`
- Sisters' Styling Review: `https://sree-krushna-forever.web.app/shopping-registry.html?mode=sisters`

However, when copying share links from within the main Marriage OS Single-Page Application (SPA) dashboard (`#tab-shopping` or `#tab-decision-registry`), the generated URLs were corrupted:
- **Generated Link**: `https://sree-krushna-forever.web.app/?mode=family`
- **User Impact**: Non-technical elders, parents, and extended relatives clicking the WhatsApp link landed on the root SPA URL (`/`), encountering a Google Authentication login wall and an empty dashboard state rather than the frictionless, unauthenticated family survey studio.

---

## 2. 9-Step Diagnostic Engine & Root Cause Analysis

### Step 1: Symptom Definition & User Impact
- **Symptom**: Copy link actions inside SPA tabs generated root URLs (`/?mode=family`) instead of dedicated portal URLs (`/shopping-registry.html?mode=family`).
- **Severity**: High. Blocked non-authenticated family stakeholders from participating in saree/trousseau voting and decor consensus.

### Step 2: Code Surface Trace & Execution Flow
- In `shopping_src/components/body.html` and initial prototype handlers:
  ```javascript
  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}?mode=family`;
  ```
- In standalone portal (`/shopping-registry.html`):
  `window.location.pathname === "/shopping-registry.html"` $\to$ Valid URL generated.
- In embedded SPA tab (`#tab-shopping` inside `https://sree-krushna-forever.web.app/`):
  `window.location.pathname === "/"` (or `/index.html`) $\to$ Broken URL generated.

### Step 3: Root Cause Isolation (The "5 Whys")
1. *Why did the share link omit `/shopping-registry.html`?*  
   Because it relied on `window.location.pathname` to discover its own URL.
2. *Why was `window.location.pathname` equal to `/`?*  
   Because the shopping component was dynamically fetched as a fragment and injected into the main SPA shell.
3. *Why did the component assume it was running at its standalone URL?*  
   Because the component was originally developed and tested as a standalone HTML page (`shopping-registry.html`) prior to dual-surface embedding.
4. *Why did unit and browser tests not catch this?*  
   Automated testing (`test:shopping`, `test:decision-registry`) verified the standalone HTML files in isolation, creating a **Context Masking Blindspot**.
5. *What is the systemic root cause?*  
   **SPA Pathname Drift**: Embedded components in an SPA shell cannot rely on `window.location.pathname` to construct external deep links meant for standalone satellite portals.

### Step 4: Escape Analysis
- Pre-flight test suites validated DOM existence, byte parity, and responsive layouts.
- Neither test suite exercised the copy-to-clipboard action within the mounted SPA tab context with an assertion against the target standalone portal filename.

### Step 5: Systemic Weaknesses
1. Lack of a centralized canonical URL generator for cross-surface deep links.
2. No explicit test assertion verifying that deep link generation within an embedded fragment produces a pointer to the standalone portal rather than the host shell.
3. Lack of a global, discoverable executive share station, forcing users to navigate to specific tabs or dig through chat logs to find links.

### Step 6: Fix Formulation & Implementation
1. **Canonical URL Builder**: Created `SKPrimitives.getStakeholderUrl(portalFile, params)` in `ui_primitives/scripts/primitives_core.js`:
   ```javascript
   getStakeholderUrl: function(portalFile, params = {}) {
     const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
     const cleanFile = (portalFile || 'shopping-registry.html').replace(/^\/+/, '');
     const url = new URL(cleanFile, origin.endsWith('/') ? origin : origin + '/');
     Object.entries(params).forEach(([k, v]) => {
       if (v !== undefined && v !== null && v !== '') {
         url.searchParams.set(k, v);
       }
     });
     return url.toString();
   }
   ```
2. **Universal Robust Clipboard Dispatch**: Deployed `SKPrimitives.copyStakeholderShareLink(portalFile, params, label)` with fallback support (`navigator.clipboard` $\to$ legacy `textarea` $\to$ prompt dialog) and visual toast confirmation.
3. **In-Tab Stakeholder Quick-Share Bars**: Added persistent `.shop-executive-share-bar` and `.dr-executive-share-bar` above the catalog switcher and decor flow with 1-click WhatsApp copy chips and standalone portal pop-outs.
4. **Global Executive Quick-Share Station**: Built `#openExecutiveShareBtn` and `#executiveShareModal` into `index.html` and `public/index.html` featuring all 10 curated stakeholder links with pre-formatted WhatsApp text and direct WhatsApp Web buttons.

### Step 7: Pre-Flight Gate Hardening
- Hardened `scripts/verify-web-deployment-gate.cjs` Layer 10 to assert:
  - Presence of `#openExecutiveShareBtn` and `#executiveShareModal` in SPA root.
  - Presence of `.shop-executive-share-bar` in shopping distributions.
  - Presence of `.dr-executive-share-bar` in decision registry distributions.
  - Verification that `SKPrimitives.getStakeholderUrl` is defined and utilized.

### Step 8: Production Smoke Verification
- Verified live deployment at `https://sree-krushna-forever.web.app/`:
  - Clicking header **[🔗 Share Links]** opens modal with 10 deep links.
  - Copying links from modal yields canonical `shopping-registry.html` and `decision-registry.html` URLs.
  - In-tab copy chips copy verified canonical URLs without `/` drift.

### Step 9: Knowledge Capture & Pattern Crystallization
- Codified universal pattern `P-QUICK-SHARE-001` in `.agent/patterns/canonical-stakeholder-deep-link-station.md`.
- Ratified Architecture & UI Council Decision `AC-DEC-2026-027` / `UI-DEC-2026-023`.

---

## 3. Verification Matrix

| Verification Check | Target | Result | Standard |
| :--- | :--- | :--- | :--- |
| **URL Canonicalization** | `SKPrimitives.getStakeholderUrl()` | **PASS** | Always targets explicit portal file |
| **Clipboard Fallback** | `SKPrimitives.copyStakeholderShareLink()` | **PASS** | 3-tier fallback with toast |
| **In-Tab Affordances** | Shopping & Decision Registry | **PASS** | `.shop-executive-share-bar`, `.dr-executive-share-bar` |
| **Global Station** | SPA Shell Header & Modal | **PASS** | 10 verified stakeholder deep links |
| **Automated Gate** | `npm run verify:deployment` | **PASS** | Layer 10 (14 affordances & modals verified) |
| **Live Smoke Test** | `https://sree-krushna-forever.web.app` | **PASS** | HTTP 200 OK across all 5 surfaces |
