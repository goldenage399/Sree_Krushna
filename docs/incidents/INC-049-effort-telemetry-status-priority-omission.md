# Incident Report: INC-049 — Effort Telemetry Omitted on Task Status or Priority Change

## Incident Summary

When a user updated a task and submitted logged hours (`timeSpent`) and a planned next step (`nextAction`) alongside a status change (e.g. marking a task as `completed` or `in_progress`) or a priority change, the logged hours and next actions were completely lost in the task's events subcollection. Although the event document (`TASK_STATUS_CHANGED`, `TASK_COMPLETED`, or `TASK_PRIORITY_CHANGED`) was successfully written to `/tasks/{id}/events`, its `metadata` payload omitted the `hoursSpent` and `nextAction` fields. As a result, the analytics query `ActivityLogService._sumHoursSpent` (which sums hours from task events) completely missed these hours, producing incorrect logged effort aggregates.

- **Affected Components**: `src/components/TaskUpdateModal.jsx`, `src/components/TaskDetailsModal.jsx`, `src/components/ActivityFeed.jsx`
- **Symptom**: Logged hours and next actions submitted during status or priority changes did not appear in the task details timeline or the Activity Dashboard, and were not aggregated in the user effort metrics.
- **Fix**: 
  1. Standardized `TaskUpdateModal.jsx` to append `hoursSpent` and `nextAction` inside the event `meta` block on status and priority changes.
  2. Updated `TaskDetailsModal.jsx` to extract these fields in `buildTimeline` and render them as badges/comments inside `TimelineItem`.
  3. Updated `ActivityFeed.jsx` to render status transitions, logged hours, comments, and next actions inside the activity dashboard feed cards.

---

## Root Cause Analysis

In `TaskUpdateModal.jsx`, task event writes are generated depending on which fields changed:
- If only task details changed (with no status/priority shift), `EnhancedTaskService.appendTaskEvent` was called with `type: 'TASK_UPDATED'` and correctly mapped `hoursSpent` and `nextAction` inside the metadata.
- If a status or priority change occurred, the modal appended `TASK_STATUS_CHANGED`, `TASK_COMPLETED`, `TASK_REOPENED`, `TASK_CANCELLED`, or `TASK_PRIORITY_CHANGED` events. However, these write blocks only mapped `from`, `to`, and `comment` in their `meta` payloads, completely omitting `hoursSpent` and `nextAction`.
- The feed renderers (`TaskDetailsModal.jsx` and `ActivityFeed.jsx`) also only read `description` or simple status transitions, ignoring any metadata fields when a status change event occurred.

This is a **contract-omission** bug: the transaction logic assumed that status changes do not carry effort telemetry, forgetting that the update form is unified and allows status shifts and effort logging simultaneously.

---

## Architectural Surface Mapping

1. **UI Surface**: `TaskDetailsModal.jsx` timeline and `ActivityFeed.jsx` (Activity Dashboard) failed to display logged effort and next actions for status-changing events.
2. **Data Surface**: `/tasks/{taskId}/events/` documents for status/priority change events were missing `hoursSpent` and `nextAction` properties inside the `metadata` object.
3. **Reactive Surface**: N/A.
4. **Service Surface**: `EnhancedTaskService.appendTaskEvent` writes did not include all telemetry fields in the status/priority change update paths inside `TaskUpdateModal.jsx`.
5. **Module Surface**: N/A.
6. **Governance Surface**: Preflight gates and testing lacked validation checks ensuring that unified form submissions write all telemetry properties regardless of state transitions.

---

## Corrective Actions & Resolution

1. **Standardized writes in `TaskUpdateModal.jsx`**: Added `hoursSpent` and `nextAction` to the metadata payload on status change and priority change events.
2. **Linked UI renderer in `TaskDetailsModal.jsx`**:
   - `buildTimeline` maps `hoursSpent`, `nextAction`, and `comment` from the events database payload.
   - `TimelineItem` renders the comment/accomplishment block, a logged effort badge (e.g. `⏱️ 5 hrs logged`), and a next action badge.
3. **Linked UI renderer in `ActivityFeed.jsx`**:
   - Displays status transitions, effort logs, accomplishments, and next actions on the Activity Dashboard cards.
4. **Hardened SSOT**: Documented the data path and schemas in `TELEMETRY-LOGGING-SSOT.md`.

---

## Prevention & Invariants

- **P97 Extension**: All `appendTaskEvent` calls generated from task update actions MUST consistently forward all telemetry details (`hoursSpent`, `nextAction`, and `comment`) in the metadata payload, even if a status or priority shift occurs.
