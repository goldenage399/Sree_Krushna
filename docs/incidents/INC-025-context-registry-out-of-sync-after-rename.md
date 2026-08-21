# Incident Report: INC-025 — Context Registry Out of Sync after Component Rename

**Date**: 2026-06-23
**Status**: RESOLVED
**ID**: INC-025
**Track**: Governance / Database Integrity
**Resolved By**: Renamed `ManageTab.jsx` to `ProfilesManageTab.jsx` inside the consumer list of `.agent/context-registry.json` to match the physical file rename.
**Keywords**: context-registry, ManageTab, ProfilesManageTab, unit-test-failure, D-005, context-registry.test.js
**Topology Layer**: Governance ↔ Context Registry
**Ownership Type**: governance-alignment
**Symptom Tags**: test-failure, context-registry-mismatch, missing-file-reference

---

## 1. Executive Summary

During execution of the unit test suite (`npm run test:unit:run`), `context-registry.test.js` failed with an `AssertionError: expected false to be true` in the `Collection Ownership Contract - Integrity Test (D-005)` suite under the `should assert all registered files exist on disk (Forward Mapping)` test.

The root cause was that `ManageTab.jsx` had been physically renamed to `ProfilesManageTab.jsx` in a prior session, but the consumer list in [.agent/context-registry.json](file:///d:/GitHub_Repo/Task-Dashboard/.agent/context-registry.json) still pointed to `ManageTab.jsx`, resulting in a missing file reference on disk.

---

## 2. Root Cause

The project enforces `D-005` (Collection Ownership Contract - Integrity Test) to verify that all Firestore collection owners and consumers registered in [.agent/context-registry.json](file:///d:/GitHub_Repo/Task-Dashboard/.agent/context-registry.json) exist on disk. When a file is renamed, the physical file changes but the registry mapping is not synchronized, causing the integrity test to fail because the old name `ManageTab.jsx` was no longer found in the source directories (`src/contexts`, `src/components`, `src/pages`, `src/utils`).

---

## 3. Resolution

I ran a diagnostic script to identify the missing file reference and discovered that `ManageTab.jsx` was the failing key. I modified [.agent/context-registry.json](file:///d:/GitHub_Repo/Task-Dashboard/.agent/context-registry.json) to rename the consumer entry:

```json
-    "ManageTab.jsx": {
+    "ProfilesManageTab.jsx": {
       "collections": ["profiles"],
       "readGranularity": "legacy-direct-read",
       "exemptionReason": "Queries profiles to list and manage position mappings."
     },
```

After applying the rename, all 277 unit tests passed successfully.

---

## 4. Surface Impact (compact)

* **Governance**: ⚠️ AFFECTED — Out-of-sync metadata registry. Resolved by matching filename mapping.
* **UI / Data / Reactive / Service**: ✅ NOT AFFECTED.

---

## 5. Prevention (→ P92 Extension)

**Invariant**: When renaming, moving, or deleting components or pages, developers and subagents must cross-reference [.agent/context-registry.json](file:///d:/GitHub_Repo/Task-Dashboard/.agent/context-registry.json) and update any references to match the new physical file path and name.

**Verification**: Run `npm run test:unit:run` (specifically `context-registry.test.js`) before committing any file renames or moves to ensure the context registry forward mapping is intact.
