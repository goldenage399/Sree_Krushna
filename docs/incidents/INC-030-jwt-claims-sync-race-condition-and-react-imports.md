# INC-030 — JWT Claims Sync Race Condition and React Imports

**Date**: 2026-06-26  
**Severity**: Medium (permission denied loop & UI crash)  
**Status**: Resolved  
**Affected Users**: Level 2 (Admin) and Level 4/5 (Standard) users  

---

## What Happened

1. When navigating to the Task Creation Wizard, the UI crashed with `ReferenceError: useState is not defined` inside `AdvancedConfigurationStep.jsx`.
2. Low-privilege users (Level 4/5) encountered cascading `FirebaseError: Missing or insufficient permissions` at `ProfileUserMappingService.core.js` and `WorkloadCalculationService.js` when querying profile assignments.
3. Newly logged-in Admin users (Level 2) encountered `FirebaseError: Missing or insufficient permissions` in `useFirestoreSubscription[UsersContext]` and `WorkloadCalculationService.js` for daily attention reports.

---

## Architectural Surface Mapping

Per `post-incident-governance` protocol, the incident affected the following surfaces:

### 1. UI Surface
- **Impact**: The Task Creation step crashed completely due to a Javascript syntax reference error (`useState` not defined).

### 2. Data Surface
- **Impact**: Firestore rules for `/daily_attention_reports/{reportId}` restricted read/list access strictly to owners or supervisors sharing a team. Admins (Level 2) who did not share a team with users were blocked from querying the collection, returning `permission-denied`.

### 3. Reactive Surface
- **Impact**: A race condition existed where `AuthContext` resolved user data from Firestore and set the `level` state immediately, enabling the `UsersContext` subscription (`/users` list query). However, the client's Auth JWT token claims had not yet been refreshed on the client. The Firestore backend evaluated the request using the old token, rejecting the query.

### 4. Service Surface
- **Impact**: `ProfileUserMappingServiceCore.getProfileCurrentUser` and `WorkloadCalculationService` executed queries that were not permitted for Level 4/5 users (scans on `/users` and `/daily_attention_reports`). These queries failed and threw unhandled exceptions/errors into the console.

### 5. Module Surface
- **Impact**: Commented out React and hooks import at the top of `AdvancedConfigurationStep.jsx` caused the component to fail during compile/render.

### 6. Governance Surface
- **Impact**: No structural gate prevented React imports from being commented out or verified token claims status before mounting database-bound contexts.

---

## Root Cause

1. **React Import Regression**: The React hooks import line at the top of `AdvancedConfigurationStep.jsx` was accidentally commented out, causing `useState` to be undefined.
2. **JWT Claims Sync Race Condition**: React state initialized faster than the asynchronous Firebase Auth token refresh (`forceTokenRefresh()`), causing database subscriptions to mount with stale token credentials.
3. **Overly Restrictive Firestore Rules**: `/daily_attention_reports` security rules lacked level-based checks for Admins (Level 2), blocking them from executing general dashboard queries.

---

## Resolution

1. **Restored Imports**: Uncommented the import line for React and hooks in [AdvancedConfigurationStep.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskCreation/steps/AdvancedConfigurationStep.jsx).
2. **Synchronous JWT Sync Check**: Modified [AuthContext.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/contexts/AuthContext.jsx) to check if the current user's local JWT claims match their resolved level in Firestore. If out of sync, the auth initialization block now synchronously awaits `forceTokenRefresh()` before setting `loading(false)`.
3. **Graceful Error Handling**: Added custom `permission-denied` catch handlers to [ProfileUserMappingService.core.js](file:///d:/GitHub_Repo/Task-Dashboard/src/services/ProfileUserMappingService.core.js) and [WorkloadCalculationService.js](file:///d:/GitHub_Repo/Task-Dashboard/src/services/WorkloadCalculationService.js) to warn and fallback instead of throwing console errors.
4. **Custom Claims Repair**: Ran `syncUserClaims.js` using the Admin SDK to repair out-of-sync level claims in Firebase Auth for existing production users.
5. **Rules Update**: Added `hasLevelViaClaims(2)` to the `/daily_attention_reports` get/list rules in [firestore.rules](file:///d:/GitHub_Repo/Task-Dashboard/firestore.rules) and deployed the rules to production.

---

## Lessons Learned

1. **Sync Token Claims Before Render**: Never mount authorized query listeners until you verify the current user's Auth JWT token claims actually match their Firestore authorization levels.
2. **Warn/Fallback on Permissions**: Client-side queries that might fail due to access control should catch `permission-denied` errors and fallback gracefully rather than flooding the console or breaking the application.
3. **Grant Admin Rules Globally**: System-wide collections scanned by admin dashboards must include rules permitting access based on global level claims (e.g. `hasLevelViaClaims(2)`).

---

## Files Affected

| File | Change |
|------|--------|
| `src/components/TaskCreation/steps/AdvancedConfigurationStep.jsx` | Uncommented React hooks import |
| `src/contexts/AuthContext.jsx` | Integrated synchronous custom claims check and token refresh on initial login |
| `src/services/ProfileUserMappingService.core.js` | Handled `permission-denied` error gracefully in `getProfileCurrentUser` |
| `src/services/WorkloadCalculationService.js` | Handled `permission-denied` error gracefully in `getAttentionDataForProfiles` |
| `firestore.rules` | Added level 2 admin permission check for `daily_attention_reports` |
