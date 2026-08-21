# INC-060: My Profiles Modal — Positional Assignment Resolution Fallback

**Date**: 2026-07-11
**Severity**: Medium (UI/UX degradation — Super Admins and global users seeing "Unknown Profile" mock assignments instead of their active positional roles)
**Branch**: eur-001/m6-ingestion
**Resolution**: Implemented defensive client-side fallback resolving assignments directly from the AuthContext's `userData.profileAssignments` via `ProfileUserMappingService`.
**Affected Component**: `src/components/MyAssignmentsModal.jsx`

---

## Symptom

When opening the **My Profiles** (Assignments) modal, the user is presented with a mock card reading:
* **Role**: `Unknown Profile (PRIMARY)`
* **Level**: `Lvl 0`
* **ID**: `unknown`
* **Project**: `General`
* **Department**: `Unknown Department`

This occurred even when the user document in Firestore contained a populated `profileAssignments` array (e.g. for Super Admins with level 1 MD roles mapped across multiple projects).

---

## Root Cause

1. The `AssignmentService.getUserAssignments` cache/transformation logic relied on finding a single legacy `profileId` on the user document.
2. For Super Admins, `profileId` is `null` (or undefined), and their multi-project assignments are stored exclusively inside `profileAssignments[]`.
3. If the cache is warm or the backend facade returns an empty resolved list, the service falls back to returning a default "Unknown Profile" object containing empty fields.
4. Because client-side asset caching (Vite bundle hashing) may preserve older service logic across user refreshes, any latency or failure in backend service sync resulted in the mock card displaying.

---

## Architectural Surface Mapping

| Surface | Affected? | Detail |
| :--- | :--- | :--- |
| **UI Surface** | ✅ YES | `MyAssignmentsModal` rendered mock fallback data instead of the active user roles. |
| **Data Surface** | ✅ YES | User-centric multi-project assignments are stored in `profileAssignments[]` but were not parsed by the default path. |
| **Reactive Surface** | ✅ YES | Integrated the modal to listen directly to the `userData` state from `AuthContext` to trigger re-fetches when assignments update. |
| **Service Surface** | ✅ YES | `AssignmentService` failed to map positional assignments for users lacking a root `profileId`. |
| **Module Surface** | ❌ N/A | No routing or module registration issues. |
| **Governance Surface** | ✅ YES | Enforced **P68** (Firestore call delegation to Service layer) by routing fallback queries through `ProfileUserMappingService` instead of inline `getDoc` calls. |

---

## Invariant Gap Identified

1. **Caching & Synchronization Drift**: In-memory caching within services can mask updates to user profile assignments, especially during real-time administrative edits.
2. **Positional Fallback**: Components must implement a defensive layout/data fallback to the local session state (`AuthContext.userData`) when shared lookup services fail or are outdated.

---

## Resolution Status

1. Modified `MyAssignmentsModal.jsx` to load `userData` from `AuthContext`.
2. Implemented a client-side defensive resolver that triggers if the service returns default/empty assignments. It directly transforms the active `profileAssignments` array from `userData`, fetching profile titles/departments via `ProfileUserMappingService.getProfile()` and project details via `AssignmentService.getProjectDetails()`.
3. Verified the build and deployed to production hosting.
