---
description: >
  Firebase backend deployment workflow for Task-Dashboard (pi-ops project).
  Covers Cloud Functions (Node.js 20 / 2nd Gen), Firestore Rules, and React Hosting.
  Change-aware: always inspect git diff first and deploy ONLY what changed.
  Full 15-function batch deploy is a last resort for major releases only.
---

# Firebase Deploy Workflow

> [!IMPORTANT]
> This workflow is **Firebase-specific** (Cloud Functions + Firestore Rules).
> For GAS/Apps Script backend, see `deploy-backend.md` instead.
> The project is `pi-ops` hosted at `pi-ops.web.app`.

---

## 🔑 Key Facts (Read First)

| Item | Value |
|---|---|
| Firebase project | `pi-ops` |
| Functions runtime | Node.js 20 / 2nd Gen (Cloud Run) |
| Functions source | `functions/` directory |
| Functions entry | `functions/index.js` |
| Firestore rules | `firestore.rules` (repo root) |
| Firestore indexes | `firestore.indexes.json` (repo root) |
| Shell environment | **PowerShell** — comma lists MUST be quoted |
| ⚠️ Node 20 EOL | 2026-10-30 — upgrade to Node 22 before then |

### Registered Cloud Functions (15 total)

| Function Name | Type | Purpose |
|---|---|---|
| `syncProjectLevelsOnAssignment` | Firestore trigger | Sync `projectLevels` map on profile assignment |
| `maintainProfileUsersIndex` | Firestore trigger | Maintain reverse `profile→users` index |
| `updateLevelsOnProfileChange` | Firestore trigger | Propagate profile level changes to users |
| `assignUserToProfile` | Callable | Assign user to a profile (+ maintain `activeProfileIds`) |
| `removeUserAssignment` | Callable | Soft-delete user assignment (+ maintain `activeProfileIds`) |
| `scheduledConsistencyCheck` | Scheduled (6h) | Repair eventual consistency issues |
| `syncCustomClaimsOnLevelChange` | Firestore trigger | Re-issue custom claims when level changes |
| `refreshCustomClaims` | Callable | Force custom claims refresh |
| `getCustomClaims` | Callable | Return caller's custom claims |
| `onTaskCreated` | Firestore trigger | Task creation side effects |
| `onTaskUpdated` | Firestore trigger | Task update side effects |
| `createManualBackup` | Callable | Trigger manual Firestore backup |
| `syncUserLevelOnProfileChange` | Firestore trigger | Sync user level when profile assigned |
| `syncUserLevelOnProfileLvlChange` | Firestore trigger | Sync user level when profile `lvl` changes |
| `cleanupProfileMappingOnUserDeletion` | Auth trigger | Clean up mappings on user deletion |

---

## Pre-Deployment Checklist (MANDATORY)

Run these steps before **every** deploy. Do not skip.

### Step 0 — Confirm active Firebase project

```powershell
firebase use
```

Expected output: `pi-ops`

> [!CAUTION]
> If the output is anything other than `pi-ops`, **STOP**. Run `firebase use pi-ops` to switch, then re-verify before proceeding.

### Step 1 — Install functions dependencies

```powershell
cd functions
npm install
cd ..
```

> [!WARNING]
> **Always run `npm install` in `functions/` before deploying**, even if you did not change `package.json`.
> The `node_modules/` directory is gitignored. A fresh clone or a new shell will always be missing it.
> Skipping this step causes `Error: Cannot find module 'firebase-functions/v2/...'` during deploy.

### Step 2 — Run preflight

```powershell
npm run preflight
```

Preflight must exit cleanly (warnings about P38 memory size are acceptable). If it exits non-zero, investigate before deploying.

### Step 3 — Check Firestore rules compile

```powershell
firebase firestore:rules --check
```

Or let the deploy pipeline validate (it runs compilation automatically before uploading). Any `[E]` error in the output is a hard blocker. `[W]` warnings are acceptable.

---

## Deployment Commands

### ⚡ Step 3 — Smart Change Detection (ALWAYS DO THIS FIRST)

> [!IMPORTANT]
> **Never deploy all 15 functions by default.** Always inspect git diff first and build a targeted `--only` list from what actually changed.

**Run this to see what changed since the last commit:**

```powershell
# See all changed files (staged + unstaged + untracked in functions/)
git diff --name-only HEAD
git status --short
```

**Then use the Function→Source File Map below to determine which functions to include.**

#### Function → Source File Map

Each function is defined in `functions/index.js`. Changes to the following files affect which functions must be redeployed:

| Changed File | Deploy Target(s) |
|---|---|
| `firestore.rules` | `firestore:rules` only — no functions needed |
| `firestore.indexes.json` | `firestore:indexes` only |
| `functions/index.js` (entire file) | All functions that export changed handlers |
| Any `functions/` helper/service file | All functions that `require()` that file — inspect imports |
| `src/` (React frontend only) | **No Firebase deploy needed** — frontend-only change |
| `package.json` / `package-lock.json` in `functions/` | Re-run `npm install`, then redeploy **all** functions |

**Specific function-to-handler keyword map** (grep `functions/index.js` for the export name):

| Function Name | Export keyword to grep |
|---|---|
| `assignUserToProfile` | `assignUserToProfile` |
| `removeUserAssignment` | `removeUserAssignment` |
| `refreshCustomClaims` | `refreshCustomClaims` |
| `getCustomClaims` | `getCustomClaims` |
| `createManualBackup` | `createManualBackup` |
| `syncProjectLevelsOnAssignment` | `syncProjectLevelsOnAssignment` |
| `maintainProfileUsersIndex` | `maintainProfileUsersIndex` |
| `updateLevelsOnProfileChange` | `updateLevelsOnProfileChange` |
| `syncCustomClaimsOnLevelChange` | `syncCustomClaimsOnLevelChange` |
| `onTaskCreated` | `onTaskCreated` |
| `onTaskUpdated` | `onTaskUpdated` |
| `syncUserLevelOnProfileChange` | `syncUserLevelOnProfileChange` |
| `syncUserLevelOnProfileLvlChange` | `syncUserLevelOnProfileLvlChange` |
| `cleanupProfileMappingOnUserDeletion` | `cleanupProfileMappingOnUserDeletion` |
| `scheduledConsistencyCheck` | `scheduledConsistencyCheck` |

#### Decision Tree

```
What changed?
├── Only firestore.rules          → firebase deploy --only "firestore:rules"
├── Only firestore.indexes.json   → firebase deploy --only "firestore:indexes"
├── Only src/ (React)             → See **Hosting Deploy** section below (build first)
├── 1-2 functions in index.js     → firebase deploy --only "functions:<name1>,functions:<name2>"
├── A shared helper in functions/ → Deploy all functions that import it (inspect requires)
└── functions/package.json        → npm install in functions/, then deploy ALL functions (batched)
```

### Deploy only Firestore rules

```powershell
firebase deploy --only "firestore:rules"
```

Fastest option when only `firestore.rules` changed. Rules upload in ~10 seconds.

### Deploy only Firestore indexes

```powershell
firebase deploy --only "firestore:indexes"
```

### Deploy a single function (targeted — most common for routine work)

```powershell
firebase deploy --only "functions:assignUserToProfile"
```

### Deploy a subset of functions

```powershell
firebase deploy --only "functions:assignUserToProfile,functions:removeUserAssignment"
```

> [!TIP]
> Deploy ≤ 5 functions per command to stay quota-safe. See **Quota Exhaustion Recovery** below.

---

## 🖥️ Hosting Deploy (React Frontend)

> [!IMPORTANT]
> **Hosting deploys are completely independent from function/rules deploys.**
> Any change under `src/`, `public/`, `index.html`, or `vite.config.js` requires a hosting deploy.
> Functions and Firestore Rules changes do **not** require a rebuild.

### Step 1 — Detect what changed in src/

```powershell
git diff --name-only HEAD
git status --short
```

#### src/ Change → Hosting Deploy Map

| Changed File/Directory | Action |
|---|---|
| `src/pages/*.jsx` | Always requires hosting deploy |
| `src/components/**` | Always requires hosting deploy |
| `src/hooks/**` | Always requires hosting deploy |
| `src/styles/**` | Always requires hosting deploy |
| `src/contexts/**` | Always requires hosting deploy |
| `src/services/**` (frontend service) | Always requires hosting deploy |
| `public/` or `index.html` | Always requires hosting deploy |
| `vite.config.js` | Always requires hosting deploy |
| `functions/` only | ❌ No hosting deploy needed — backend only |
| `firestore.rules` only | ❌ No hosting deploy needed — rules only |
| `src/` + `functions/` | Deploy both: build hosting, then deploy functions separately |

### Step 2 — Build the production bundle

```powershell
npm run build
```

> [!WARNING]
> **The build must complete cleanly before deploying.** Check the output for errors:
> - `✓ built in X.XXs` — build succeeded, safe to deploy
> - `[vite:reporter] ERROR ...` — build failed, **STOP**, fix the error before deploying
> - `(!) Some chunks are larger than 600 kB` — **warning only**, does not block deploy
> - `dynamically imported by X but also statically imported by Y` — **warning only**, does not block deploy

### Step 3 — Deploy to Firebase Hosting

```powershell
firebase deploy --only "hosting"
```

Expected output:
```
+  hosting[pi-ops-dashboard]: file upload complete
+  hosting[pi-ops-dashboard]: version finalized
+  hosting[pi-ops-dashboard]: release complete
+  Deploy complete!
Hosting URL: https://pi-ops-dashboard.web.app
```

### Step 4 — Verify in browser

1. **Hard-refresh** the live site (`Ctrl+Shift+R` / `Cmd+Shift+R`) to bust CDN cache.
2. Open: https://pi-ops-dashboard.web.app
3. Confirm the changed page/component renders correctly.
4. Check the browser DevTools console for any `404` or `chunk load failed` errors.

### Rollback a hosting deploy

> [!TIP]
> Firebase Hosting keeps a full version history. If a bad deploy goes live, you can roll back in under 30 seconds — no code changes needed.

1. Open: https://console.firebase.google.com/project/pi-ops/hosting
2. Click **Hosting** → select the `pi-ops-dashboard` site.
3. In the **Release History** table, find the last known-good release.
4. Click the **⋮** menu on that release → **Rollback**.
5. Confirm — the previous version is live immediately.

---

## Quota Exhaustion Recovery

> [!NOTE]
> **What this looks like**: Some functions succeed; others print `Quota exceeded for total allowable CPU per project per region.`
> This is a **transient GCP Cloud Run quota limit** — not a code error. The previous function containers have not yet released their CPU allocation.

**Recovery procedure:**

1. **Wait 2–3 minutes** for active Cloud Run containers to spin down and release quota.

2. **Identify failed functions** from the deploy output — they are listed at the bottom:
   ```
   Functions deploy had errors with the following functions:
       assignUserToProfile(us-central1)
       onTaskCreated(us-central1)
       ...
   ```

3. **Retry only the failed functions**, named explicitly:
   ```powershell
   firebase deploy --only "functions:assignUserToProfile,functions:onTaskCreated,functions:onTaskUpdated"
   ```

4. **Verify all succeeded** — every function should show `+ functions[name] Successful update operation.`

> [!TIP]
> **Prevention**: When deploying all 15 functions simultaneously, quota exhaustion is common on the `pi-ops` Spark/Blaze tier. Prefer targeted deploys when only specific functions changed. The `firestore:rules` target is never quota-limited — always deploy it first and separately if needed.

---

## Post-Deploy Verification

After every deploy, verify the following:

### 1. Check Firebase Console

Open: https://console.firebase.google.com/project/pi-ops/functions

Confirm all functions show green status and the correct deployment timestamp.

### 2. Verify Firestore Rules

Open: https://console.firebase.google.com/project/pi-ops/firestore/rules

Confirm the live rules match your committed `firestore.rules`.

### 3. Smoke-test callable functions

For callable functions (`assignUserToProfile`, `removeUserAssignment`, etc.), confirm the app can invoke them without `NOT_FOUND` or `UNAVAILABLE` errors after deploy.

---

## Failure Reference

| Error Message | Root Cause | Fix |
|---|---|---|
| `Cannot understand what targets to deploy/serve` | PowerShell split the comma list into separate args | Wrap `--only` value in double quotes |
| `Cannot find module 'firebase-functions/v2/...'` | `functions/node_modules/` missing | `cd functions && npm install` |
| `Quota exceeded for total allowable CPU per project per region` | Too many Cloud Run revisions deploying simultaneously | Wait 2–3 min, retry only failed functions (see above) |
| `[E] ... compilation error` in rules output | Syntax/semantic error in `firestore.rules` | Fix the rule; `[W]` warnings do not block deploy |
| `Container Healthcheck failed` | Same as quota error — Cloud Run couldn't allocate CPU | Wait + targeted retry |
| `[vite:reporter] ERROR ...` during `npm run build` | Syntax error or bad import in `src/` | Fix the source error; build warnings are non-blocking |
| `chunk load failed` in browser after deploy | Browser cached old chunk hashes that no longer exist | Hard-refresh (`Ctrl+Shift+R`) or clear site data |

---

## Node.js Runtime Notice

> [!WARNING]
> **Node.js 20 is deprecated** as of 2026-04-30 and will be **decommissioned 2026-10-30**.
> After that date, deploys of functions running Node 20 will be blocked.
>
> To upgrade before the deadline:
> ```powershell
> # In functions/package.json, change:
> "engines": { "node": "20" }
> # to:
> "engines": { "node": "22" }
> ```
> Then redeploy all functions. Test locally first with Node 22.

---

## Full Deploy Sequence (LAST RESORT — Major Releases Only)

> [!WARNING]
> **Do not run this sequence for routine deploys.** Use the Smart Change Detection step above instead.
> Reserve this sequence for: initial environment setup, Node runtime upgrades, or a verified change to every function's shared code.

The complete end-to-end deploy sequence for a clean environment or major release:

```powershell
# 1. Confirm project
firebase use
# Expected: pi-ops

# 2. Install dependencies
cd functions
npm install
cd ..

# 3. Run preflight
npm run preflight

# 4. Deploy rules first (fast, quota-free)
firebase deploy --only "firestore:rules"

# 5. Deploy functions in quota-safe batches (≤5 per command)
# Batch 1 — callable functions
firebase deploy --only "functions:assignUserToProfile,functions:removeUserAssignment,functions:refreshCustomClaims,functions:getCustomClaims,functions:createManualBackup"

# Batch 2 — Firestore triggers
firebase deploy --only "functions:syncProjectLevelsOnAssignment,functions:maintainProfileUsersIndex,functions:updateLevelsOnProfileChange,functions:syncCustomClaimsOnLevelChange,functions:onTaskCreated"

# Batch 3 — remaining triggers + scheduled
firebase deploy --only "functions:onTaskUpdated,functions:syncUserLevelOnProfileChange,functions:syncUserLevelOnProfileLvlChange,functions:cleanupProfileMappingOnUserDeletion,functions:scheduledConsistencyCheck"
```

---

## Related Workflows

- [`deploy-backend.md`](.agent/workflows/deploy-backend.md) — GAS/Apps Script deploy (clasp push, NOT firebase)
- [`backend-readiness.md`](.agent/workflows/backend-readiness.md) — Pre-deploy gate for functions/rules changes
- [`git-commit.md`](.agent/workflows/git-commit.md) — Commit changes before deploying

---

*Workflow derived from live sessions 2026-07-01 and 2026-07-10. Failure modes captured from actual deployments on `pi-ops` (quota exhaustion, PowerShell quoting, missing node_modules, hosting-only rebuild for src/ changes).*
