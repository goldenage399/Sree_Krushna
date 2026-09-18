# INC-092 — Dynamic ES Module Timing Race & Unauthenticated Local Mode Fallback in Showroom Shopping Table

**Incident ID**: `INC-092`  
**Date**: `2026-09-18`  
**Severity**: High (Multi-User Showroom Collaboration & Data Layer Availability)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Governing Standard**: `STD-UI-LIFECYCLE-001`, `P-MOD-COMP-001`, `dynamic-module-timing-race-and-auth-reconnect.md`  
**Affected Component**: `shopping_src/scripts/controller.js`, `public/js/auth.js`, `js/auth.js`, `public/js/modules/firestore-client.js`, `firestore.rules`  
**Related Patterns**: `.agent/patterns/dynamic-module-timing-race-and-auth-reconnect.md`, `.agent/patterns/dynamic-fragment-lifecycle-and-modal-dismiss-contract.md`

---

## Architectural Surface Mapping

1. **UI Surface**: The table HUD status pill displayed `🟡 Local Mode` instead of `🟢 Live Sync`. It lacked clear error messages, failure explanations, or sign-in tooltips.
2. **Data Surface**: `/shopping_items/{itemId}` in `firestore.rules` strictly requires `isAllowedUser()`. Unauthenticated requests are rejected by cloud security rules with `permission-denied`.
3. **Reactive Surface**: The shopping table controller maintained a single-shot initialization check without an event listener for user login/logout lifecycle transitions.
4. **Service Surface**: Firebase Auth evaluates asynchronously; when Google OAuth completes, no component event was dispatched across the window context to notify fragments.
5. **Module Surface**: `firestore-client.js` is imported as an ES module (`<script type="module">`). By HTML specification, ES modules are deferred and fetch CDN dependencies (`gstatic.com`) asynchronously, while the SPA tab mounter runs synchronously.
6. **Governance Surface**: Missing codified pattern for async SDK loading retry polling and dynamic auth state reconnection.

---

## 1. Executive Summary & Symptom

When navigating to the live mutable shopping table on local preview (`http://localhost:5000/?view=table#tab-shopping`), the table header displayed `🟡 Local Mode` instead of `🟢 Live Sync`. Users were unable to verify whether the application was actively synchronizing with cloud Firestore for multi-user retail showroom shopping in Bhubaneswar.

Investigation revealed two intertwined root causes:
1. **Module Evaluation Timing Race**: `firestore-client.js` is an asynchronous ES module. The SPA shopping fragment loaded and executed its controller before the Firebase CDN module completed evaluation, causing the one-shot check `typeof window.fsListenShoppingItems === 'function'` to evaluate as `false` and prematurely downgrade to offline local mode.
2. **Unauthenticated Permission Denial**: The user opened the page in a session where Google Auth was not yet signed in. Firestore security rules strictly require `isAllowedUser()`. The subscription failed with `permission-denied`, but the error was swallowed without diagnostic feedback or a dynamic retry hook for when the user subsequently authenticated.

---

## 2. Root Cause Analysis & 9-Step Diagnostic

### Step 1: Root Cause Timeline & Discovery
- **Turn 1**: User loaded `http://localhost:5000/?view=table#tab-shopping`.
- **Observation**: Status badge showed `🟡 Local Mode`.
- **Forensic Check**: Inspecting `shopping_src/scripts/controller.js` line 1945 revealed:
  ```javascript
  if (typeof window.fsListenShoppingItems === 'function') { ... }
  else {
    tableState.syncStatus = 'local'; // One-shot fallback!
  }
  ```
- **Timing Analysis**: `index.html` loads `<script type="module" src="js/modules/firestore-client.js">`. ES modules are deferred by spec. The hash router in `app.js` fetches `shopping-fragment.html` via AJAX and immediately evaluates its scripts. `window.fsListenShoppingItems` was undefined at the exact instant the controller ran.
- **Security Rule Check**: `firestore.rules` enforces `allow read, write: if isAllowedUser();`. If `request.auth == null`, Firestore throws `permission-denied`.

### Step 2: Escape Analysis
- **Why did automated unit tests pass?**
  Tests in `scripts/test-shopping-registry.cjs` audit DOM IDs, CSS contracts, and data layer structures via static analysis and mock environments. They do not simulate browser ES module network latency over CDN.
- **Why was the user trapped in Local Mode?**
  There was no retry loop for module loading and no event listener for `onAuthStateChanged`. Even after signing in with Google, the table never re-attempted connection.

### Step 3: Preventive Guardrails Implemented
1. **Graceful Retry Polling (`initFirestoreShoppingSync(retries = 25)`)**:
   Polls every 200ms (up to 5.0 seconds) for `window.fsListenShoppingItems` to resolve from CDN before concluding the service is offline.
2. **Explicit Error Callback & UI Diagnostics**:
   Updated `fsListenShoppingItems(callback, onError)` in `firestore-client.js`. If rejected due to permission denial, the badge updates to `🟡 Local Mode (Sign-in Required)` with a tooltip clarifying the authorized email accounts.
3. **Dynamic Auth State Synchronization**:
   Updated `js/auth.js` and `public/js/auth.js` to dispatch `sk-auth-state-changed` upon login/logout. Added a listener in `controller.js` to auto-reconnect to `🟢 Live Sync` immediately on sign-in without a manual page refresh.
4. **Cloud Deployment**:
   Validated and deployed `firestore.rules` and `hosting` to production via Firebase CLI.

---

## 3. Structural Invariant & Pattern Codification

This incident institutionalized the universal pattern:
- `.agent/patterns/dynamic-module-timing-race-and-auth-reconnect.md`

All dynamic SPA fragments and modular web controllers in the ecosystem must adhere to:
1. **Never perform one-shot capability tests on deferred ES modules.**
2. **Always subscribe to global auth state change events to trigger automatic reconnection.**
3. **Always supply explicit error callbacks with actionable diagnostic messaging.**
