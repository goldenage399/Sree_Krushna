---
pattern: playwright-spa-e2e-testing-best-practices
activation_tier: reference
canonical_source: task-dashboard
status: HYPOTHESIS
name: playwright-spa-e2e-testing-best-practices
description: Playwright SPA and Realtime Firestore E2E Testing Best Practices
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

---

# Playwright SPA & Realtime Firestore E2E Testing Best Practices

**Pattern Category**: Testing / Automation Invariants  
**Status**: VALIDATED (2026-08-08 — TASK-226 E2E Sign-Off; INC-071 found via this spec's own coverage)  
**Scope**: All Playwright E2E specs in `tests/playwright/`  

---

## 🎯 Core Rules & Invariants

### 1. Wait Strategy Invariant (React SPA + Firestore `onSnapshot`)
* ❌ **NEVER use `networkidle`**: Firestore realtime `onSnapshot` subscriptions keep persistent long-polling and WebSocket connections open. `page.waitForLoadState('networkidle')` will hang or time out on Firefox, Safari, and Edge.
* ❌ **NEVER use `domcontentloaded` alone for screenshots**: `domcontentloaded` fires as soon as the HTML skeleton parses — before React context providers (`AuthProvider`, `UsersContext`) finish fetching user claims from Firestore. Taking screenshots on `domcontentloaded` captures a blank loading spinner.
* ✅ **ALWAYS wait for loading spinners to unmount or target UI selectors to mount**:
  ```javascript
  await page.goto('/my-tasks');
  await page.waitForLoadState('domcontentloaded');

  // Wait for React Auth & UsersContext spinners to unmount
  await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(1500); // Allow layout & CSS custom properties to stabilize
  ```
  ⚠️ **Known ceiling**: the `.catch(() => {})` swallows *any* reason the spinner selector never resolved — including the app throwing before it ever mounted, not just "spinner wasn't there because load was instant." A test that only asserts on absence (e.g. `login-page` hidden) after this can pass even if the target component silently failed to render. Always pair it with a **positive** assertion on a real content testid (`await expect(page.getByTestId('<feature-root>')).toBeVisible()`), not just a negative one.

* ❌ **Don't assume `.toBeHidden()` on `login-page` proves the feature rendered.** It only proves you're not on the login screen — a broken/blank feature component still passes. Assert on the actual page's P55 root anchor (ARCH-INV-007) as well.

---

### 2. Session Persistence (Firebase Auth v9+ IndexedDB Requirement)
* Firebase Auth v9+ stores user tokens inside `firebaseLocalStorageDb` in **IndexedDB**, not `localStorage`.
* In `playwright.config.cjs`, `storageState` MUST specify `indexedDB: true`:
  ```javascript
  const authenticated = {
    storageState: STORAGE_STATE,
    dependencies: ['setup'],
    testMatch: /.*\.spec\.js/,
  };
  ```
* Without `indexedDB: true`, Playwright's `storageState` saves 0 tokens, bouncing protected routes back to `/login`.

---

### 3. Pre-Flight Firestore Test Account Seeding
* Protected routes (`RequireAuth`) verify `userData?.status === 'ACTIVE'`, `level: N`, and `projectLevels`.
* If `e2e-test-user` is missing or unseeded, `<RequireAuth>` redirects to `/onboard`.
* Ensure seeding is run before E2E execution:
  ```bash
  node scripts/e2e/seed-test-user.cjs --apply
  ```
* To test different permission levels live:
  ```bash
  npm run e2e:level 1  # Super Admin
  npm run e2e:level 3  # Team Supervisor
  npm run e2e:level 5  # Associate
  ```
* ⚠️ **There is no dev Firestore (ADR-002 Decision 7) — E2E runs against live production `pi-ops`.** `e2e-test-user` is the only account safe to mutate, and it's flagged `isE2ETestUser: true` so it's greppable/filterable out of real-user counts. `seed-test-user.cjs` defaults to dry-run for exactly this reason. Never widen a spec to write through a real user's account, and if a future spec needs to *write* task/task-event data (not just read), give it its own `isE2ETestUser`-flagged fixture data and clean it up in the test — don't leave synthetic rows in production collections.

---

### 4. Visual Verification & Artifact Embedding Protocol
* When capturing screenshots for P89 Visual Sign-Off:
  ```javascript
  const screenshotDir = path.join(process.cwd(), 'tests', 'playwright', 'screenshots');
  await page.screenshot({ path: path.join(screenshotDir, 'component-view.png'), fullPage: true });
  ```
* Copy captured screenshots to the active session artifacts directory before embedding in `walkthrough.md`:
  `C:\Users\Temp\.gemini\antigravity-ide\brain\<conversation-id>\screenshots\`

---

## 🛠️ CLI Quick Reference

```bash
# Run headless Chromium E2E suite
npm run test:e2e

# Run with visible browser window (headed debugging)
npm run test:playwright:headed

# Run multi-browser suite with HTML report
npm run test:multi-browser

# Switch test user level live in Firestore
npm run e2e:level <1-5>
```
