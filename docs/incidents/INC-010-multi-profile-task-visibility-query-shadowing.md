# INC-010: Multi-Profile Task Visibility and Query Context Shadowing

## Status
Resolved

**Keywords**: variable-shadowing, query-context, userCtx, multi-profile, buildScopedTaskQuery, profileAssignments, task-visibility, zero-results, context-stub
**Topology Layer**: Data Layer
**Ownership Type**: query-context
**Symptom Tags**: zero-results, variable-shadowing, context-stub, multi-profile-miss

## Incident Description
Users with multiple active profile assignments (e.g., a user holding both an Associate role and a Delta Admin role) experienced a task visibility issue where tasks assigned to their alternative profiles were not displayed in the dashboards. The queries only fetched tasks for a single profile or returned an empty set due to a query building context bug.

### Concrete Task & User Details (Troubleshooting Case Study)
* **Target Task**: "Delta Marketing CLip On Frames on Windows"
  * **Task ID**: `hNFF0wU6WDMnnU2V51M8`
  * **Project**: FFC Delta (`ffc_delta`)
  * **Assigned To Profile**: `ffc_delta_admin_01` (level 2 Admin, Operations)
* **Affected User**: `operations.excutive.pe@gmail.com`
  * **Role/Level**: Level 2, holding **7 active profile assignments** (including `ffc_delta_admin_01`).
* **Symptom**: The task was assigned to `ffc_delta_admin_01`, but `operations.excutive.pe@gmail.com` could not see it on their dashboard because the query returned zero tasks.

---

## Architectural Surface Mapping

### 1. UI Surface
* **Impact**: Affected task visibility on [MyTasksPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/MyTasksPage.jsx) and [AssociateDashboard.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/AssociateDashboard.jsx). Users could not see their assigned tasks in dashboard lists.

### 2. Data Surface
* **Impact**: Firestore queries failed to match because they queried using `where('assignedTo.profileId', '==', userProfile.id)` (single profile query) instead of querying by the array of profile IDs matching ADR-001.

### 3. Reactive Surface
* **Impact**: 
  - [AssociateDashboard.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/AssociateDashboard.jsx) suffered from variable shadowing where a component-level `userCtx` (created with full `userData` for `canPerformAction` permission checks) was shadowed by a local `userCtx` inside `setupTaskQuery` (created with a stub level-5 context).
  - This shadowing meant the local context lacked the user's actual profile assignments, preventing multi-profile query construction.

### 4. Service Surface
* **Impact**: None directly, but the interaction with `ProfileUserMappingService` returned a single profile object rather than the array of positions, bypassing plural linkage requirements.

### 5. Module Surface
* **Impact**: None. No new dependencies or structural module changes were required because the fix only involved internal logic renaming and existing context utilization.

### 6. Governance Surface
* **Impact**: Violated standard plural positional profile linkage protocol (`INC-003`/`Rule 61`) and shadowed context variables violating clean scoping rules.

---

## Root Cause
1. **Shadowing**: Top-level `userCtx` was shadowed by a local stub `userCtx` inside query functions.
2. **Missing Multi-Profile Query logic**: Query setup was relying on legacy single-profile resolution `ProfileUserMappingService.getUserProfile(user.uid)` rather than dereferencing active `profileAssignments` from `userData` or the plural user mapping.

---

## Environment & SSO Rationale (ADR-002 Decision 7)
The development database `pi-tasks-dev` did not contain any FFC Delta references or multi-profile user setups. In addition, `pi-tasks-dev` was retired because:
1. Google Auth assigns UIDs **per Firebase project**, meaning the same Google account has different UIDs in dev vs prod, so real users could never log into dev to test this scenario.
2. Cloud custom claims sync functions require the Blaze plan, which was not supported on the Spark plan dev project.
Therefore, this issue and its fix can only be verified against the production `pi-ops` project.

---

## Corrective Action / Resolution
1. **Rename Context Variable**: Replaced local query-building context variable name from `userCtx` to `personalCtx` to completely eliminate shadowing.
2. **Plural Profile Querying**: Constructed the personal context from `userData` (or `currentUserProfile`), ensuring all profile assignments are included. Override `level: 5` and `systemRole: null` inside `personalCtx` so `buildScopedTaskQuery` generates the correct Firestore `in` array constraint for the profile IDs.
