# INC-003 — Profile Dashboard Linkage Divergence

**Date**: 2026-05-18  
**Severity**: High (visual database divergence and user confusion)  
**Status**: Resolved (pattern fix applied; systemic audit complete)  
**Affected Component**: `ManageTab.jsx` (Admin Dashboard Profile tab)  
**Keywords**: divergent-view, stale-code-path, dual-implementation, profileAssignments, getLinkedUser, singular-predicate, ManageTab, ProfileManagementPage
**Topology Layer**: Data Layer
**Ownership Type**: data-source
**Symptom Tags**: divergent-view, stale-code-path, plural-linkage-miss

---

## What Happened

An administrative user assigned multiple positional profiles to a single user (e.g. `Bibekananda Nayak` was assigned to both `fcit_admin_01` and `ffc_delta_admin_01`). 

While the standalone profile management page (`ProfileManagementPage.jsx`) correctly recognized this mapping, the main Admin Dashboard's "Profile Management" tab rendered one of the profiles (`fcit_admin_01`) as `Unlinked`. 

This created a major divergence: the database correctly held both assignments, but the dashboard's visual layer displayed the position as unlinked, and attempting to re-link it inside the modal warned that the user was already assigned.

---

## Root Cause

1. **Dual Codebase Mismatch**: The Profile Management UI is implemented in two separate components depending on the route/view context:
   * Standalone view: `ProfileManagementPage.jsx` ([ProfileManagementPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/ProfileManagementPage.jsx))
   * Dashboard tab view: `ManageTab.jsx` ([ManageTab.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/ManageTab.jsx))
   
   During the migration to the multi-assignment positional profile architecture (ADR-001), only `ProfileManagementPage.jsx` was upgraded. `ManageTab.jsx` was left unmodified.

2. **Legacy Scalar Checks**: `ManageTab.jsx` was still utilizing the legacy singular helper `getLinkedUser` which only evaluated the user document's legacy scalar `profileId` field:
   ```javascript
   // Legacy code in ManageTab.jsx
   const getLinkedUser = (profileId) => {
     return users.find((user) => user.profileId === profileId);
   };
   ```
   Under ADR-001, users are mapped to profiles via a dynamic `profileAssignments` array containing assignment objects. The legacy helper failed to parse this array, rendering multi-linked positions as `Unlinked`.

3. **Stale Local State**: `ManageTab.jsx` retrieved users via a one-time static Firestore load inside a `useEffect` callback rather than maintaining an active live listener. This meant visual state stayed stale until a full page reload occurred.

---

## What Was Wrong With the Legacy Implementation

* **Single-link Assumption**: The helper assumed a one-to-one strict coupling between a user document and a single profile, completely ignoring modern delegative or plural positional mappings.
* **Lack of Registry Parity**: Code updates in one view context were not audited against the dashboard tab equivalent, leading to governance drift.

---

## Resolution

1. **Replaced Legacy Helper**: Upgraded `ManageTab.jsx` to define the plural `getLinkedUsers` helper matching `ProfileManagementPage.jsx`:
   ```javascript
   const getLinkedUsers = (profileId) => {
     return users.filter(user => 
       user.profileId === profileId || 
       (user.profileAssignments && Array.isArray(user.profileAssignments) && 
        user.profileAssignments.some(assignment => assignment.profileId === profileId && assignment.isActive !== false))
     );
   };
   ```
2. **Real-time Live Subscriptions**: Integrated `useFirestoreSubscription` to listen directly to the `users` collection:
   ```javascript
   const { data: users, loading: usersLoading } = useFirestoreSubscription({
     collectionPath: 'users'
   });
   ```
3. **Pluralized Stats & Table Cells**: Updated statistics cards, filtering conditions, and table cell rows to render `Linked ({count})` and display a comma-separated list of all assigned user names (`Users: User A, User B`).
4. **Audit complete**: A global search confirms **100% of getLinkedUser occurrences have been removed or refactored codebase-wide**.

---

## Lessons Learned

1. **Never Assume Singular Views**: When refactoring a core page, always search for duplicate or similar rendering layouts (like dashboard tabs) that duplicate the domain model.
2. **Standardize Query Helpers**: Shared helper functions (like `getLinkedUsers`) should be moved to service layers or utility libraries instead of being redefined inline across files to prevent future version mismatch.
3. **Audit Active Subscriptions**: Always back UI views with live subscriptions (`useFirestoreSubscription`) rather than stale static queries to guarantee immediate feedback on database edits.

---

## Structural Invariant Establishes

### Protocol 27.2: Plural Profile Linkage Auditing
* **Rule**: When reading or displaying positional profile assignments in the UI, developers **MUST** query the `profileAssignments` array using plural mapping (`getLinkedUsers`) to account for delegation and multi-assignment workloads. 
* **Banned Pattern**: `users.find(u => u.profileId === id)` is strictly deprecated.
