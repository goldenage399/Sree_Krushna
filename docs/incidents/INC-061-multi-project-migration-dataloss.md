# INC-061: Production Data Loss during Multi-Project User Schema Migration

**Date**: 2026-07-12
**Severity**: High (Production data loss and admin access degradation — User profile assignments and project levels overwritten for active multi-project users)
**Branch**: main (Migration Execution)
**Resolution**: Restored affected user documents from the automatic pre-migration backup collection (`users_backup_20260712`).
**Affected Component**: `src/scripts/migrate-multi-project.cjs` (migration script)

---

## Symptom

Immediately after running the production user schema migration script `migrate-multi-project.cjs`, the Managing Director (`goldenage399@gmail.com`, MD_Sir) and other multi-project users reported that their tasks were not loading on the **My Tasks** page (showing 0 tasks). Furthermore, MD Sir's admin permissions were degraded to Level 5 (Associate) client-side due to missing fields.

---

## Root Cause

1. The migration script was designed to update users from the legacy single-profile schema (`profileId`, `level`, `role` at root) to the new multi-profile array schema (`profileAssignments` and `projectLevels`).
2. For users who **did not** have a root `profileId` (because they had already been migrated to the multi-profile array schema in a prior session, such as MD Sir, Krushna Panda, and Gupta Panigrahi), the script went to the `else` branch of its user processor.
3. In this branch, the script initialized:
   ```javascript
   const profileAssignments = [];
   const projectLevels = {};
   ```
   It then blindly added these empty values to the Firestore update payload:
   ```javascript
   updates.profileAssignments = profileAssignments; // []
   updates.projectLevels = projectLevels; // {}
   ```
4. This update **overwrote and wiped out** the populated, correct `profileAssignments` and `projectLevels` arrays of these active users in the live `users` collection.
5. Due to the wiped arrays, `useMyTasks` could not resolve any active profile IDs and fell back to searching for `profileId == "__no_profile__"`, which resulted in 0 tasks loaded.

---

## Architectural Surface Mapping

| Surface | Affected? | Detail |
| :--- | :--- | :--- |
| **UI Surface** | ✅ YES | `MyTasksPage` failed to load any personal tasks (remained empty). |
| **Data Surface** | ✅ YES | Wiped `profileAssignments` and `projectLevels` arrays in Firestore for users without root `profileId`. |
| **Reactive Surface** | ✅ YES | `AuthContext` resolved the affected users to the default fallback (`level: 5`, role: `associate`) because their database fields were deleted. |
| **Service Surface** | ❌ N/A | No direct cloud functions or service execution failures. |
| **Module Surface** | ❌ N/A | No module path or dependency routing issues. |
| **Governance Surface** | ✅ YES | Violated standard migration safety rules: did not run a conditional lookup on target collections before overwrite. |

---

## Invariant Gap Identified

1. **Destructive Overwrites in Migration Scripts**: Migration scripts must verify if target fields (e.g. `profileAssignments`) are already populated before writing default values. If the document has already migrated (or is partially migrated), it must be skipped.
2. **Claims Synchronization Sync Gate**: Deleting active level/role fields from users without confirming their claims are successfully synced to active profiles can lock them out.

---

## Resolution Status

1. Created a recovery script [restore-affected-users.cjs](file:///d:/GitHub_Repo/Task-Dashboard/src/scripts/restore-affected-users.cjs) targeting the three affected user IDs:
   * `1b0mqHTKflWUUt3VMqZdGG20Zk03` (MD_Sir)
   * `QpwZQg3nTbMNPOtma1JkyMQCWo12` (Krushna Panda)
   * `dQX1L7QtztTjk2SEd0gFHvLQHc92` (Gupta Panigrahi)
2. Read the original, populated user records from the automatic pre-migration backup collection `users_backup_20260712`.
3. Executed a Firestore batch operation to fully restore the original documents (overwriting the corrupted records).
4. Verified that the custom claims listener refresh triggered, MD Sir's Level 1 access was restored, and all 6 Managing Director profile assignments re-populated, successfully loading the tasks.
