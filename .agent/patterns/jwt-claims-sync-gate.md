---
pattern: jwt-claims-sync-gate
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# JWT Claims Sync Gate

**Category**: Design Gate
**Applies to**: Firebase Auth state change, client-side Firestore queries, and custom claims verification
**Origin**: 2026-06-26 JWT Claims Sync Race Condition (INC-030)
**Status**: VALIDATED

---

## Pattern — JWT Claims Sync Gate

### Problem
A user logs in or authenticates, triggering the client-side Auth listener (`onAuthStateChanged`). The listener immediately resolves the user profile and updates React state (e.g. `level` or `profile`). React components mount and execute Firestore queries gated by security rules (e.g. `request.auth.token.level == 2`).
However, because Firebase Auth token claims are updated asynchronously, the client's JWT token does not yet contain the updated claims at the exact millisecond the query runs. The Firestore security rules evaluate the request against the stale JWT, resulting in a `FirebaseError: Missing or insufficient permissions` exception.

### Why it happens
Firebase Auth's local user token caching mechanism does not automatically block client state transitions until custom claims are re-verified and re-tokenized. The Auth state change resolver fires as soon as the User object is initialized, creating a race condition between local React rendering and custom claim JWT token propagation.

### Solution
Before allowing the application auth loading state to transition to `loaded(true)` and mounting query listeners:
1. Compare the user's Firestore document claims (e.g. their resolved `level` in `/users` collection) against their active client-side Auth JWT token claims (`idTokenResult.claims`).
2. If the local client-side claims do not yet match the backend user document claims (or if the claims are absent/stale), synchronously await a token refresh using `user.getIdToken(true)` (or `forceTokenRefresh()`) before resolving the Auth state and rendering the application.

```javascript
// Example in AuthContext.jsx
const idTokenResult = await user.getIdTokenResult();
const currentClaimsLevel = idTokenResult.claims.level;

if (currentClaimsLevel !== dbUser.level) {
  console.warn("Auth token claims out of sync. Forcing token refresh...");
  await forceTokenRefresh(); // user.getIdToken(true) and update context state
}
```

### Failure Mode
If the token refresh is skipped, the client-side listener queries are sent with stale claims, triggering persistent permissions errors. If the token refresh is done asynchronously without blocking the `loading` flag transition, the query listeners will still mount and execute queries with stale credentials, causing the same permissions failures on page load.

### Task-Dashboard instance
Implemented in [AuthContext.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/contexts/AuthContext.jsx) to sync local Auth claims with resolved level claims from Firestore before setting `loading(false)`.
