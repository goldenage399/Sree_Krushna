# Incident Report: INC-046 — Multi-Profile Task Assignment Lookup Failure & Global Level Lockout

## Incident Summary

When attempting to assign a user to a task via the "Assign Task to Profile" modal, profiles assigned to multi-profile users (such as Gupta Panigrahi) showed up as "Vacant Position - Available for Assignment" even though the assignments were clearly visible and active in both the User Management and Profile Management pages. Additionally, low-privilege users (global `level: 5`) were blocked from querying the `/users` collection due to Firestore security rules, returning `permission-denied` errors.

- **Affected Components**: `src/services/ProfileUserMappingService.core.js`, `functions/multiProjectFunctions.js`
- **Symptom**: Task selection modal lists active profile positions as "Vacant," and global Level 5 users encounter Firestore permission errors when loading user lists.
- **Fix**:
  1. Modified `ProfileUserMappingServiceCore.getProfileCurrentUser(profileId)` to query using the denormalized array `activeProfileIds` (`where('activeProfileIds', 'array-contains', profileId)`) with a legacy query fallback.
  2. Updated the Cloud Function trigger `syncProjectLevelsOnAssignment` to calculate the user's global `level` as the minimum (highest privilege) value of their active `projectLevels` map and update `users/{userId}.level`.

---

## Root Cause Analysis

The bug was caused by a combination of two independent architectural gaps:

1. **Legacy Query Filter in Core Service**:
   The task assignment modal (`ProfileSelectionModal.jsx`) calls the Core service `ProfileUserMappingServiceCore.getProfileCurrentUser(profileId)` directly, which executed a legacy query:
   ```javascript
   const usersQuery = query(
     collection(db, 'users'),
     where('profileId', '==', profileId)
   );
   ```
   Under the modern multi-profile architecture, users assigned to multiple profiles have their root-level scalar `profileId` set to `null` to indicate they are mapped to the `profileAssignments[]` array instead. As a result, this query matched 0 documents and returned `null`, rendering the profile position as vacant for all users, including level 2 admins.

2. **JWT Custom Claims Sync Mismatch**:
   Under `firestore.rules`, listing/querying the `/users` collection requires a global level of at most 3 (`hasLevelViaClaims(3)`). The Cloud Function `syncProjectLevelsOnAssignment` correctly synced the user's `projectLevels` map when profile assignments changed, but failed to recalculate and update the user's global `level` field on their Firestore document. Consequently, a user holding Supervisor/Manager (L3) profiles remained globally set to `level: 5`, blocking them from querying user assignments.

---

## Architectural Surface Mapping

1. **UI Surface**: N/A — The modal UI correctly rendered based on the service response; the bug was data/query-driven.
2. **Data Surface**: The `users/{userId}` documents carry a modern `profileAssignments[]` array and a denormalized flat `activeProfileIds[]` array, but the root `profileId` remains `null` for multi-profile users.
3. **Reactive Surface**: The JWT token custom claims (`level`) became out-of-sync with the user's actual assigned profile levels because the database-level global `level` field was not updated by Cloud Functions.
4. **Service Surface**: `ProfileUserMappingServiceCore.getProfileCurrentUser` queried the legacy `profileId` scalar instead of the denormalized `activeProfileIds` array.
5. **Module Surface**: N/A — No route or dependency changes.
6. **Governance Surface**: The transition to multi-profile assignments left a legacy query constraint in the Core user-mapping service, creating a capability-mismatch between the admin dashboard and the task assignment wizard.

---

## Corrective Actions & Resolution

1. **Updated Service Query**: Changed the lookup in `ProfileUserMappingServiceCore.getProfileCurrentUser` to query by `activeProfileIds` array-contains, falling back to the legacy `profileId` scalar for older users.
2. **Updated Global Level Calculation**: Modified `syncProjectLevelsOnAssignment` Cloud Function to compute the user's global `level` as the minimum active project level (`Math.min(...activeLevels)`) and save it to the user document.
3. **Repaired Custom Claims**: Executed a repair script to correct Gupta Panigrahi's global level to `3` and sync their Firebase Auth custom claims.
4. **Verified**: Rebuilt the layout catalog, passed all preflight scans, compiled the Vite production bundle, and verified user document status using the `db-inspect.cjs` script.

---

## Prevention & Invariants

* **P98**: Any user-lookup or query by profile association in frontend services MUST target `activeProfileIds` (`array-contains`) to ensure multi-profile assignments are correctly matched.
* **P99**: The user's global `level` field and Auth custom claims MUST represent the highest privilege (lowest level number) across all active project profile assignments.
