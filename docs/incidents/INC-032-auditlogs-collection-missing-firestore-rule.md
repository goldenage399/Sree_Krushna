# INC-032 — `auditLogs` Collection Missing from Firestore Security Rules

**Date**: 2026-06-26
**Severity**: High (all feature flag audit log writes silently blocked; compliance trail lost)
**Status**: Resolved
**Affected Component**: `firestore.rules`, `AuditLogService.js`, `FeatureFlagService.js`
**Related INC**: INC-019 (`archivedProfiles` missing rule — exact same class)
**Protocol**: P87 (New Collection Rule Gate) — second violation

---

## What Happened

Every time a Super Admin changed a feature flag, the following error appeared in the console:

```
Failed to log feature flag change: FirebaseError: Missing or insufficient permissions.
{flagName: 'allowUnmappedProfileAssignment', action: 'enabled', userId: '...', projectId: 'fcit'}
Failed to log change to AuditLogService database: FirebaseError: Missing or insufficient permissions.
```

The flag write itself succeeded (`FeatureFlagService: Update successful on attempt 1`), but the
audit log write to `AuditLogService.logFeatureFlagChange()` failed on every call.

---

## Root Cause

`AuditLogService.js` line 67 writes to:
```
auditLogs / featureFlagChanges / entries / {docId}
```

The `firestore.rules` file has no `match /auditLogs/{...}` block. The collection falls through
to the catchall deny at line 680:

```
match /{document=**} { allow read, write: if false; }
```

This blocked every `addDoc()` call, regardless of the caller's authentication level.

**Why P87 didn't prevent this**: `AuditLogService.js` was written and wired into
`FeatureFlagService.js` without a corresponding rules gate check. P87 (from INC-019) mandates
that every new client-side `collection()` reference maps to a named rule block — but no
automated check enforces this at PR/deploy time. The gap is in enforcement, not definition.

---

## Fix Applied

Added the missing rule to `firestore.rules` before the catchall deny:

```javascript
// Write path: auditLogs/featureFlagChanges/entries/{docId}
// Pattern: Append-only audit trail (same as /tasks/{id}/auditLogs)
match /auditLogs/{document=**} {
  allow read, list: if isAuthenticated() && (isOwner() || hasGlobalLevel(1));
  allow create:     if isAuthenticated() && (isOwner() || hasGlobalLevel(1));
  allow update, delete: if false;  // Immutable after creation
}
```

Deployed via `firebase deploy --only firestore:rules`. Build output: zero compilation errors.

---

## Architectural Surface Mapping

| Surface | Impact | Notes |
|---|---|---|
| **UI Surface** | — Not affected | No visual changes; error appeared only in console |
| **Data Surface** | ✅ Affected | Root cause: `auditLogs` collection had no Firestore rule → catchall deny |
| **Reactive Surface** | — Not affected | No state management changes |
| **Service Surface** | ✅ Affected | `AuditLogService.js` shipped without rules validation gate; `FeatureFlagService.js` silently swallowed the error |
| **Module Surface** | — Not affected | No module/routing changes |
| **Governance Surface** | ✅ Affected | P87 (INC-019) was not enforced at `AuditLogService` authoring time; second violation of same pattern |

---

## Invariant Reinforced

> **P87 — New Collection Rule Gate** (first defined in INC-019): Every client-side Firestore
> write to a new collection MUST be accompanied by a corresponding named rule block in
> `firestore.rules`. The catchall deny (`/{document=**} → false`) is not a safe fallback —
> it is the source of permission errors.

**INC-032 strengthens P87** by demonstrating that it is violated when:
1. A service (`AuditLogService`) is written with a `collection()` target, AND
2. No rules file check is part of the service authoring checklist

**Required enforcement addition**: The PREFLIGHT table (R-NEW for Firestore writes) must
explicitly include: "Does `firestore.rules` contain a named match block for every collection
this code writes to?"

---

## DISC-001 Back-Link Added

Added comment to `AuditLogService.js` write path:
```js
// SSOT: firestore.rules § "FEATURE FLAG AUDIT LOGS" — P87, INC-032
```

And to `firestore.rules` new block:
```js
// P87 (INC-019, INC-032): Every client-side collection write needs a named rule block.
```
