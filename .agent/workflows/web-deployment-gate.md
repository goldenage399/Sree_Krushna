---
description: Universal pre-flight deployment checklist, UX resilience audit, and deployment execution protocol for web SPAs.
---

# Web Deployment Gate Workflow (`/web-deployment-gate`)

> **Ecosystem Standard:** `SPEC-SAP-DEPLOY-GATE-001` / `P-VERIFY-GATE-002`  
> **Source-of-Truth Hub:** `Task-Dashboard` (`d:\GitHub_Repo\Task-Dashboard`)  
> **Governing Pattern:** [Web Deployment Gate Pattern](file:///d:/GitHub_Repo/Sree_Krushna/.agent/patterns/web-deployment-gate.md)

---

## Step 1 — Run the Automated 6-Layer Pre-Flight Gate

Before running any deploy command, execute the automated programmatic gate:

```bash
npm run verify:deployment
```

This enforces:
1. **Layer 1:** Runtime AST parse (Classic script `new Function(code)` & ES Module syntax check).
2. **Layer 2:** Call-graph contract (100% inline HTML event handlers bound to `window`).
3. **Layer 3:** DOM ID reference integrity (100% `document.getElementById` queries exist in HTML).
4. **Layer 4:** PWA Service Worker Shell cache assets exist on disk.
5. **Layer 5:** Root and public distribution files are in exact byte sync.
6. **Layer 6:** Security headers and branded `404.html` verified.

If any check returns `FAIL`, deployment is blocked.

---

## Step 2 — Run the Forensic AST Decomposition Audit (If Refactoring)

If this session involved refactoring, decomposing, or moving code between files:

```bash
npm run audit:decomposition
```

Confirms zero dropped functions, CSS selectors, or state objects compared to pre-refactor git history.

---

## Step 3 — Verify Mobile 300px/320px Viewport Gate (`M-GATE-01`)

Verify that the application layout satisfies Protocol 19:
1. **Zero Horizontal Overflow:** Body element has `overflow-x: hidden` and all full-width cards fit inside a 300px canvas.
2. **Touch Targets:** Buttons, checkboxes, and tabs are $\ge 44 \times 44\text{px}$.
3. **Table Containment:** Tables are wrapped in `.table-responsive-wrapper`.

---

## Step 4 — Service Worker Cache Version Bump & Localhost Bypass
> See `.agent/patterns/localhost-sw-cache-bypass-gate.md` for the development cache-bypass standard.

If this deployment contains structural changes or bug fixes:
1. Open `public/sw.js`.
2. Increment the `CACHE_NAME` version string:
   ```javascript
   const CACHE_NAME = 'app-name-vX.Y.Z'; // Bump minor/patch
   ```

---

## Step 5 — Production Release Execution

Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

Confirm CLI output: `+  Deploy complete!` and `release complete`.

---

## Step 6 — Post-Deployment Verification Gate (Smoke Test)

1. Open the live URL in an incognito window.
2. Verify that the **Auth Loading Skeleton** appears smoothly before login.
3. Sign in and navigate to a non-default tab. Press **Ctrl+Shift+R** (hard reload).
4. Verify that the **active tab reloads directly** without resetting to the dashboard.
5. Visit `/invalid-test-url` and verify that the **branded 404 page** is returned.
