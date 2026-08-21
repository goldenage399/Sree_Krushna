---
description: MANDATORY workflow for debugging any User-Profile-Task issues (ADR-001)
---

# Debug Task Architecture Workflow

> ⚠️ This workflow is **MANDATORY** before suggesting any fixes for task query/assignment issues.

## Why This Exists

This workflow was created after a flawed diagnosis where:

1. A field mismatch was found (`assignedTo.userId: null` in data vs query)
2. The diagnosis suggested "fix either the write or the query"
3. The correct answer: queries should use `profileId`, not `userId` (profile-centric architecture)

**Lesson**: Always check DESIGN INTENT before analyzing code behavior.

---

## Step 1: Architecture Check (BLOCKING)

**Before ANY code tracing**, read and quote the architecture:

1. Read [RELATIONSHIP-CARDINALITY-SSOT.md](../../docs/ssot/architecture-hub/RELATIONSHIP-CARDINALITY-SSOT.md) lines 28-37

2. Answer these questions:

   - What is the PRIMARY assignment relationship?
     → `Task → Profile (MANY:1) via task.assignedTo.profileId`
   - What is the primary key?
     → `assignedTo.profileId`
   - Is `assignedTo.userId` primary or derived?
     → Derived (optional, for display only)

3. Quote the rule in your response:
   > "Per RELATIONSHIP-CARDINALITY-SSOT L35: Task owned by Profile: MANY:1 via task.assignedTo.profileId"

---

## Step 2: Violation Analysis

**ONLY after completing Step 1**, trace code to find violations:

1. Any `where('assignedTo.userId'...)` is a BUG
2. Any `where('assignedUserId'...)` is a LEGACY violation
3. Correct pattern: `where('assignedTo.profileId', 'in', userProfileIds)`

### Search Commands

```bash
# Find violations
grep -r "where.*assignedTo\.userId" src/ --include="*.js" --include="*.ts"

# Verify correct pattern exists
grep -r "assignedTo\.profileId" src/ --include="*.js" --include="*.ts"
```

---

## Step 3: Fix Suggestion

State clearly:

> "Per ADR-001, the fix is to query by `assignedTo.profileId`
> from the user's `profileAssignments[]`, not by `userId`."

### Correct Fix Pattern

```javascript
// Get user's profiles
const profileIds =
  userData.profileAssignments
    ?.filter((p) => p.isActive !== false)
    ?.map((p) => p.profileId) ?? [];

// Query by profile, not user
if (profileIds.length > 0) {
  where("assignedTo.profileId", "in", profileIds.slice(0, 30));
} else {
  // No profiles = no tasks (correct behavior)
  where("assignedTo.profileId", "==", "__no_profile__");
}
```

---

## Anti-Pattern Warning

| ❌ WRONG                                                             | ✅ CORRECT                                                        |
| -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| "Query expects userId, write has null userId - which should we fix?" | "Architecture mandates profileId. Query using userId is the bug." |
| Presenting "fix options" without checking architecture               | Quote ADR-001 first, then suggest the architecturally-correct fix |
| Code-first debugging                                                 | Architecture-first debugging                                      |

---

## References

- [ADR-001-PROFILE-CENTRIC-TASKS.md](../../docs/adr/ADR-001-PROFILE-CENTRIC-TASKS.md)
- [RELATIONSHIP-CARDINALITY-SSOT.md](../../docs/ssot/architecture-hub/RELATIONSHIP-CARDINALITY-SSOT.md)
- [ARCHITECTURE-ENFORCEMENT-FRAMEWORK.md](../../docs/frameworks/ARCHITECTURE-ENFORCEMENT-FRAMEWORK.md)
- [.agent/patterns/position-routine-workspace-vs-audit-scoping.md](../patterns/position-routine-workspace-vs-audit-scoping.md)
