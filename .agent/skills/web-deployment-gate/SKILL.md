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

## 3. Pre-Flight Verification Script (Copy-Paste Diagnostic)

Run this diagnostic script in the target repository to mechanically audit the 9 domains:

```powershell
Write-Host "=== 🔍 RUNNING WEB DEPLOYMENT PRE-FLIGHT AUDIT ===" -ForegroundColor Cyan

# 1. Check 404.html
if (Test-Path "public/404.html") { Write-Host "✅ [1/7] public/404.html exists" -ForegroundColor Green }
else { Write-Host "❌ [1/7] MISSING public/404.html" -ForegroundColor Red }

# 2. Check Security Headers in firebase.json
$fb = Get-Content "firebase.json" -Raw
if ($fb -match "X-Frame-Options" -and $fb -match "nosniff") { Write-Host "✅ [2/7] Security headers configured in firebase.json" -ForegroundColor Green }
else { Write-Host "❌ [2/7] Missing security headers in firebase.json" -ForegroundColor Red }

# 3. Check Tab Persistence in index.html
$idx = Get-Content "index.html" -Raw
if ($idx -match "sessionStorage\.setItem\('.*active_tab" -and $idx -match "hydrateActiveTab") { Write-Host "✅ [3/7] Tab persistence & deep-link hash sync present in index.html" -ForegroundColor Green }
else { Write-Host "❌ [3/7] Missing tab persistence or hydration in index.html" -ForegroundColor Red }

# 4. Check Auth Loading Skeleton
if ($idx -match "id=""authLoadingSkeleton""" -or $idx -match "auth-skeleton-overlay") { Write-Host "✅ [4/7] Auth loading skeleton present in index.html" -ForegroundColor Green }
else { Write-Host "❌ [4/7] Missing auth loading skeleton (risk of black flash)" -ForegroundColor Red }

# 5. Check Monotonic ID Generation
if ($idx -match "Math\.max\(.*numericIds") { Write-Host "✅ [5/7] Monotonic ID generation active" -ForegroundColor Green }
else { Write-Host "⚠️ [5/7] Check task ID generation for length-based collisions" -ForegroundColor Yellow }

# 6. Check SW Cache Version
if (Test-Path "public/sw.js") {
  $sw = Get-Content "public/sw.js" -Raw
  $swVer = [regex]::Match($sw, "CACHE_NAME\s*=\s*'([^']+)'").Groups[1].Value
  Write-Host "✅ [6/7] Service Worker active with cache version: $swVer" -ForegroundColor Green
} else { Write-Host "⚠️ [6/7] No service worker found in public/sw.js" -ForegroundColor Yellow }

# 7. Check Sync between index.html and public/index.html
if ((Get-Item "index.html").Length -eq (Get-Item "public/index.html").Length) {
  Write-Host "✅ [7/7] root index.html and public/index.html are in exact sync" -ForegroundColor Green
} else {
  Write-Host "❌ [7/7] OUT OF SYNC: root index.html != public/index.html. Run: Copy-Item index.html public/index.html -Force" -ForegroundColor Red
}

Write-Host "=================================================" -ForegroundColor Cyan
```

---

## 4. Standard Deploy Sequence

Always execute deployments following the canonical two-step promotion pipeline:

```powershell
# Step 1: Sync root source to hosting public directory
Copy-Item index.html public/index.html -Force

# Step 2: Deploy to Firebase Hosting
firebase deploy --only hosting
```
