# INC-019 — `archivedProfiles` Collection Missing from Firestore Security Rules

**Date**: 2026-06-22
**Severity**: High (Super Admin blocked from archiving profiles — complete feature outage)
**Status**: Resolved
**Affected Component**: `firestore.rules`, `ArchiveProfileModal.jsx`
**Related INC**: INC-008 (Firestore rules evaluation error pattern)

---

## What Happened

A Super Admin (`goldenage399@gmail.com`) attempted to archive an organizational profile via the
`ArchiveProfileModal`. The operation failed silently with:

```
Failed to archive profile. Please try again.
FirebaseError: Missing or insufficient permissions.
ArchiveProfileModal.jsx:170
```

The client-side Super Admin bypass in `logger.js` printed the bypass confirmation, but the
archive still failed — because the bypass is client-side only and has no effect on Firestore
server-side rule evaluation.

---

## Root Cause

`ArchiveProfileModal.jsx` L151 writes to the `archivedProfiles` collection:

```js
await setDoc(doc(db, 'archivedProfiles', profile.id), archiveData);
```

The `firestore.rules` file contained explicit rules for three archive collections:
- `archivedAccessRequests` (L571) ✅
- `archivedUsers` (L575) ✅
- `archivedTasks` (L579) ✅

But `archivedProfiles` was **never added**. The catchall deny rule at L650:

```
match /{document=**} { allow read, write: if false; }
```

…blocked every write to `archivedProfiles`, regardless of the caller's auth level.

**Why it wasn't caught at implementation time**: The `ArchiveProfileModal` was developed
without a corresponding Firestore rules addition. No preflight gate existed to verify that
every client-side `collection()` reference maps to a named rule block.

---

## Fix Applied

Added the missing rule to `firestore.rules` consistent with the other archive collections:

```javascript
match /archivedProfiles/{archivedId} {
  allow read, write, delete, list: if isAuthenticated() && (isOwner() || hasGlobalLevel(1));
}
```

Deployed: `firebase deploy --only firestore:rules` → `pi-ops` ✅

---

## Architectural Surface Mapping

### 1. UI Surface
`ArchiveProfileModal.jsx` displayed a generic error toast without surfacing which Firestore
operation failed. No UI surface change was needed — the modal logic was correct.

### 2. Data Surface
`firestore.rules` was missing the `archivedProfiles` collection rule. All four archive
collections (`archivedAccessRequests`, `archivedUsers`, `archivedTasks`, `archivedProfiles`)
now have explicit `Owner || hasGlobalLevel(1)` guards. The Firestore schema for
`archivedProfiles` documents was correct — only the rules were missing.

### 3. Reactive Surface
No React state or hook changes required. (Justification: the error occurred in an async
`try/catch` that already routed to `alert('Failed to archive profile')` — no state management
was involved in the failure path.)

### 4. Service Surface
No Cloud Function or external service involved. The archive operation is entirely client-side
via the Admin SDK write path through `setDoc`. (Justification: profile archiving was designed
as a direct client write protected by Firestore rules, not a Cloud Function.)

### 5. Module Surface
No package dependencies, route registrations, or file structure changes. (Justification: the
fix is a single rule addition inside the existing `firestore.rules` file.)

### 6. Governance Surface
No existing protocol covered the invariant: "every `collection()` reference in client code
must have a named rule block in `firestore.rules`." INC-019 establishes **P87** to enforce
this going forward (see Structural Invariant below).

---

## Structural Invariant Established

### P87: Firestore Collection Rule Completeness Gate

**Rule**: Every Firestore collection referenced by client-side SDK calls (`collection(db, 'name')`,
`doc(db, 'name', id)`) **MUST** have a corresponding named `match /collectionName/{docId}` block
in `firestore.rules`. The catchall deny (`match /{document=**}`) is **not** a substitute.

**Enforcement trigger**: Any PR or agent task that introduces a new `collection(db, '...')` or
`doc(db, '...')` reference in `src/` must include a `firestore.rules` review as part of the
Definition of Done.

**Detection**: Add `firestore.rules` to the PREFLIGHT R15 scope — whenever new Firestore
collection names appear in `src/` that are absent from `firestore.rules`, flag as a blocker.

**Banned pattern**:
```js
// Writing to a collection without verifying a named rule block exists:
await setDoc(doc(db, 'newCollection', id), data); // ← requires matching rule
```

---

## Lessons Learned

1. **Firestore catchall deny is silent**: A missing rule block does not produce a build error
   or lint warning — the feature appears to work in emulator if the emulator rules are
   permissive, then fails in production. Always add rules alongside new collections.

2. **Client-side admin bypasses do not affect Firestore rules**: The `logger.js` Super Admin
   bypass is a UI/routing concern only. Firestore rule evaluation runs server-side and ignores
   client-side flags entirely.

3. **Archive collections are a consistent pattern**: All four archive collections follow the
   identical `Owner || hasGlobalLevel(1)` pattern. New archive collections must be added to
   the existing block in `firestore.rules` at implementation time.
