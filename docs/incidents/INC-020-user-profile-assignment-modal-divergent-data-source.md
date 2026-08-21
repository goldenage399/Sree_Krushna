# INC-020 — UserProfileAssignmentModal Divergent Data Source (Silent "No User Assigned")

**Date**: 2026-06-22
**Severity**: High (modal shows incorrect state, administrative confusion — wrong assignment decisions)
**Status**: Resolved
**Affected Component**: `UserProfileAssignmentModal.jsx`, `MultiUserProfileAssignmentService.js`
**Related INC**: INC-003 (Profile Dashboard Linkage Divergence — ancestor pattern)  
**Keywords**: divergent-data-source, UsersContext, getDocs, predicate-mismatch, isActive, modal-vs-page, P61, no-user-assigned, ancestor-pattern, dual-source
**Topology Layer**: Data Layer
**Ownership Type**: data-source
**Symptom Tags**: no-user-assigned, modal-vs-page-divergence, predicate-mismatch, dual-source

---

## What Happened

In the Admin Dashboard → Profile Management tab, clicking the "Assign User" button (UserGroupIcon)
on any profile that was already linked to a user opened the `UserProfileAssignmentModal` showing
**"No User Assigned"** in the yellow warning banner — despite the same page's "User Status" column
correctly showing **"Linked (1)"** with the user's name.

The modal's "Currently Assigned" section was empty. An admin seeing this could incorrectly
attempt to re-assign a user that was already assigned, potentially triggering duplicate or
conflicting assignments.

---

## Root Cause

Two components displayed the same data from **two different data sources** with **two different
filtering predicates**, producing contradictory results:

| Component | Data Source | Predicate |
|---|---|---|
| `ManageTab.getLinkedUsers()` | `UsersContext` (in-memory, all users) | `a.isActive !== false` |
| `UserProfileAssignmentModal.loadCurrentAssignment()` | Fresh Firestore `getDocs` query | `where('status', '==', 'active')` AND `a.isActive` (truthy) |

**Divergence 1 — Status filter**: The modal's `getAssignedUsers` in
`MultiUserProfileAssignmentService` (L147) fired a live Firestore query:
```js
query(collection(db, 'users'), where('status', '==', 'active'))
```
Any user whose `status` field was absent, `null`, or held a value other than `'active'`
(e.g., `'pending'`, `'invited'`, or the field simply not present) was excluded from the
result set. `ManageTab.getLinkedUsers` applied **no status filter** — it searched all users
already loaded into `UsersContext`.

**Divergence 2 — isActive boolean vs truthy**: The service checked
`assignment.isActive` (truthy), which returns `false` for `undefined`. The page checked
`a.isActive !== false`, which returns `true` for `undefined`. A profile assignment created
without an explicit `isActive: true` field would appear as "assigned" on the page but
"unassigned" in the modal.

**Why INC-003 didn't prevent this**: INC-003 (2026-05-18) fixed the plural `getLinkedUsers`
helper in `ManageTab.jsx` but did not establish an invariant covering the modal's separate
async data-fetch path. The modal was written post-INC-003 and independently re-introduced the
same divergence pattern through a different mechanism (service call vs context).

---

## Fix Applied

Replaced `loadCurrentAssignment()` (async Firestore call through
`MultiUserProfileAssignmentService`) with a synchronous `useMemo` that reads directly from
`allUsers` already in `UsersContext` — identical logic to `ManageTab.getLinkedUsers`:

```js
// UserProfileAssignmentModal.jsx — BEFORE (async Firestore query)
const loadCurrentAssignment = async () => {
  const userCtx = { level: userLevel ?? 2 };
  const assigned = await MultiUserProfileAssignmentService.getAssignedUsers(profile.id, userCtx);
  setCurrentAssignments(assigned || []);
};

// AFTER (synchronous useMemo from UsersContext)
const currentAssignments = useMemo(() => {
  if (!profile?.id) return [];
  return allUsers.filter(user =>
    user.profileId === profile.id ||
    (Array.isArray(user.profileAssignments) &&
      user.profileAssignments.some(
        a => a.profileId === profile.id && a.isActive !== false
      ))
  ).map(user => ({
    userId: user.id || user.uid,
    name: user.name,
    email: user.email,
    assignmentType: user.profileAssignments?.find(a => a.profileId === profile.id)?.assignmentType || 'primary'
  }));
}, [allUsers, profile?.id]);
```

Additionally removed 3 orphaned identifiers made unused by this change:
- `MultiUserProfileAssignmentService` import
- `usePermissions` import
- `userLevel` destructure

Build verified: `✓ 0 errors` on `UserProfileAssignmentModal.jsx`.

---

## Architectural Surface Mapping

### 1. UI Surface
The "No User Assigned" warning panel was the visible symptom. No CSS or layout changes
were needed — the fix changed the data source, which corrected the conditional render.

### 2. Data Surface
The divergence originated in `MultiUserProfileAssignmentService.getAssignedUsers()` applying
`where('status', '==', 'active')` to a live Firestore query. User documents that lacked a
`status` field or used alternative status values were invisible to the modal but visible to
the page. No schema changes required — the modal now reads from `UsersContext` which sources
its data from the same Firestore listener that populates the page.

### 3. Reactive Surface
`currentAssignments` was converted from a `useState` + async `useEffect` fetch to a
`useMemo` derived directly from `allUsers`. This eliminates a race condition where the modal
could briefly flash "No User Assigned" during the async fetch even when a user was assigned.
The component is now fully synchronous with the `UsersContext` state.

### 4. Service Surface
`MultiUserProfileAssignmentService.getAssignedUsers()` was removed from the modal's render
path for the "current state" use case. The service is still used for `assignUserToProfile`
and `removeUserFromProfile` (write paths, correctly routed through Cloud Functions).

### 5. Module Surface
Three imports removed from `UserProfileAssignmentModal.jsx`:
`MultiUserProfileAssignmentService`, `usePermissions` hook, and the `userLevel` variable.
No new imports or routes were added.

### 6. Governance Surface
INC-003's Protocol 61 (Plural Positional Profile Linkage) stated that UI must use
`getLinkedUsers` for display. This incident reveals that Protocol 61 scope was too narrow —
it covered the page-level display but not modal-level display using the same data. Protocol
61 is extended (see Structural Invariant below) to explicitly cover all modal/overlay
components that render profile-user linkage state.

---

## Structural Invariant Established

### P61 Extension: Single Context Source for Profile-User Linkage Display

**Extends**: Protocol 61 (Plural Positional Profile Linkage, INC-003)

**Rule**: Any component — page, tab, modal, drawer, tooltip, or overlay — that **displays**
current user-to-profile assignment state **MUST** derive that state from `UsersContext`
(`allUsers` or `users` from `useUsers()`) using the canonical predicate:

```js
user.profileId === profileId ||
user.profileAssignments?.some(a => a.profileId === profileId && a.isActive !== false)
```

**Banned pattern**: Any component firing its own `getDocs(query(collection(db, 'users'), ...))` 
to determine which users are currently assigned to a profile is a P61 violation. That data
is already in context; re-querying it creates divergence and Firestore I/O overhead.

**Permitted exception**: Write paths (`assignUserToProfile`, `removeUserFromProfile`) may
call the service layer. Only the **read/display path** is constrained.

---

## Lessons Learned

1. **Protocol scope must cover all rendering contexts**: A rule that says "the page must use X"
   does not automatically prevent a modal on the same page from using Y. Explicitly name
   all UI contexts (pages, modals, drawers) when establishing invariants.

2. **Two predicates for the same logical question = eventual divergence**: `isActive !== false`
   and `isActive` (truthy) are not equivalent when `isActive` is `undefined`. Always document
   which predicate is canonical and enforce it in a shared helper.

3. **UsersContext is the single source of truth for user state**: Any component that needs
   to display user-profile relationships should read from `UsersContext`, not issue its own
   Firestore queries. The context maintains a live listener — re-querying wastes I/O and
   produces stale snapshots.

4. **INC-003 was the ancestor**: When an incident is marked "pattern fixed and audit complete,"
   future components that re-implement the same domain logic must be audited against the
   established invariant at code-review time.
