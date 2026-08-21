---
pattern: playwright-indexeddb-auth-session-capture
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Playwright IndexedDB Auth Session Capture

**Category**: Process / Testing Methodology  
**Applies to**: Playwright E2E testing for Firebase Auth v9+ web applications  
**Origin**: 2026-08-08 (E2E Playwright Auth Harness Implementation)  
**Status**: VALIDATED (Verified 4/4 passing specs in Playwright E2E suite)  

---

## Pattern — Playwright IndexedDB Auth Session Capture

### Problem
When writing Playwright E2E tests for Firebase Auth v9+ web applications, standard session reuse via `storageState()` fails. Playwright saves `localStorage` and `cookies`, but Firebase Auth v9+ stores its active user session tokens inside **IndexedDB** (`firebaseLocalStorageDb`). As a result, the saved `storageState.json` contains `0 localStorage entries`, and subsequent test specs fail by redirecting back to `/login`.

### Why it Happens
Naive E2E auth setups assume authentication tokens live in `localStorage` or session cookies. Firebase Web SDK v9+ defaults to `indexedDBLocalPersistence` for browser tab persistence. Standard Playwright `storageState()` without IndexedDB support ignores IndexedDB databases entirely.

### Solution
1. **Mint Custom Auth Tokens via Admin SDK**: In a setup spec (`auth.setup.js`), use the Firebase Admin SDK (`admin.auth().createCustomToken(uid)`) to generate a custom auth token for a dedicated E2E test user (`e2e-test-user`).
2. **Client Sign-In Hook**: Provide a development-only client hook in `src/firebase.js` (`window.__e2eSignIn(customToken)`), strictly gated by `import.meta.env.DEV` to prevent production bundling.
3. **Capture IndexedDB Session**: Enable Playwright's native IndexedDB capture option in `playwright.config.cjs`:
   ```javascript
   use: {
     storageState: {
       indexedDB: true,
     },
   }
   ```
4. **Reuse Session**: All downstream test specs consume the saved `.auth/user.json` storage state with pre-authenticated `firebaseLocalStorageDb` data, bypassing Google OAuth popups completely.

### Failure Mode
If `storageState` is configured without `{ indexedDB: true }`, the session file will contain 0 entries, causing every protected route spec to fail with a login redirect.

### Task-Dashboard Instance
- Setup: [`tests/playwright/auth.setup.js`](file:///d:/GitHub_Repo/Task-Dashboard/tests/playwright/auth.setup.js)
- Client Hook: [`src/firebase.js`](file:///d:/GitHub_Repo/Task-Dashboard/src/firebase.js)
- Configuration: [`playwright.config.cjs`](file:///d:/GitHub_Repo/Task-Dashboard/playwright.config.cjs)
- Seeder: [`scripts/e2e/seed-test-user.cjs`](file:///d:/GitHub_Repo/Task-Dashboard/scripts/e2e/seed-test-user.cjs)
