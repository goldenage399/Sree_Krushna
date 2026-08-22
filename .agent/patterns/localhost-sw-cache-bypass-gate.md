---
pattern: localhost-sw-cache-bypass-gate
activation_tier: reference
canonical_source: task-dashboard
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: universal
porting_effort: low
---

# Localhost Service Worker Cache Bypass Gate

**Category**: Pre-Flight Gate / PWA Lifecycle  
**Applies to**: Progressive Web Apps with Service Workers running during local development  
**Origin**: 2026-08-22 (INC-086 — Stale JS cache on localhost:5000)  
**Status**: VALIDATED  

---

## Pattern — Localhost Service Worker Cache Bypass Gate

### Problem
When a web app uses a Progressive Web App (PWA) Service Worker with a `Stale-While-Revalidate` caching strategy:
```javascript
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        return cachedResponse || fetchPromise;
      })
    );
  }
});
```
During local development on `http://localhost:5000` or `http://127.0.0.1:5000`, the browser executes `cachedResponse` on every page refresh. Code edits made to `.js` or `.css` files on disk are completely ignored by the running application until the developer manually clears browser storage or bumps `CACHE_NAME`.

### Why it happens
The Service Worker intercepts network requests before they hit the local development server. Because `cache.match()` resolves to the old cached file immediately, the developer sees the old version and believes code changes failed or had no effect.

### Solution
Always include an explicit localhost development bypass at the very top of the Service Worker's `fetch` event handler:
```javascript
self.addEventListener('fetch', (event) => {
  // Always bypass cache in local development
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    return; // Passes through directly to live network / local dev server
  }

  // Production caching strategy continues below...
});
```

### Failure Mode
Without this bypass:
- Developers waste hours debugging "why changes aren't taking effect".
- Hot-reloads and tab refreshes serve stale JavaScript bundles.
- Subtle bugs in previous builds persist in local dev environments.

### Task-Dashboard / Sree Krushna Instance
- Validated in `public/sw.js` and root `sw.js`.
- Incident reference: `docs/incidents/INC-086-monolithic-engine-port-css-scoping-and-sw-cache-bypass.md`.
