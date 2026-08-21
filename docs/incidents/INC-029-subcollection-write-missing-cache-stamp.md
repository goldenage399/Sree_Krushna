# INC-029 — Subcollection Write Missing Parent Cache Stamp

**Date**: 2026-06-26
**Severity**: Medium (silent data gap — UI showed stale fallback text, no crash)
**Component**: `EnhancedTaskService.appendTaskProgressUpdate` / `TaskDetailsModal.jsx`
**Status**: RESOLVED

---

## Incident Summary

After the Task Schema Refactoring (subcollection extraction), the `latestUpdate` field on parent task
documents was never populated. When `TaskDetailsModal` implemented an accordion UI that reads
`task.latestUpdate` to show a preview in the collapsed header, all tasks showed the fallback text
"No updates yet — expand to load full history" even for tasks with active progress updates in
their subcollection.

---

## Root Cause

`EnhancedTaskService.appendTaskProgressUpdate` wrote the full update to the subcollection
but never updated `latestUpdate` on the parent task document. The cache field was architecturally
intended as a read-model to avoid N+1 queries, but the write side was never implemented.

---

## Architectural Surface Mapping

| Surface | Affected? | Notes |
|---|---|---|
| UI Surface | YES | Accordion header showed fallback for all tasks |
| Data Surface | YES | latestUpdate field on parent doc never written |
| Reactive Surface | NO | State correctly handled undefined with a fallback |
| Service Surface | YES | appendTaskProgressUpdate had an incomplete write contract |
| Module Surface | NO | No dependency or routing changes |
| Governance Surface | YES | No protocol required atomic cache stamps with subcollection writes |

---

## Also Discovered: Variant Blindness

Initial accordion implementation targeted the **default variant** only, leaving the **cockpit
variant** untouched. The user saw no change because cockpit was active.

Lesson: `TaskDetailsModal` has two render paths (`variant === 'cockpit'` guard at L584). Any
structural change must cover BOTH variants.

---

## Fix

`appendTaskProgressUpdate` now atomically writes both:
1. Full update doc to subcollection
2. `{ description, timestamp, updatedBy }` cache to `task.latestUpdate` on parent doc

Same `txn` (batch/transaction) is used when one is provided by the caller.

---

## Pattern Written

.agent/patterns/subcollection-write-cache-atomicity.md — captures the invariant that any
service method writing to a subcollection with a parent cache field MUST update that cache
field in the same atomic operation.
