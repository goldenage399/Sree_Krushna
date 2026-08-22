---
pattern: web-deployment-gate
activation_tier: reference
canonical_source: task-dashboard
status: APPROVED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

---

<!-- shared:std.agent.web-deployment-gate:start -->
# Pattern: Web Deployment Gate & UX Resilience Protocol

**ID:** `PAT-DEPLOY-GATE-001` / `P-VERIFY-GATE-002`  
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
- Superficially passing regex string checks allow fatal top-level `await` or syntax errors into production (Proxy-Signal Anti-Pattern).
- Refactoring large files results in silently dropped functions, CSS rules, or DOM ID hooks.

---

## 2. The 13 Core Invariants

Any repository exposing a web UI MUST satisfy the following 13 invariants before production release:

1. **`INV-DEPLOY-01` (Auth Token Persistence):** Authentication session tokens MUST persist in browser storage (`IndexedDB`), restoring user state across reloads without re-prompting credentials.
2. **`INV-DEPLOY-02` (UI Navigation Continuity):** Active tab and view state MUST persist across reloads via `sessionStorage` and synchronize with URL hash deep-links (`#tab-name`).
3. **`INV-DEPLOY-03` (Zero Black Flash / Skeleton):** An inline or pre-auth visual skeleton with branded indicators MUST render immediately until authentication and data hydration complete.
4. **`INV-DEPLOY-04` (Branded Error Boundary):** The hosting platform MUST serve a custom branded `404.html` containing an explicit recovery CTA back to the application root.
5. **`INV-DEPLOY-05` (PWA Cache Bumping):** Service worker cache names MUST contain an explicit version identifier (`const CACHE_NAME = 'app-vX.Y.Z'`) bumped on structural releases to evict stale shells.
6. **`INV-DEPLOY-06` (Security Headers):** Hosting configuration MUST return `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.
7. **`INV-DEPLOY-07` (Mobile Gate Protocol 19):** Layouts MUST validate cleanly down to 300px/320px viewports with zero horizontal overflow and $\ge 44 \times 44\text{px}$ touch targets.
8. **`INV-DEPLOY-08` (Monotonic Primary Keys):** Client-side entity generation MUST derive IDs monotonically (`Math.max(...numericIds) + 1`) to eliminate reuse after deletions.
9. **`INV-DEPLOY-09` (Asset Mirroring):** Root source documents (`index.html`) MUST match distribution artifacts (`public/index.html`) in exact byte size before triggering deployment commands.
10. **`INV-DEPLOY-10` (Runtime AST Syntax & Zero-Proxy Gate):** All JavaScript files MUST parse without syntax errors in their declared execution context (Classic script via `new Function(code)` / ES Module via V8 AST check). Heuristic regex text matching is strictly forbidden.
11. **`INV-DEPLOY-11` (Call-Graph Contract):** 100% of HTML inline event handlers (`onclick`, `oninput`, `onsubmit`) MUST statically resolve to declared functions attached to `window` scope.
12. **`INV-DEPLOY-12` (DOM ID Reference Integrity):** 100% of `document.getElementById('xyz')` queries in JavaScript MUST resolve to existing DOM elements in the entry HTML markup.
13. **`INV-DEPLOY-13` (Zero-Regression Decomposition Audit):** Refactoring or decomposing files MUST be verified via AST diffing against pre-refactor git history (`scripts/forensic-audit.cjs`), asserting zero lost function declarations, CSS selector rules, or state objects.

---

## 3. Automated Remediation Playbook

| Symptom | Root Cause | Standard Fix |
|---|---|---|
| Active tab lost on refresh | `switchTab()` only toggles DOM classes | Store active tab in `sessionStorage.setItem('active_tab', tabId)` and call `hydrateActiveTab()` on init. |
| Black screen during auth | App container hidden while `onAuthStateChanged` is pending | Inject `#authLoadingSkeleton` in HTML; dismiss with opacity fade in `onAuthStateChanged`. |
| Unbranded 404 on bad route | Missing `public/404.html` | Create `public/404.html` and add `"cleanUrls": true` in `firebase.json`. |
| Clickjacking vulnerability | Missing HTTP response headers | Add `X-Frame-Options: SAMEORIGIN` in `firebase.json` `headers` array. |
| PWA user sees old code | Stale service worker cache | Bump `CACHE_NAME` in `sw.js` and serve `sw.js` with `Cache-Control: no-cache`. |
| Uncaught SyntaxError: await | Top-level `await` inside classic `<script>` | Wrap dynamic import in `(async function init() { ... })()`. |
| `ReferenceError: fn not defined` | Inline HTML handler not bound to `window` | Bind handler explicitly: `window.fn = fn;`. |
| Blank countdown / ticker | Using `innerText` on `display: none` container | Use `element.textContent` for raw node value updates. |

---

## 4. Verification Commands
A deployment is verified compliant when all 13 invariants pass the pre-flight gate with 100% green status:
- `npm run verify:deployment` (`scripts/verify-deployment.cjs`)
- `npm run audit:decomposition` (`scripts/forensic-audit.cjs`)
<!-- shared:std.agent.web-deployment-gate:end -->
