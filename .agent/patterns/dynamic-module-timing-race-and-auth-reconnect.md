---
pattern: dynamic-module-timing-race-and-auth-reconnect
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/post-incident-governance.md
    at: "Phase 3 / Process Pattern Gate"
triggers: []
guard: ""
portability: universal
canonical_source: sree-krushna-marriage-os
porting_effort: low
---

# Dynamic ES Module Timing Race and Dynamic Auth State Reconnection

**Category**: Process / Reliability Gate  
**Applies to**: Web SPAs, dynamic fragment controllers, real-time data sync (Firestore/Supabase/WebSockets), client SDK loading  
**Origin**: 2026-09-18 — Incident INC-092 (Shopping mutable table fell back to Local Mode due to CDN ES module initialization delay and unauthenticated session rejection)  
**Status**: VALIDATED  

---

## Pattern — Dynamic ES Module Timing Race and Dynamic Auth State Reconnection

### Problem
In Single Page Applications (SPAs) where data clients or cloud SDKs (e.g. Firebase Firestore, Supabase, Appwrite) are imported as ES modules (`<script type="module">` fetching from CDN), the scripts are deferred and resolve asynchronously. When dynamic sub-views or modular HTML fragments mount synchronously upon tab navigation, their controller scripts often run before the ES module has finished downloading and attaching its functions to `window`. 

If the controller performs a naive, one-shot capability check (e.g., `if (typeof window.fsListenShoppingItems === 'function') ... else fallbackToLocal()`), it immediately degrades to local/mock mode and traps the user in a disconnected state. Furthermore, if the user navigates to the page unauthenticated, security rules reject the subscription with `permission-denied`, silently dumping the user into local mode without diagnostic explanation or an automated re-connection hook when they subsequently authenticate.

### Why it happens
1. **Asynchronous ES Module Evaluation**: According to the HTML/DOM specification, `<script type="module">` execution is deferred until document parsing finishes and all network imports (e.g., `https://www.gstatic.com/firebasejs/...`) are fetched. In contrast, fragment routers (like hashchange handlers or dynamic template mounters) execute immediately on DOM insertion.
2. **One-Shot Guard Anti-Pattern**: Component initialization code tests `window[api]` once at evaluation time. Failing once is treated as permanent absence of the cloud data layer.
3. **Disconnected Auth & Real-Time Sync Lifecycles**: Authentication flows (`onAuthStateChanged`) update asynchronously. When a user completes sign-in, the UI fragment does not receive a broadcast event to elevate its listener from unauthenticated fallback to active real-time sync.

### Solution
Implement the 3-pillar resilient sync lifecycle:

1. **Graceful Retry Polling (`retries = 25`, interval 200ms)**:
   Instead of a one-shot check, poll for the global SDK function with an exponential or fixed-interval timeout (e.g., 5.0 seconds maximum) before concluding that the cloud client is offline.
   ```javascript
   function initFirestoreSync(retries = 25) {
     if (typeof window.fsListenCollection !== 'function') {
       if (retries > 0) {
         setTimeout(() => initFirestoreSync(retries - 1), 200);
         return;
       }
       setSyncStatus('local', 'Offline / Local Mode');
       return;
     }
     // Proceed to bind onSnapshot listener...
   }
   ```

2. **Explicit Error Callbacks with Diagnostic Telemetry**:
   Pass an explicit error callback into the Firestore/backend subscription. Distinguish between network failures and authorization rejections (`permission-denied`). Display clear user-facing diagnostics (e.g., `🟡 Local Mode (Sign-in Required)` with a tooltip stating which identity is authorized).

3. **Global Auth State Broadcast & Auto-Reconnection**:
   In the central authentication manager (`auth.js`), dispatch a custom event (`sk-auth-state-changed` or `auth-changed`) upon user login, logout, or token refresh:
   ```javascript
   window.dispatchEvent(new CustomEvent('sk-auth-state-changed', { detail: { user } }));
   ```
   Component controllers listen for this event and immediately trigger `initFirestoreSync()`, transitioning from local mode to live synchronization automatically without requiring a manual page refresh.

### Failure Mode
Without this pattern:
- Users on slower mobile connections or high-latency networks are permanently trapped in `🟡 Local Mode`.
- Newly signed-in users see outdated offline data until they manually reload the page.
- Silent permission denials mislead users into believing the app has malfunctioned when in reality they simply need to log in.

### Task-Dashboard instance
- `shopping_src/scripts/controller.js` (lines 1950–2010): `initFirestoreShoppingSync(retries = 25)` polling loop, error callback handling `permission-denied`, and event listener on `window.addEventListener('sk-auth-state-changed')`.
- `public/js/auth.js` / `js/auth.js`: CustomEvent `sk-auth-state-changed` dispatched on Firebase `onAuthStateChanged`.
- Incident `INC-092` (2026-09-18).
