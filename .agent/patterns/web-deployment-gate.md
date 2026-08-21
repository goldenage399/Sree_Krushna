---
pattern: web-deployment-gate
activation_tier: reference
canonical_source: task-dashboard
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

---

﻿<!-- shared:std.agent.web-deployment-gate:start -->
# Pattern: Web Deployment Gate & UX Resilience Protocol

**ID:** `PAT-DEPLOY-GATE-001`  
**Scope:** Universal (All Web SPA & Dashboard Repositories)  
**Classification:** Pre-Flight Release Gate / Architectural Invariant  
**Ecosystem Canonical Source:** `Task-Dashboard/.agent/patterns/web-deployment-gate.md`

---

## 1. Context & Problem Statement
When web single-page applications are deployed without a formal pre-flight gate, teams repeatedly ship applications with "first-load defects":
- Navigation resets to the default home view on every page refresh, breaking user workflow.
- A blank black/white flash occurs during asynchronous authentication initialization (FOUC).
- Unhandled routes return unbranded generic host error pages.
- Missing HTTP security headers expose applications to clickjacking and MIME attacks.
- Static Service Worker cache keys cause clients to run stale assets indefinitely.
- Deletions in client-side collections cause primary key collisions on subsequent additions.

---

## 2. The 9 Core Invariants

Any repository exposing a web UI MUST satisfy the following 9 invariants before production release:

1. **`INV-DEPLOY-01` (Auth Token Persistence):** Authentication session tokens MUST persist in browser storage (`IndexedDB`), restoring user state across reloads without re-prompting credentials.
2. **`INV-DEPLOY-02` (UI Navigation Continuity):** Active tab and view state MUST persist across reloads via `sessionStorage` and synchronize with URL hash deep-links (`#tab-name`).
3. **`INV-DEPLOY-03` (Zero Black Flash / Skeleton):** An inline or pre-auth visual skeleton with branded indicators MUST render immediately until authentication and data hydration complete.
4. **`INV-DEPLOY-04` (Branded Error Boundary):** The hosting platform MUST serve a custom branded `404.html` containing an explicit recovery CTA back to the application root.
5. **`INV-DEPLOY-05` (PWA Cache Bumping):** Service worker cache names MUST contain an explicit version identifier (`const CACHE_NAME = 'app-vX.Y.Z'`) bumped on structural releases to evict stale shells.
6. **`INV-DEPLOY-06` (Security Headers):** Hosting configuration MUST return `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.
7. **`INV-DEPLOY-07` (Mobile Gate Protocol 19):** Layouts MUST validate cleanly down to 300px/320px viewports with zero horizontal overflow and $\ge 44 \times 44\text{px}$ touch targets.
8. **`INV-DEPLOY-08` (Monotonic Primary Keys):** Client-side entity generation MUST derive IDs monotonically (`Math.max(...numericIds) + 1`) to eliminate reuse after deletions.
9. **`INV-DEPLOY-09` (Asset Mirroring):** Root source documents (`index.html`) MUST match distribution artifacts (`public/index.html`) in exact byte size before triggering deployment commands.

---

## 3. Automated Remediation Playbook

| Symptom | Root Cause | Standard Fix |
|---|---|---|
| Active tab lost on refresh | `switchTab()` only toggles DOM classes | Store active tab in `sessionStorage.setItem('active_tab', tabId)` and call `hydrateActiveTab()` on init. |
| Black screen during auth | App container hidden while `onAuthStateChanged` is pending | Inject `#authLoadingSkeleton` in HTML; dismiss with opacity fade in `onAuthStateChanged`. |
| Unbranded 404 on bad route | Missing `public/404.html` | Create `public/404.html` and add `"cleanUrls": true` in `firebase.json`. |
| Clickjacking vulnerability | Missing HTTP response headers | Add `X-Frame-Options: SAMEORIGIN` in `firebase.json` `headers` array. |
| PWA user sees old code | Stale service worker cache | Bump `CACHE_NAME` in `sw.js` and serve `sw.js` with `Cache-Control: no-cache`. |

---

## 4. Verification Check
A deployment is verified compliant when all 9 invariants pass the `web-deployment-gate` pre-flight diagnostic script with 100% green status.
<!-- shared:std.agent.web-deployment-gate:end -->
