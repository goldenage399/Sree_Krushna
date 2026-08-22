---
pattern: api-layer-modernization
origin_cap: CAP-032
tier: gas+firebase
applies_to:
  - "GAS + Firebase hybrid"
  - "any project with positional-argument shim proxy"
prereqs:
  - "Centralized router file (e.g. 02_Router.js)"
  - "Unified response contract (Protocol #29)"
porting_effort: medium
canonical_source: docs/adr/ADR-012-api-layer-modernization.md
last_reviewed: 2026-04-18
description: "Modernizing Apps Script API with public actions."
---

# Portable Workflow: API Layer Modernization

**Context:** The project uses a legacy proxy/shim that converts positional arguments into named payloads, and a `switch` statement for routing. This creates a "Three-Surface Deployment" burden and a class of silent "undefined parameter" failures.

---

## Step 1 — Backend: Switch to Lookup Map

Replace the procedural `switch(action)` block with a declarative `PUBLIC_ACTIONS` lookup map.

**Before:**
```javascript
function doPost(e) {
  var action = e.parameter.action;
  switch (action) {
    case 'getTasks': return getTasks(e.parameter.id);
    // ...
  }
}
```

**After:**
```javascript
const PUBLIC_ACTIONS = {
  "getTasks": (req) => getTasks(req.id),
  "updateUser": (req) => updateUser(req.email, req.data)
};

function doPost(e) {
  const req = JSON.parse(e.postData.contents);
  const handler = PUBLIC_ACTIONS[req.action];
  if (!handler) return jsonResponse(createErrorResponse("Unknown action: " + req.action));
  return jsonResponse(handler(req));
}
```

---

## Step 2 — Frontend: Centralized `apiPost`

Create a single Promise-based wrapper for all backend calls. This eliminates the need for a positional-argument shim.

```javascript
/**
 * Unified API caller. Replaces google.script.run positional calls.
 */
export async function apiPost(action, payload = {}) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      .doPostProxy({ action, ...payload }); // Wrap in single object
  });
}
```

---

## Step 3 — Phased Migration of Call Sites

1. **Leaf Modules first**: Migrate modules with the fewest dependencies.
2. **SWR/Cache Layer**: Handle any modules using the Stale-While-Revalidate pattern carefully, as Promise timing differs from callback timing.
3. **Audit**: Use `grep` to ensure zero instances of `google.script.run` remain outside the `apiPost` wrapper.

---

## Step 4 — Decommission the Shim

Once all call sites are migrated:
1. Delete the legacy `fetchGAS` or shim function.
2. Delete any proxy logic (e.g. `GasRunner` Proxy).
3. Remove associated protocols or rules that were only there to manage the shim's debt.

---

## Gotchas

- **Positional drift**: Ensure every `apiPost` call site uses the correct keys that the backend `PUBLIC_ACTIONS` expects.
- **Interceptors**: If the legacy shim had logging or timing interceptors, port them to the new `apiPost` wrapper.
- **GAS parameter limit**: GAS `doPost` has a payload size limit. For very large payloads, ensure they are sent in the post body, not as URL parameters.
