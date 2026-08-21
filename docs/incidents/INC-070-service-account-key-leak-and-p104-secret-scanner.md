# INC-070 — Plaintext Service Account Private Key Leak & P104 Secret Governance Gate

**Date**: 2026-08-08  
**Severity**: High / Critical (Production Service Account Key Exposure)  
**Status**: Resolved (Tracked files deleted, P104 scanner deployed, key rotated & verified via TASK-233)  
**Affected Systems**: Firebase Admin SDK, Git Repository, E2E Testing Pipeline  

---

## What Happened

1. During an architectural audit of the proposed E2E authentication plan, a live `pi-ops` production Firebase service account private key (`9cef9a024759d66258102c088af155929772bcf8`) was discovered hardcoded in plaintext inside `src/utils/testingBackdoor.js` (lines 18–30) and 6 additional root-level scripts (`deleteRequest.js`, `fixCommunication.js`, `inspectCommunication.js`, `inspectRequest.js`, `runCompleteTest.js`).
2. `.gitignore` rules correctly ignored `serviceAccountKey*.json`, but did not prevent credentials from being committed when pasted into executable `.js` files.
3. The leaked key was tracked in git history back to commit `fab96440` on GitHub.
4. Additionally, `src/scripts/runCompleteTest.js` (the sole consumer of `testingBackdoor.js`) executed automated substring deletions against live production `users`, `accessRequests`, and `requestCommunications` collections.

---

## Architectural Surface Mapping

Per `post-incident-governance` protocol, the incident affected the following 6 surfaces:

### 1. UI Surface
- **Impact**: N/A — No production UI component rendered the private key directly, though automated E2E tests using `__e2eSignIn` interact with auth dialogs.

### 2. Data Surface
- **Impact**: Full Admin SDK credentials allowed raw read/write access to production Firestore (`pi-ops`), bypassing all `firestore.rules`.

### 3. Reactive Surface
- **Impact**: N/A — React contexts (`AuthContext`, `UsersContext`) were unaffected at runtime, though Playwright required `storageState({ indexedDB: true })` to capture Firebase Auth token state.

### 4. Service Surface
- **Impact**: Firebase Admin SDK scripts (`src/utils/testingBackdoor.js`) bypassed client SDK authentication and security rules.

### 5. Module Surface
- **Impact**: Unsafe legacy scripts (`runCompleteTest.js`) performed hardcoded destructive substring deletions on production collections.

### 6. Governance Surface
- **Impact**: Prior secret scanning inspected build bundles (`dist/`) rather than git-tracked source files (`git ls-files`). Because `testingBackdoor.js` was a Node-only utility never bundled into client JS, bundle checks passed clean despite the severe leak in the repository.

---

## Root Cause Analysis

1. **Format-Specific Ignore Rules**: `.gitignore` targeted specific credential file extensions (`serviceAccountKey*.json`) rather than secret content patterns (`BEGIN PRIVATE KEY`).
2. **Bundle vs. Repository Inspection Gap**: Security verification assumed inspecting production build artifacts (`dist/`) was sufficient to catch leaked credentials.
3. **Legacy Script Debt**: Early development utilities (`testingBackdoor.js`) used inline service account objects for convenience rather than loading credentials from environment variables or external gitignored `.json` files.

---

## Resolution & Remediation Actions

1. **File Purge & Working-Tree Cleanup**:
   - Deleted 8 carrying files in the working tree (`src/utils/testingBackdoor.js`, `src/scripts/runCompleteTest.js`, `deleteRequest.js`, `fixCommunication.js`, `inspectCommunication.js`, `inspectRequest.js`, `serviceAccountKey.dev.json`).
   - Cleaned up 334 obsolete patch files inside `.merge-package/` (391MB) containing historical diffs of the key.
2. **P104 Secret Scanner Gate Deployed**:
   - Built `scripts/check-committed-secrets.cjs` (`npm run check:secrets` / **P104** / **PREFLIGHT R38**).
   - Scans all git-tracked files (`git ls-files`) for private key headers (`BEGIN PRIVATE KEY`, `BEGIN RSA PRIVATE KEY`, service account JSON fields) and exits non-zero if found.
   - Integrated into PREFLIGHT checks, standards catalog, skill router, and `CLAUDE.md`.
3. **Zero-Popup Playwright E2E Harness**:
   - Replaced `testingBackdoor.js` with `tests/playwright/auth.setup.js` using gitignored `serviceAccountKey.prod.json`.
   - Authenticates `e2e-test-user` via custom tokens and captures session state via Playwright `storageState({ indexedDB: true })` in `playwright.config.cjs`.
4. **Key Rotation Tracking**:
   - Logged **TASK-233** in `SYSTEM_CLARITY_SNAPSHOT.md` as a **🔴 TOP PRIORITY (P0)** open item to track web console key revocation in Firebase Console.

---

## Lessons Learned & Invariants Registered

1. **Scan Git-Tracked Source, Not Bundles (P104 Rule)**: Secret verification MUST scan `git ls-files`, never output build directories.
2. **Gitignore is Not a Security Gate**: A `.gitignore` rule does not stop credentials pasted into `.js`, `.ts`, `.json`, `.md`, or config files.
3. **Use IndexedDB Storage State for Firebase v9+**: Playwright auth persistence for Firebase Auth requires `storageState({ indexedDB: true })` because tokens live in `firebaseLocalStorageDb` in IndexedDB, leaving `localStorage` empty.

---

## Files Affected & Modified

| File | Change |
|------|--------|
| `src/utils/testingBackdoor.js` | **DELETED** (leaked key location) |
| `src/scripts/runCompleteTest.js` | **DELETED** (unsafe deletion script) |
| `deleteRequest.js`, `fixCommunication.js`, `inspectCommunication.js`, `inspectRequest.js` | **DELETED** (unreferenced scripts with leaked key) |
| `serviceAccountKey.dev.json` | **DELETED** (retired project credential) |
| `.merge-package/` | **DELETED** (334 patch files containing key text) |
| `scripts/check-committed-secrets.cjs` | **NEW** — P104 secret scanning gate |
| `tests/playwright/auth.setup.js` | **NEW** — Playwright E2E custom token auth setup |
| `scripts/e2e/seed-test-user.cjs` | **NEW** — Dedicated test user seeder |
| `playwright.config.cjs` | **UPDATED** — IndexedDB storageState configuration |
| `package.json` | **UPDATED** — Added `check:secrets`, `e2e:seed`, `e2e:level` scripts |
| `CLAUDE.md`, `GEMINI.md`, `PREFLIGHT.md` | **UPDATED** — P104 protocol registered |
