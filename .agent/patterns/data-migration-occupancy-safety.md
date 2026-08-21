---
pattern: data-migration-occupancy-safety
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Non-Destructive Migration (Data Occupancy Check)

**Category**: Anti-Pattern / Process Gate
**Applies to**: Database schema migrations, Firestore batch updates, Google Sheets schema updates
**Origin**: 2026-07-12 incident INC-061 (user schema migration script wiped active profile assignments)
**Status**: VALIDATED

---

## Pattern — Data Migration Occupancy Safety

### Problem
When migrating a database collection (e.g. `users`) from a legacy single-value field (e.g. `profileId`) to a new multi-value structure (e.g. `profileAssignments[]`), a naive script initializes empty defaults (`profileAssignments = []`) for documents that lack the legacy field. If those documents have *already* been migrated (or partially migrated) to the new structure, the script overwrites and clears their active data, causing severe data loss.

### Why it happens
1. The migration script assumes that documents lacking the legacy field are "unmigrated/unassigned" and thus should receive empty defaults.
2. In reality, some of these documents have already transitioned to the new schema model in previous refactors, meaning the legacy field is already gone or empty.
3. The script writes `updates.profileAssignments = []` blindly, clobbering the live production assignments.

### Solution
1. **Analyze Occupancy First**: Always check if the target field (e.g. `profileAssignments`) is already present and populated on the document.
2. **Skip Pre-Migrated Documents**: If the target array/object has elements (e.g. `profileAssignments.length > 0`), skip updating that document.
3. **Merge Instead of Overwrite**: If you must write default values, merge them with existing structures instead of doing a destructive set/overwrite.
4. **Targeted Updates Only**: Only add fields to the update payload that are actually changing. Do not initialize empty defaults for unaffected documents.

### Failure Mode
If applied incorrectly, the script might skip documents that actually need partial updates or fail to clean up obsolete fields on already-migrated documents.

### Task-Dashboard instance
During the execution of [migrate-multi-project.cjs](file:///d:/GitHub_Repo/Task-Dashboard/src/scripts/migrate-multi-project.cjs), the script cleared the assignments of `MD_Sir`, `Gupta Panigrahi`, and `Krushna Panda`. It was resolved by executing [restore-affected-users.cjs](file:///d:/GitHub_Repo/Task-Dashboard/src/scripts/restore-affected-users.cjs) which pulled original documents from the pre-migration backup collection `users_backup_20260712`.
