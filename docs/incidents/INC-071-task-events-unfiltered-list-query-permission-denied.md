# INC-071: `tasks/{id}/events` Unfiltered List Query — Silent `permission-denied` on Every Non-Admin User's Task Timeline

**Date**: 2026-08-08
**Severity**: HIGH (silent, universal — every non-admin/non-owner user, every task, every timeline expand)
**Status**: Resolved — both call sites fixed, verified via new E2E coverage

## Summary

`TaskDetailsModal.jsx` fetches a task's lifecycle event timeline with `getDocs(query(collection(db, 'tasks', task.id, 'events'), orderBy('timestamp', 'asc')))` — no `where` clause. `firestore.rules`' `events/{eventId}` read/list rule authorizes non-owner/non-global-admin users only via `resource.data.projectId != null && isProjectMember(resource.data.projectId)`. Firestore's `list` rule evaluator cannot statically prove an *unfiltered* query satisfies a condition that depends on `resource.data` — it denies the whole query rather than filtering out only the documents that would fail — so **every associate/supervisor/manager opening any task's details modal got `permission-denied` loading their own task's event history.** The failure was fully silent: caught by a bare `try/catch` and only surfaced as `console.error('Failed to load task history subcollections:', err)` — no UI symptom beyond an empty timeline, which reads as "no events yet" rather than "broken."

Found by a new Playwright E2E spec (`tests/playwright/subtasks-task226.spec.js`) built to give `TaskDiscoveryPanel` real render coverage (deep-linking into `TaskDetailsModal` via `?taskId=`) — the spec's own permission-denial assertion caught it as a side effect, not something anyone was hunting for.

## Root Cause

Firestore's documented `list` rule semantics: for a `list`/query request, rules are evaluated against the *potential result set defined by the query's structural filters* (`where`/`orderBy`), not permissively per actually-returned document. If the rule condition depends on `resource.data.X` and the query has no `where('X', '==', ...)` filter tying it to that same field, Firestore cannot prove every possible matching document would pass — so it denies the entire request up front, regardless of what's actually in the collection.

**This is not a new bug class in this codebase.** The identical shape was already found and fixed for the `profiles` collection's `list` rule (`ProfileUserMappingService.core.js` `getAvailableProfiles(projectId)` — see the `firestore.rules` comment at the `profiles/{profileId}` `list` rule: *"Firestore only honors a resource.data-based list clause when the query itself filters on the same field with `==`"*). That fix was applied as a one-off, in a code comment, with no named/catalogued invariant — so nothing existed to check *other* `resource.data`-dependent `list` rules against their client query call sites, and it recurred unnoticed on `tasks/{id}/events`.

## Architectural Surface Mapping

1. **UI Surface**: N/A — no styling/layout change. Symptom (empty timeline) is a side effect of the Data Surface bug.
2. **Data Surface** — **Affected**. `TaskDetailsModal.jsx`: two call sites (`fetchHistory` auto-fetch effect, `handleTimelineToggle` lazy-expand) both fixed.
3. **Reactive Surface**: N/A — no state/hook/context shape changes, only the query construction.
4. **Service Surface**: N/A — `firestore.rules` itself is unchanged; the fix is entirely client-side query shape, matching the rule's existing (correct) authorization logic.
5. **Module Surface**: N/A — no new files, routes, or dependencies in the app itself (test/seed tooling is dev-only).
6. **Governance Surface** — **Affected**. New invariant catalogued: **P105** (`.agent/standards-catalog.json`) — "Firestore List-Rule / Client-Query Filter Parity." `manualOnly: true` for now (no scanner yet — matches this repo's own precedent: P83 also started manual-only and only got `check-firestore-null-safe-reads.cjs` after it recurred a second time under INC-069). If this recurs again on a third collection, that's the trigger to build the equivalent scanner for P105.

## Fixes Applied

1. `src/components/TaskDetailsModal.jsx` — both `events` subcollection queries (auto-fetch effect + lazy timeline-expand handler) now add `where('projectId', '==', task.projectId)` when `task.projectId` is known, matching the rule's provable branch. `progressUpdates`/`auditLogs` queries were already unconditionally `allow read, list: if isAuthenticated()` — not affected, not touched.
2. `.agent/standards-catalog.json` — new entry **P105** naming the invariant so future `resource.data`-dependent `list` rules get checked against their client query call sites before shipping.
3. E2E coverage: `tests/playwright/subtasks-task226.spec.js` now deep-links a seeded fixture task (`scripts/e2e/seed-test-task.cjs`) and asserts zero `permission-denied` console errors opening `TaskDetailsModal` — this is what will catch a regression or a recurrence on another subcollection going forward.

## Litmus Test

> *"If a new developer touches this codebase tomorrow, is it physically impossible for them to make this same mistake without violating a written protocol?"*

Not impossible — P105 is manual-only, same as P83 was before its own recurrence forced a scanner. But it's no longer *unnamed*: the `profiles`-collection fix is now generalized into a catalogued, cross-referenced invariant instead of living only as a comment on one rule block, so the next person hitting this class of bug has something to search for (`P105`, or this incident) before re-deriving the diagnosis from scratch — which is what actually happened here (root-caused via first-principles Firestore rules reasoning, then confirmed only by finding the `profiles` rule's own comment already describing the identical fix).

> *"Is there an ADR that would have made this bug architecturally impossible to introduce?"*

No — this is a genuine Firestore platform constraint (list rules can't filter per-doc against unconstrained queries), not a design choice this codebase made. The realistic mitigation is the one applied: name it, catalogue it, and eventually script-check every `resource.data`-dependent `list`/`read` rule against its known client call sites, the same maturation path P83 already took.

## Related

- **P105**: `.agent/standards-catalog.json` — this incident's newly catalogued invariant
- **P83**: `.agent/standards-catalog.json` — sibling Firestore-rules invariant (null-safe reads); precedent for the manual-then-scripted enforcement maturation path
- **INC-069**: `docs/incidents/INC-069-checklist-instances-p83-recurrence.md` — the recurrence that forced P83 to get a scanner; template for this doc
- `firestore.rules` `profiles/{profileId}` `list` rule comment — the original (uncatalogued) instance of this exact fix
- `src/services/ProfileUserMappingService.core.js` `getAvailableProfiles(projectId)` — the original client-side fix this incident's fix mirrors
- `.agent/patterns/playwright-spa-e2e-testing-best-practices.md` — the E2E pattern doc whose own coverage-completeness push (positive assertions, not just "not on login") is what surfaced this
