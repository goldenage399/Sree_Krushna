# INC-048: Telemetry Sidebar — Task Status Casing Mismatch

## Phase 1 — Incident Capture

### Incident Description
When viewing the new Telemetry Sidebar on the Activity Dashboard preview page, Panel A (Current State Snapshot) rendered `0` active tasks, `0` pending tasks, and `No Active Tasks` status badges, despite the database having tasks assigned to the user's active profiles.

### Root Cause
1. **Data Casing Divergence:** Historical data and seed scripts (e.g. `seedFirestore.admin.js`) populated the `status` field on task documents as capitalized strings: `"In Progress"` and `"Pending"`.
2. **Strict lowercase queries:** The point-in-time snapshot query inside `ActivityLogService.getUserTaskSnapshot()` strictly queried task status matching the canonical lowercase constants from `TASK_STATUS` (`'in_progress'` and `'pending'`), yielding zero counts.

### Architectural Surface Mapping
1. **UI Surface:** The preview sidebar column displayed zero active/pending tasks and incorrect stale badges.
2. **Data Surface:** Firestore tasks statuses had case variations between legacy seeds (`"In Progress"`) and the canonical constants (`'in_progress'`).
3. **Reactive Surface:** The `useActivityMetrics.js` hook returned empty snapshots to the component.
4. **Service Surface:** `ActivityLogService.getUserTaskSnapshot(userId)` was matching statuses on strict lowercase constraints.
5. **Module Surface:** N/A.
6. **Governance Surface:** Missing verification test for database status vocabulary casing boundaries on point-in-time counts.

---

## Phase 2 — Invariant Classification

This incident exposes a **data query boundary vulnerability**:
- Any point-in-time count or database aggregation query must be case-insensitive or support legacy capitalized status strings if the database is seeded or migrated with capitalized values.
- *New Invariant:* Firestore query constraints on `status` fields MUST query both lowercase and legacy capitalized variations using the `in` operator (e.g. `['in_progress', 'In Progress']`) if matching active, pending, or completed tasks.

---

## Phase 3 — SSOT Extension & Standards Catalog Write-Back

Let's declare a new standard under `GEMINI.md` to enforce status query case-insensitivity.

### Zero-Grep Bidirectional Linkage (DISC-001)
- **SSOT Location:** `GEMINI.md` → `Data Integrity`
- **Source Code Back-Link:** [`ActivityLogService.js`](file:///d:/GitHub_Repo/Task-Dashboard/src/services/ActivityLogService.js#L761-L785)
