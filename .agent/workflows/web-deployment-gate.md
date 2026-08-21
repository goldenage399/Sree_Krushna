---
description: Universal pre-flight deployment checklist, UX resilience audit, and deployment execution protocol for web SPAs.
---

# Web Deployment Gate Workflow (`/web-deployment-gate`)

> **Ecosystem Standard:** `SPEC-SAP-DEPLOY-GATE-001`  
> **Source-of-Truth Hub:** `Task-Dashboard` (`d:\GitHub_Repo\Task-Dashboard`)  
> **Governing Pattern:** [Web Deployment Gate Pattern](file:///d:/GitHub_Repo/Sree_Krushna/.agent/patterns/web-deployment-gate.md)

---

## Step 1 — Run the 9-Domain Pre-Flight Audit

Before running any deploy command, execute the audit routine in the project root:

```powershell
# Execute the diagnostic check:
$fb = Get-Content "firebase.json" -Raw
$idx = Get-Content "index.html" -Raw

Write-Host "1. 404 Check: " (Test-Path "public/404.html")
Write-Host "2. Security Headers: " ($fb -match "X-Frame-Options" -and $fb -match "nosniff")
Write-Host "3. Tab Persistence: " ($idx -match "sree_krushna_active_tab" -or $idx -match "active_tab")
Write-Host "4. Skeleton Loader: " ($idx -match "authLoadingSkeleton" -or $idx -match "skeleton")
Write-Host "5. Task ID Monotonic: " ($idx -match "Math\.max")
```

If any check returns `False`, remediate the failure before proceeding.

---

## Step 2 — Verify Mobile 300px/320px Viewport Gate (`M-GATE-01`)

Verify that the application layout satisfies Protocol 19:
1. **Zero Horizontal Overflow:** Body element has `overflow-x: hidden` and all full-width cards fit inside a 300px canvas.
2. **Touch Targets:** Buttons, checkboxes, and tabs are $\ge 44 \times 44\text{px}$.
3. **Table Containment:** Tables are wrapped in `.table-responsive-wrapper`.

---

## Step 3 — Service Worker Cache Version Bump

If this deployment contains structural changes or bug fixes:
1. Open `public/sw.js`.
2. Increment the `CACHE_NAME` version string:
   ```javascript
   const CACHE_NAME = 'app-name-vX.Y.Z'; // Bump minor/patch
   ```

---

## Step 4 — Canonical Asset Synchronization

Sync the root development files into the public hosting distribution directory:

```powershell
Copy-Item index.html public/index.html -Force
```

Confirm that file size and hash match:
```powershell
(Get-Item index.html).Length -eq (Get-Item public/index.html).Length
```

---

## Step 5 — Production Release Execution

Deploy to Firebase Hosting:

```powershell
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
