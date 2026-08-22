---
name: web-deployment-gate
description: Universal pre-flight deployment gate, UX resilience auditor, and scaffolding standard for web SPAs. Enforces the 9-domain pre-flight matrix (Session/Tab persistence, Auth loading skeleton, Branded 404, HTTP Security Headers, Service Worker cache invalidation, Mobile-First 300px gate, and Monotonic state mutations).
triggers: ["deploy web", "pre-flight check", "new web app", "launch site", "verify deployment", "web deployment checklist", "deploy gate", "web audit"]
repo: [task-dashboard, sree-krushna, bms, capsicum, pio, ug-farmhouse, qsr]
category: deployment
---

# Universal Web Deployment Gate Skill (`web-deployment-gate`)

> **Ecosystem Standard:** `SPEC-SAP-DEPLOY-GATE-001`  
> **Source-of-Truth Hub:** `Task-Dashboard` (`d:\GitHub_Repo\Task-Dashboard`)  
> **Applicability:** All web SPAs, executive dashboards, and mobile portals in the ecosystem.

---

## 1. When to Trigger This Skill
- **Before ANY Deployment:** Whenever a user asks to "Deploy", "Push to hosting", "Release site", or run `firebase deploy --only hosting` / `npm run deploy`.
- **When Creating a New Web Repo / App:** Whenever scaffolding a new index page, standalone portal, or web client.
- **When Investigating UX / Session Gaps:** When users report black flashes, lost tabs on reload, broken 404s, or stale PWA caches.

---

## 2. The Mandatory 9-Domain Pre-Flight Matrix

Never declare a web deployment ready or complete without verifying each of the 9 domains:

| # | Domain | Architectural Invariant | Mandatory Verification Routine |
|---|---|---|---|
| **1** | **Identity & Session** | Token persistence | Verify Firebase Auth uses `IndexedDB` (`browserLocalPersistence`) and `onAuthStateChanged` restores user seamlessly on refresh. |
| **2** | **UI State Continuity** | Active tab & deep-link memory | Verify `switchTab()` writes to `sessionStorage` and syncs `#tab-xxx` in URL hash. Verify `hydrateActiveTab()` restores tab on reload. |
| **3** | **Perceived Performance** | Zero "black flash" / FOUC | Verify `#authLoadingSkeleton` renders instantly with pulsing crest/spinner and fades out smoothly when auth evaluates. |
| **4** | **Routing & Fallbacks** | Branded 404 error page | Verify `public/404.html` exists, matches the design system tokens, and includes a prominent return CTA. |
| **5** | **Offline & PWA Lifecycle** | Cache invalidation on release | Verify `sw.js` has a bumped version constant (`const CACHE_NAME = 'app-name-vX.Y.Z'`) and `firebase.json` serves `sw.js` with `no-cache`. |
| **6** | **Security Hardening** | Enterprise HTTP headers | Verify `firebase.json` headers block enforces `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`. |
| **7** | **Mobile Ergonomics** | Protocol 19 (`M-GATE-01`) | Verify 300px/320px viewport emulation has zero horizontal scroll (`overflow-x: hidden`), and all touch targets are $\ge 44 \times 44\text{px}$. |
| **8** | **Data Integrity** | Monotonic ID generation | Verify dynamic task/item creators use `Math.max(...ids) + 1` instead of fragile `.length + 1` to prevent ID reuse on deletions. |
| **9** | **Observability & RUM** | Core Web Vitals | Verify Real User Monitoring script is attached to `LCP`, `INP`, and `CLS` events. |

---

## 3. Pre-Flight Verification Script (Automated 6-Layer Programmatic Gate)

Always run the programmatic AST & Call-Graph gate prior to deployment (`npm run verify:deployment` / `node scripts/verify-deployment.cjs`).

**Mandatory 6-Layer Checks:**
1. **Layer 1: JavaScript Runtime Parse & Syntax:** Evaluates all classic script files with `new Function(code)` to guarantee NO top-level `await` or parse errors.
2. **Layer 2: HTML Inline Event Handlers <-> JS Function Contract:** Scans `index.html` for all `onclick`, `oninput`, `onsubmit` attributes and verifies that 100% of referenced functions exist in `app.js` and are attached to `window`.
3. **Layer 3: DOM ID Integrity:** Scans `app.js` for all `document.getElementById(...)` references and verifies that every element exists in `index.html`.
4. **Layer 4: PWA Service Worker Shell Integrity:** Confirms all files in `STATIC_SHELL` exist on disk in `public/`.
5. **Layer 5: Root <-> Public Distribution Synchronicity:** Guarantees byte-for-byte exact equality between root `index.html` and `public/index.html`.
6. **Layer 6: Security Headers & 404:** Asserts `public/404.html` exists and `firebase.json` enforces enterprise headers.

```bash
# Execute the Automated Pre-Flight Gate:
npm run verify:deployment
```

---

## 4. Standard Deploy Sequence

Always execute deployments following the canonical 3-step promotion pipeline:

```powershell
# Step 1: Sync root source to hosting public directory
Copy-Item index.html public/index.html -Force

# Step 2: Run 6-Layer Programmatic Pre-Flight Gate
npm run verify:deployment

# Step 3: Deploy to Firebase Hosting
firebase deploy --only hosting
```
