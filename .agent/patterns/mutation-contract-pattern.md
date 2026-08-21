---
pattern: mutation-contract-pattern
activation_tier: reference            # reference | routed | guarded  (PACT-001)
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: "npm run sg:inv005"           # ast-grep auth-fallback guard (paired with sg:inv006 at R2)
portability: repo-specific
canonical_source: task-dashboard
porting_effort: medium
---

# Layer 4 Mutation Contract & Invalidation Protocol

This document formalizes the **Layer 4 Mutation Contract** (governing cache invalidation and UI state synchronization upon data mutations) to prevent entity fragmentation and stale UI visual sync states.

---

## 1. Core Contract Rules

Whenever a component, page, or service performs a **write operation** (add, set, update, delete) to a Firestore collection registered under `status: "enforced"`, it **must** explicitly trigger the corresponding invalidation method.

### The Invalidation Map

| Collection Name | Direct Query Restrictions | Primary Invalidation Trigger | Action on Success |
| :--- | :--- | :--- | :--- |
| `users` | Forbidden outside `UsersContext` | `UsersContext` subscription | Self-healing via live snapshot |
| `profiles` | Forbidden outside `ProfileContext` / `ProfileService` | `refreshCurrentUserProfile()` | Invalidate cache & reload context |

---

## 2. JSDoc `@mutationContract` Convention

Every function, hook, or API method that modifies a governed collection must be decorated with the `@mutationContract` JSDoc tag. This tag documents the affected collection, mutated entity, invalidation handler, and payload expectations.

### Example: Positional Profile Assignment Mutation

```javascript
/**
 * Assigns a positional profile to a user.
 * 
 * @async
 * @function assignPositionToUser
 * @param {string} userId - Target user ID
 * @param {string} profileId - Target positional profile ID to link
 * 
 * @mutationContract {profiles} Mutates user profile positional mappings.
 * @invalidation {refreshCurrentUserProfile} Called immediately post-mutation success to invalidate the local 5-minute TTL context cache and enforce role-based access control.
 * @reference ADR-001 | INC-003 Plural Positional Profile Linkage
 */
export async function assignPositionToUser(userId, profileId) {
  // 1. Perform write/mutation operation in Firestore
  await updateProfileAssignmentInFirestore(userId, profileId);

  // 2. Execute explicit Layer 4 invalidation
  await refreshCurrentUserProfile();
}
```

---

## 3. Pull Request (PR) Gate Questions

To enforce this contract before code is integrated, PR templates must contain the following verification checks:

1. **Does this PR perform writes to `users` or `profiles` collections?**
   - [ ] Yes (Complete question 2)
   - [ ] No
2. **Is the write operation immediately followed by the registered invalidation handler?**
   - [ ] Yes (Specify file and line: `____________________`)
   - [ ] No (Provide architectural justification below)
3. **Did you decorate the mutation function with JSDoc `@mutationContract`?**
   - [ ] Yes
   - [ ] No

---

## 4. Future Typed Mutation Manifests

To transition the mutation contract from JSDoc-level convention to compile-time/runtime enforcement, the codebase will migrate to a **Typed Mutation Manifest Pattern**:

```typescript
// Proposed typed contract schema
interface MutationContract<TCollection extends string> {
  collection: TCollection;
  invalidationTrigger: () => Promise<void> | void;
}

const ProfileMutationContract: MutationContract<"profiles"> = {
  collection: "profiles",
  invalidationTrigger: async () => {
    await refreshCurrentUserProfile();
  }
};
```
By enforcing that every write service receives a `MutationContract` registration, we prevent developers from executing queries without binding invalidation hooks.
