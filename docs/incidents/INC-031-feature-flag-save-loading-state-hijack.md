# INC-031 — Feature Flag Save Loading-State Hijack (Full UI Remount on Save)

**Date**: 2026-06-26
**Severity**: High (every flag change caused a full page remount and value revert — feature effectively non-functional)
**Status**: Resolved
**Affected Component**: `FeatureFlagManagement.jsx`, `ProjectOverridesPanel.jsx`
**Related INC**: INC-009 (Unmemoized search callback infinite render loop — same class: shared loading state misuse)

---

## What Happened

A Super Admin changed a Project Override dropdown from "Inherit Global" to "Explicit: Allowed".
The console logged `FeatureFlagService: Update successful on attempt 1` (Firestore write succeeded),
but the dropdown immediately reverted to "Inherit Global" and the page appeared to "refresh" with
a full-screen loading spinner before returning to the dashboard.

---

## Root Cause

**Two-layer failure stack:**

### Layer 1 — Wrong loading state (primary cause)

`executeChangeRequest` and `handleRemoveProjectOverride` both called `setLoading(true)` at the
start of each save operation. `loading` is the **same state variable** used by the initial page
load guard at lines 342–350:

```jsx
if (loading) {
  return (
    <div className="feature-flag-management loading-state">
      <div className="loading-container">...</div>
    </div>
  );
}
```

Setting `loading: true` during a save **unmounts the entire UI** and replaces it with the
full-screen loading spinner. When `loading` becomes `false` again, all child panels
(`ProjectOverridesPanel`, `GlobalFlagsPanel`) remount from scratch, resetting their local
React state to initial values — including reverting dropdown selections to their default.

### Layer 2 — Source guard fragility (compounding)

`loadProjectOverrides` only stored overrides when `projectFlag.source === 'project'`.
`FeatureFlagService.normalizeFlag()` always writes `source: 'database'` for object-shaped
flags (line 494 in `FeatureFlagService.js`), even when called from a project-scoped fetch.
This caused the override check to silently fail on every reload, regardless of Layer 1.

---

## Fix Applied

1. **`FeatureFlagManagement.jsx`**: Added a separate `isSaving` boolean state. Replaced all
   `setLoading(true/false)` calls inside `executeChangeRequest` and `handleRemoveProjectOverride`
   with `setIsSaving(true/false)`. The initial-load `loading` guard is now untouched by saves.

2. **`FeatureFlagManagement.jsx` — `loadProjectOverrides`**: Broadened the source check from
   `source === 'project'` to also accept `source === 'database'` when `projectFlag.projectId`
   matches the current project, and normalises it back to `source: 'project'` on store.

3. **Panels**: Updated `loading={loading}` props to `loading={isSaving}` so child panels
   only receive the in-progress save signal — not the page-level boot signal.

---

## Architectural Surface Mapping

| Surface | Impact | Notes |
|---|---|---|
| **UI Surface** | ✅ Affected | Full-page visual flash; dropdown values reset on every save |
| **Data Surface** | ✅ Affected | `normalizeFlag()` source field clobbering caused silent state mismatch on reload |
| **Reactive Surface** | ✅ Affected | Root cause: shared `loading` state between initial boot and in-progress saves |
| **Service Surface** | ✅ Affected | `FeatureFlagService.normalizeFlag()` normalises `source` to `'database'` unconditionally |
| **Module Surface** | — Not affected | No module boundary, routing, or dependency changes |
| **Governance Surface** | ✅ Affected | No protocol enforced separation of page-boot state from operation-in-progress state |

---

## Invariant Defined

> **P-FSM-001 — Loading State Isolation**: A component's initial-load boolean state (`isLoading`,
> `loading`, etc.) MUST NOT be reused for in-progress async operations (saves, updates, deletes).
> Each async operation class requires its own state variable (`isSaving`, `isDeleting`, etc.).
> Mixing them causes the full-page guard to fire during routine operations, unmounting all children.

---

## Related ADR Gap

No ADR existed for loading state isolation. This incident establishes **P-FSM-001** as a new
project invariant. A PREFLIGHT check (R-NEW) should detect components that call the same setter
used in a render guard inside a save callback.

**Why INC-009 didn't prevent this**: INC-009 addressed infinite render loops from unmemoized
callbacks, not loading state reuse. The failure mode is different (UI remount vs. infinite loop)
but the class (mismanaged reactive state) is the same.
