---
pattern: multi-profile-array-contains-query
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

# Multi-Profile Array-Contains Query Pattern

**Category**: Data Retrieval
**Applies to**: User-Profile-Task mappings and multi-profile association queries
**Origin**: 2026-07-03 Multi-Profile Assignment Lookup Failure (INC-046)
**Status**: VALIDATED

---

## Pattern — Multi-Profile Array-Contains Query

### Problem
In multi-project, multi-profile systems, a single user is assigned to multiple active profiles. This invalidates the legacy $1:1$ single-profile database mapping (where a user document had a single `profileId` field). Under the new model:
- The user's root-level `profileId` is set to `null`.
- Assignments are stored in a nested array: `profileAssignments: [{ projectId, profileId, status: "ACTIVE" }]`.

When components query for the assignee of a specific profile using the legacy scalar query (`where('profileId', '==', profileId)`), the database returns 0 results because the root `profileId` is `null`. The system concludes the position is vacant even when the user is fully assigned to the profile in the nested array.

### Why it happens
Firestore does not support searching nested object arrays (like `profileAssignments`) efficiently or directly without complex collection group indexes or client-side scans. In-memory scans of the entire users collection are too slow (O(N) operations) and violate security rules for low-privilege users.

### Solution
1. **Denormalize at Write-Time**: When assigning a user to a profile, write the profile ID to a flat array of active string IDs (`activeProfileIds: [...]`) on the user document. Cloud Functions maintain this array atomically using `FieldValue.arrayUnion` and `FieldValue.arrayRemove`.
2. **Use Array-Contains (O(1) complexity)**: When querying for the assignee of a profile, query the user collection using `where('activeProfileIds', 'array-contains', profileId)`.
3. **Include Legacies (Backwards Compatibility)**: If the array-contains query returns empty, execute a fallback search against the legacy root `profileId` scalar so legacy single-profile users are still resolved.

```javascript
// Query by activeProfileIds array first (supports multi-profile assignments)
let usersQuery = query(
  collection(db, 'users'),
  where('activeProfileIds', 'array-contains', profileId)
);

let userSnapshot = await getDocs(usersQuery);

// Fallback to legacy single-profile query if array query is empty
if (userSnapshot.empty) {
  usersQuery = query(
    collection(db, 'users'),
    where('profileId', '==', profileId)
  );
  userSnapshot = await getDocs(usersQuery);
}
```

### Failure Mode
Querying only the nested array or scanning all users in-memory will exhaust GCP read quotas and trigger permission-denied errors on low-level users. Querying only the legacy `profileId` field results in a silent failure where multi-profile users are ignored.
