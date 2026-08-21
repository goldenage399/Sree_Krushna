# Incident Report: INC-044 — Project Access Error due to Raw Firestore Level Check

## Incident Summary

When a Super Admin (level 1) attempted to access `/project/fcit/my-tasks`, they were blocked by a "User does not have access to this project" error screen. The user's account had global `level: 1` and `role: admin` credentials successfully verified by the routing layer (`RequireAuth`), but the context layer (`ProjectContextProvider`) denied project access.

- **Affected Component**: `src/contexts/ProjectContext.jsx`
- **Symptom**: "User does not have access to this project" screen for super-admins/admins.
- **Fix**: Destructured and used the normalized `level` and `role` from `useAuth()` inside `ProjectContextProvider` instead of reading raw `level` from the un-normalized `users/{uid}` Firestore document snapshot.

---

## Root Cause Analysis

In `ProjectContext.jsx`, the user's role and level were resolved using a real-time Firestore document listener:
```javascript
  const userSub = useDocument(userRef, `ProjectContextProvider_user_${user?.uid}`);
```
It then attempted to check the global administrator bypass using:
```javascript
  // Legacy: Check global level for backward compatibility
  if (userData.level && userData.level <= 2) { ... }
```
This check failed for two reasons:
1. **Raw Level String (P94)**: The `userData.level` field in Firestore is a string (e.g. `"1"`). While JavaScript relational operators (`<=`) coerce strings, strict checks or missing fields bypass this.
2. **Missing Level Field**: For users whose access levels are derived from their role designation (e.g., `designation: "super_admin"` mapped to level `1`), the raw Firestore user document does not contain a `level` field at all (it is computed dynamically at runtime). Thus, `userData.level` was `undefined`, causing the condition to fail and blocking access.

The `AuthContext` already performs designation-to-level mapping and normalizes the level to a number (`level`) using the `toLevel()` utility. However, `ProjectContextProvider` bypassed `AuthContext` and read the raw Firestore document directly, causing the discrepancy.

---

## Architectural Surface Mapping

1. **UI Surface**: `ProjectContext.jsx` rendered the `Project Access Error` screen, preventing the user from viewing the project dashboard.
2. **Data Surface**: N/A — No database schema changes. The user document stored `designation: 'super_admin'` correctly.
3. **Reactive Surface**: `ProjectContextProvider` maintained a redundant subscription to `users/{uid}` and read raw `userSub.data` instead of consuming the React State (`level` and `role`) exposed by `useAuth()`.
4. **Service Surface**: N/A — No Cloud Functions or background services involved.
5. **Module Surface**: N/A — Routing was correct; the failure occurred inside the page context mounting phase.
6. **Governance Surface**: Missing verification step in `principal-architect` checklist to audit raw Firestore document reads for user level/role data against the `useAuth()` normalized context. Hardened in `principal-architect-R05` and `role-activation.md` Step 8.

---

## Corrective Actions & Resolution

1. **Fix at Context Layer**: Updated `ProjectContext.jsx` to destructure `level: authLevel` and `role: authRole` from `useAuth()` and resolve `effectiveLevel` globally (commit `482eb986`).
2. **Role Hardening**: Added `principal-architect-R05` to require auditing of authorization checks to ensure they read from the normalized `AuthContext` rather than raw Firestore snapshots (commit `cc06c916`).
3. **Workflow Update**: Added Step 8 (`Auth-Source Verification`) to the domain discovery checklist in `role-activation.md` (commit `cc06c916`).

---

## Prevention & Invariants

- **P94 Extension**: Any check against a user's authorization level or role must consume the normalized values from `AuthContext` (`useAuth()`) rather than querying the raw Firestore user document directly.
- **Redundant Subscription Avoidance**: Avoid creating raw Firestore listeners for user data (`users/{uid}`) in child contexts when `useAuth()` already subscribes to it at the root of the application.
- **Trace to Source**: Before implementation, the architect must trace the auth level variable to confirm it flows through the `toLevel` parser.
